import express from 'express';
import { TopicModel } from '../models/Topic.js';
import { SubtopicNoteModel } from '../models/SubtopicNote.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const DEFAULT_DOMAINS = [
  'dsa',
  'system-design',
  'os',
  'dbms-sql',
  'computer-networks',
  'oops',
  'javascript',
  'react',
  'nodejs',
  'azure',
  'genai-ml'
];

/**
 * GET /api/vault/domains
 * Returns all available domains with topic counts and subtopic counts.
 */
router.get('/domains', async (req, res) => {
  try {
    const topicStats = await TopicModel.aggregate([
      {
        $group: {
          _id: '$domain',
          topicCount: { $sum: 1 },
          categories: { $addToSet: '$category' }
        }
      }
    ]);

    const statsMap = new Map();
    topicStats.forEach(stat => {
      statsMap.set(stat._id, {
        domain: stat._id,
        topicCount: stat.topicCount,
        categories: stat.categories
      });
    });

    // Ensure default domains are present
    const domains = DEFAULT_DOMAINS.map(d => {
      if (statsMap.has(d)) {
        return statsMap.get(d);
      }
      return {
        domain: d,
        topicCount: 0,
        categories: []
      };
    });

    // Append any custom domains created by user
    topicStats.forEach(stat => {
      if (!DEFAULT_DOMAINS.includes(stat._id)) {
        domains.push(stat);
      }
    });

    res.json({ success: true, domains });
  } catch (err) {
    console.error('Error fetching domains:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch domains' });
  }
});

/**
 * GET /api/vault/topics
 * Filter by domain, category, search query.
 * Returns topics with their subtopics metadata.
 */
router.get('/topics', async (req, res) => {
  try {
    const { domain, category, search } = req.query;
    const filter = {};

    if (domain && domain !== 'all') {
      filter.domain = domain;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(search.trim(), 'i')] } }
      ];
    }

    const topics = await TopicModel.find(filter)
      .sort({ domain: 1, category: 1, order: 1, createdAt: -1 })
      .lean();

    if (topics.length === 0) {
      return res.json({ success: true, topics: [] });
    }

    const topicIds = topics.map(t => t._id);
    const subtopics = await SubtopicNoteModel.find({ topicId: { $in: topicIds } })
      .select('topicId title revisionStatus lastRevisedAt order problems media')
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const subtopicMap = new Map();
    subtopics.forEach(st => {
      const tid = String(st.topicId);
      if (!subtopicMap.has(tid)) {
        subtopicMap.set(tid, []);
      }
      subtopicMap.get(tid).push({
        _id: st._id,
        title: st.title,
        revisionStatus: st.revisionStatus,
        lastRevisedAt: st.lastRevisedAt,
        problemsCount: (st.problems || []).length,
        hasMedia: (st.media || []).length > 0,
        order: st.order
      });
    });

    const enrichedTopics = topics.map(t => ({
      ...t,
      subtopics: subtopicMap.get(String(t._id)) || []
    }));

    res.json({ success: true, topics: enrichedTopics });
  } catch (err) {
    console.error('Error fetching topics:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch topics' });
  }
});

/**
 * POST /api/vault/topics
 * Auth required: Create a new Topic + default first Subtopic
 */
router.post('/topics', authenticateToken, async (req, res) => {
  try {
    const { domain, category, title, difficulty, importanceRating, tags, initialSubtopicTitle, contentMarkdown } = req.body;

    if (!domain || !category || !title) {
      return res.status(400).json({ success: false, message: 'domain, category, and title are required' });
    }

    const newTopic = new TopicModel({
      domain: domain.trim().toLowerCase(),
      category: category.trim(),
      title: title.trim(),
      difficulty: difficulty || 'Medium',
      importanceRating: importanceRating || 3,
      tags: Array.isArray(tags) ? tags : [],
      createdBy: req.user?.id || req.user?._id
    });

    const savedTopic = await newTopic.save();

    // Automatically create first subtopic note so user can immediately write
    const subtopic = new SubtopicNoteModel({
      topicId: savedTopic._id,
      title: (initialSubtopicTitle && initialSubtopicTitle.trim()) || 'Overview & Notes',
      contentMarkdown: contentMarkdown || `# ${savedTopic.title}\n\nStart writing your intuition, code snippets, and notes here...`,
      problems: [],
      media: [],
      revisionStatus: 'moderate',
      createdBy: req.user?.id || req.user?._id
    });

    const savedSubtopic = await subtopic.save();

    res.status(201).json({
      success: true,
      topic: {
        ...savedTopic.toObject(),
        subtopics: [savedSubtopic.toObject()]
      }
    });
  } catch (err) {
    console.error('Error creating topic:', err);
    res.status(500).json({ success: false, message: 'Failed to create topic' });
  }
});

/**
 * PUT /api/vault/topics/:id
 * Auth required: Update topic metadata
 */
router.put('/topics/:id', authenticateToken, async (req, res) => {
  try {
    const { domain, category, title, difficulty, importanceRating, tags, order } = req.body;
    const topic = await TopicModel.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    if (domain !== undefined) topic.domain = domain.trim().toLowerCase();
    if (category !== undefined) topic.category = category.trim();
    if (title !== undefined) topic.title = title.trim();
    if (difficulty !== undefined) topic.difficulty = difficulty;
    if (importanceRating !== undefined) topic.importanceRating = importanceRating;
    if (tags !== undefined) topic.tags = Array.isArray(tags) ? tags : [];
    if (order !== undefined) topic.order = order;

    const updated = await topic.save();
    res.json({ success: true, topic: updated });
  } catch (err) {
    console.error('Error updating topic:', err);
    res.status(500).json({ success: false, message: 'Failed to update topic' });
  }
});

/**
 * DELETE /api/vault/topics/:id
 * Auth required: Delete topic and all its subtopics
 */
router.delete('/topics/:id', authenticateToken, async (req, res) => {
  try {
    const topic = await TopicModel.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    await SubtopicNoteModel.deleteMany({ topicId: topic._id });
    await TopicModel.findByIdAndDelete(topic._id);

    res.json({ success: true, message: 'Topic and all subtopics deleted successfully' });
  } catch (err) {
    console.error('Error deleting topic:', err);
    res.status(500).json({ success: false, message: 'Failed to delete topic' });
  }
});

/**
 * GET /api/vault/topics/:topicId/subtopics
 * Get all subtopics belonging to a topic
 */
router.get('/topics/:topicId/subtopics', async (req, res) => {
  try {
    const subtopics = await SubtopicNoteModel.find({ topicId: req.params.topicId })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    res.json({ success: true, subtopics });
  } catch (err) {
    console.error('Error fetching subtopics:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch subtopics' });
  }
});

/**
 * GET /api/vault/subtopics/:id
 * Get single subtopic full note
 */
router.get('/subtopics/:id', async (req, res) => {
  try {
    const subtopic = await SubtopicNoteModel.findById(req.params.id).lean();
    if (!subtopic) {
      return res.status(404).json({ success: false, message: 'Subtopic note not found' });
    }

    const topic = await TopicModel.findById(subtopic.topicId).select('domain category title').lean();

    res.json({ 
      success: true, 
      subtopic,
      topic 
    });
  } catch (err) {
    console.error('Error fetching subtopic note:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch subtopic' });
  }
});

/**
 * POST /api/vault/topics/:topicId/subtopics
 * Auth required: Create a new subtopic under topic
 */
router.post('/topics/:topicId/subtopics', authenticateToken, async (req, res) => {
  try {
    const { title, contentMarkdown, problems, media, revisionStatus } = req.body;
    const topic = await TopicModel.findById(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const highestOrderDoc = await SubtopicNoteModel.findOne({ topicId: topic._id })
      .sort({ order: -1 })
      .select('order');
    const nextOrder = highestOrderDoc ? (highestOrderDoc.order || 0) + 1 : 0;

    const subtopic = new SubtopicNoteModel({
      topicId: topic._id,
      title: (title && title.trim()) || 'Untitled Subtopic',
      contentMarkdown: contentMarkdown || `# ${title || 'Notes'}\n\n`,
      problems: Array.isArray(problems) ? problems : [],
      media: Array.isArray(media) ? media : [],
      revisionStatus: revisionStatus || 'moderate',
      order: nextOrder,
      createdBy: req.user?.id || req.user?._id
    });

    const saved = await subtopic.save();
    res.status(201).json({ success: true, subtopic: saved });
  } catch (err) {
    console.error('Error creating subtopic:', err);
    res.status(500).json({ success: false, message: 'Failed to create subtopic' });
  }
});

/**
 * PUT /api/vault/subtopics/:id
 * Auth required: Update subtopic title, markdown, problems, media
 */
router.put('/subtopics/:id', authenticateToken, async (req, res) => {
  try {
    const { title, contentMarkdown, problems, media, revisionStatus, order } = req.body;
    const subtopic = await SubtopicNoteModel.findById(req.params.id);

    if (!subtopic) {
      return res.status(404).json({ success: false, message: 'Subtopic note not found' });
    }

    if (title !== undefined) subtopic.title = title.trim();
    if (contentMarkdown !== undefined) subtopic.contentMarkdown = contentMarkdown;
    if (problems !== undefined) subtopic.problems = problems;
    if (media !== undefined) subtopic.media = media;
    if (revisionStatus !== undefined) subtopic.revisionStatus = revisionStatus;
    if (order !== undefined) subtopic.order = order;
    subtopic.lastRevisedAt = new Date();

    const updated = await subtopic.save();
    res.json({ success: true, subtopic: updated });
  } catch (err) {
    console.error('Error updating subtopic:', err);
    res.status(500).json({ success: false, message: 'Failed to update subtopic' });
  }
});

/**
 * PATCH /api/vault/subtopics/:id/revision
 * Auth required: Quick toggle revision status (weak / moderate / mastered)
 */
router.patch('/subtopics/:id/revision', authenticateToken, async (req, res) => {
  try {
    const { revisionStatus } = req.body;
    if (!['weak', 'moderate', 'mastered'].includes(revisionStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid revision status' });
    }

    const subtopic = await SubtopicNoteModel.findByIdAndUpdate(
      req.params.id,
      { revisionStatus, lastRevisedAt: new Date() },
      { new: true }
    );

    if (!subtopic) {
      return res.status(404).json({ success: false, message: 'Subtopic not found' });
    }

    res.json({ success: true, subtopic });
  } catch (err) {
    console.error('Error updating revision status:', err);
    res.status(500).json({ success: false, message: 'Failed to update revision status' });
  }
});

/**
 * DELETE /api/vault/subtopics/:id
 * Auth required: Delete subtopic
 */
router.delete('/subtopics/:id', authenticateToken, async (req, res) => {
  try {
    const subtopic = await SubtopicNoteModel.findByIdAndDelete(req.params.id);
    if (!subtopic) {
      return res.status(404).json({ success: false, message: 'Subtopic not found' });
    }

    res.json({ success: true, message: 'Subtopic deleted successfully' });
  } catch (err) {
    console.error('Error deleting subtopic:', err);
    res.status(500).json({ success: false, message: 'Failed to delete subtopic' });
  }
});

export default router;

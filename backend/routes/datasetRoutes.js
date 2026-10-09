import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { DeletedDatasetItemModel } from '../models/DeletedDatasetItem.js';
import { authenticateToken } from '../middleware/auth.js';
import { datasetRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic resolver for interview-experiences directory across local monorepo and container setups
const findInterviewExperiencesDir = () => {
  const candidates = [
    // Standard local dev path: backend/routes -> root -> frontend/public/data/interview-experiences
    path.resolve(__dirname, '../../frontend/public/data/interview-experiences'),
    path.resolve(process.cwd(), '../frontend/public/data/interview-experiences'),
    path.resolve(process.cwd(), 'frontend/public/data/interview-experiences'),
    path.resolve(process.cwd(), 'public/data/interview-experiences'),
    path.resolve(__dirname, '../public/data/interview-experiences')
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.existsSync(path.join(candidate, 'interview_dataset_master_index.json'))) {
      return candidate;
    }
  }

  // Fallback to first path even if files don't exist yet
  return candidates[0];
};

const DATA_DIR = findInterviewExperiencesDir();

const cleanQuestionText = (qText) => {
  if (!qText || typeof qText !== 'string') return '';
  return qText
    .replace(/^#+\s*/, '')            // Remove leading markdown headers like ###, ##, #
    .replace(/^\d+[\.\)]\s*/, '')     // Remove leading question numbers like "6. ", "9) "
    .replace(/\*\*/g, '')             // Remove bold Markdown
    .replace(/`/g, '')                // Remove backticks
    .replace(/^[-*•]\s*/, '')         // Remove leading list bullets
    .trim();
};

const DATASET_PART_FILES = [
  'interview_dataset_part1_A_to_D.json',
  'interview_dataset_part2_E_to_L.json',
  'interview_dataset_part3_M_to_R.json',
  'interview_dataset_part4_S_to_Z.json',
];

const MASTER_INDEX_FILE = 'interview_dataset_master_index.json';
const SUBJECT_INDEX_FILE = 'subject_wise_questions_index.json';

// Helper to safe read JSON
const readJson = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.warn(`Could not read JSON at ${filePath}:`, err.message);
    return null;
  }
};

// Helper to safe write JSON
const writeJson = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn(`Could not write JSON at ${filePath} (ephemeral or read-only filesystem):`, err.message);
    return false;
  }
};

// GET /api/dataset/deleted - Returns all persisted deleted experiences and questions from MongoDB
router.get('/deleted', datasetRateLimiter, async (req, res) => {
  try {
    let deletedDocs = [];
    if (mongoose.connection.readyState === 1) {
      try {
        deletedDocs = await DeletedDatasetItemModel.find({}).lean();
      } catch (dbErr) {
        console.warn('MongoDB query error for deleted items:', dbErr.message);
      }
    }

    const deletedExperienceIds = deletedDocs
      .filter((doc) => doc.type === 'experience')
      .map((doc) => doc.itemId);

    const deletedQuestionTexts = deletedDocs
      .filter((doc) => doc.type === 'question')
      .map((doc) => doc.rawText || doc.itemId);

    return res.json({
      success: true,
      deletedExperienceIds,
      deletedQuestionTexts
    });
  } catch (error) {
    console.error('Error fetching deleted dataset items:', error);
    return res.json({
      success: true,
      deletedExperienceIds: [],
      deletedQuestionTexts: []
    });
  }
});

// DELETE /api/dataset/experience/:id (Protected with Auth + Rate Limiter)
router.delete('/experience/:id', authenticateToken, datasetRateLimiter, async (req, res) => {
  try {
    const expId = req.params.id;
    if (!expId) {
      return res.status(400).json({ success: false, message: 'Experience ID is required.' });
    }

    // 1. Persist deletion in MongoDB (cloud persistent database - survives Render redeploys)
    let persistedToDb = false;
    if (mongoose.connection.readyState === 1) {
      try {
        await DeletedDatasetItemModel.findOneAndUpdate(
          { type: 'experience', itemId: expId },
          { type: 'experience', itemId: expId, deletedAt: new Date() },
          { upsert: true, returnDocument: 'after' }
        );
        persistedToDb = true;
      } catch (dbErr) {
        console.warn('Could not persist deleted experience to MongoDB:', dbErr.message);
      }
    }

    // 2. If running locally with access to frontend dataset files, update local JSON files as well
    const isLocalDirAccessible = fs.existsSync(DATA_DIR);
    let diskModified = false;

    if (isLocalDirAccessible) {
      const allRemainingExperiences = [];

      DATASET_PART_FILES.forEach((fileName) => {
        const filePath = path.join(DATA_DIR, fileName);
        const data = readJson(filePath);
        if (data && Array.isArray(data.experiences)) {
          const initialCount = data.experiences.length;
          data.experiences = data.experiences.filter((exp) => exp.id !== expId);
          if (data.experiences.length < initialCount) {
            diskModified = true;
            data.metadata = data.metadata || {};
            data.metadata.total_experiences = data.experiences.length;
            writeJson(filePath, data);
          }
          allRemainingExperiences.push(...data.experiences);
        }
      });

      // Re-calculate and write Master Index if local files were modified
      if (diskModified) {
        const masterPath = path.join(DATA_DIR, MASTER_INDEX_FILE);
        const masterData = readJson(masterPath);

        if (masterData) {
          const compCounts = {};
          allRemainingExperiences.forEach((exp) => {
            if (exp.company) {
              compCounts[exp.company] = (compCounts[exp.company] || 0) + 1;
            }
          });

          const companiesSummary = Object.entries(compCounts)
            .map(([company, total_experiences]) => ({ company, total_experiences }))
            .sort((a, b) => b.total_experiences - a.total_experiences);

          masterData.metadata = masterData.metadata || {};
          masterData.metadata.total_experiences = allRemainingExperiences.length;
          masterData.metadata.total_companies = companiesSummary.length;
          masterData.companies_summary = companiesSummary;

          writeJson(masterPath, masterData);
        }
      }
    }

    return res.json({
      success: true,
      message: `Experience ${expId} permanently deleted.`,
      persistedToDb,
      diskFilesUpdated: diskModified
    });
  } catch (error) {
    console.error('Error deleting experience:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete interview experience. Please try again later.'
    });
  }
});

// DELETE /api/dataset/question (Protected with Auth + Rate Limiter)
router.delete('/question', authenticateToken, datasetRateLimiter, async (req, res) => {
  try {
    const { questionText } = req.body;
    if (!questionText || typeof questionText !== 'string') {
      return res.status(400).json({ success: false, message: 'Valid questionText is required.' });
    }

    const cleanedTarget = cleanQuestionText(questionText).toLowerCase();
    const rawTarget = questionText.trim().toLowerCase();

    // 1. Persist deletion in MongoDB (cloud persistent database - survives Render redeploys)
    let persistedToDb = false;
    if (mongoose.connection.readyState === 1) {
      try {
        await DeletedDatasetItemModel.findOneAndUpdate(
          { type: 'question', itemId: cleanedTarget },
          { type: 'question', itemId: cleanedTarget, rawText: questionText.trim(), deletedAt: new Date() },
          { upsert: true, returnDocument: 'after' }
        );
        persistedToDb = true;
      } catch (dbErr) {
        console.warn('Could not persist deleted question to MongoDB:', dbErr.message);
      }
    }

    // 2. If running locally with access to frontend dataset files, update local JSON files as well
    const isLocalDirAccessible = fs.existsSync(DATA_DIR);
    let totalQuestionsRemoved = 0;

    if (isLocalDirAccessible) {
      // Process Subject-Wise Question Index
      const subjectPath = path.join(DATA_DIR, SUBJECT_INDEX_FILE);
      const subjectData = readJson(subjectPath);

      if (subjectData) {
        Object.keys(subjectData).forEach((subjKey) => {
          if (Array.isArray(subjectData[subjKey])) {
            const initLen = subjectData[subjKey].length;
            subjectData[subjKey] = subjectData[subjKey].filter((qItem) => {
              const rawQ = (qItem.question || '').trim().toLowerCase();
              const cleanQ = cleanQuestionText(qItem.question || '').toLowerCase();
              return rawQ !== rawTarget && cleanQ !== cleanedTarget;
            });
            totalQuestionsRemoved += initLen - subjectData[subjKey].length;
          }
        });
        writeJson(subjectPath, subjectData);
      }

      // Remove from extracted_questions in Dataset Part Files
      DATASET_PART_FILES.forEach((fileName) => {
        const filePath = path.join(DATA_DIR, fileName);
        const data = readJson(filePath);
        if (data && Array.isArray(data.experiences)) {
          let modified = false;
          data.experiences.forEach((exp) => {
            if (Array.isArray(exp.extracted_questions)) {
              const initLen = exp.extracted_questions.length;
              exp.extracted_questions = exp.extracted_questions.filter((q) => {
                const rawQ = q.trim().toLowerCase();
                const cleanQ = cleanQuestionText(q).toLowerCase();
                return rawQ !== rawTarget && cleanQ !== cleanedTarget;
              });
              if (exp.extracted_questions.length < initLen) {
                modified = true;
              }
            }
          });
          if (modified) {
            writeJson(filePath, data);
          }
        }
      });
    }

    return res.json({
      success: true,
      message: `Question deleted successfully.`,
      persistedToDb,
      localEntriesRemoved: totalQuestionsRemoved
    });
  } catch (error) {
    console.error('Error deleting question:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete question. Please try again later.'
    });
  }
});

export default router;

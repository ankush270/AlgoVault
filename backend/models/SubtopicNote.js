import mongoose from 'mongoose';

const ProblemSchema = new mongoose.Schema({
  platform: { 
    type: String, 
    enum: ['leetcode', 'striver', 'gfg', 'codeforces', 'other'], 
    default: 'leetcode' 
  },
  problemNumber: { type: String, trim: true, default: '' },
  title: { type: String, required: true, trim: true },
  url: { type: String, trim: true, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  status: { type: String, enum: ['todo', 'solved', 'review'], default: 'todo' }
}, { _id: true });

const MediaItemSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['image', 'video', 'pdf'], 
    required: true 
  },
  title: { type: String, trim: true, default: '' },
  url: { type: String, required: true, trim: true }
}, { _id: true });

const SubtopicNoteSchema = new mongoose.Schema({
  topicId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Topic', 
    required: true, 
    index: true 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  contentMarkdown: { 
    type: String, 
    default: '' 
  },
  problems: [ProblemSchema],
  media: [MediaItemSchema],
  revisionStatus: { 
    type: String, 
    enum: ['weak', 'moderate', 'mastered'], 
    default: 'moderate',
    index: true
  },
  lastRevisedAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  order: { 
    type: Number, 
    default: 0 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

SubtopicNoteSchema.index({ topicId: 1, order: 1 });

export const SubtopicNoteModel = mongoose.model('SubtopicNote', SubtopicNoteSchema);

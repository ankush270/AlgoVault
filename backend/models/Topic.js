import mongoose from 'mongoose';

const TopicSchema = new mongoose.Schema({
  domain: { 
    type: String, 
    required: true, 
    trim: true, 
    index: true 
  }, // e.g., 'dsa', 'system-design', 'os', 'dbms-sql', or custom e.g., 'rust', 'devops'
  category: { 
    type: String, 
    required: true, 
    trim: true, 
    index: true 
  }, // e.g., 'Graphs', 'Dynamic Programming', 'Deadlocks'
  title: { 
    type: String, 
    required: true, 
    trim: true, 
    index: true 
  }, // e.g., 'Graph: Basics & Representations'
  slug: {
    type: String,
    trim: true,
    index: true
  },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Medium' 
  },
  importanceRating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    default: 3 
  },
  tags: [{ 
    type: String, 
    trim: true 
  }],
  order: { 
    type: Number, 
    default: 0 
  },
  isSystem: { 
    type: Boolean, 
    default: false,
    index: true
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

TopicSchema.index({ domain: 1, category: 1, order: 1 });

export const TopicModel = mongoose.model('Topic', TopicSchema);

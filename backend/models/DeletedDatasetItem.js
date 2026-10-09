import mongoose from 'mongoose';

const DeletedDatasetItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['experience', 'question'],
    required: true,
    index: true
  },
  itemId: {
    type: String,
    required: true,
    index: true
  },
  rawText: {
    type: String,
    default: ''
  },
  deletedAt: {
    type: Date,
    default: Date.now
  }
});

DeletedDatasetItemSchema.index({ type: 1, itemId: 1 }, { unique: true });

export const DeletedDatasetItemModel = mongoose.model('DeletedDatasetItem', DeletedDatasetItemSchema);

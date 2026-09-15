import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  leetcodeSolvedStatus: { type: Object, default: {} },
  progressState: { type: Object, default: {} },
  updatedAt: { type: Date, default: Date.now }
});

export const ProgressModel = mongoose.model('UserSyncProgress', ProgressSchema);

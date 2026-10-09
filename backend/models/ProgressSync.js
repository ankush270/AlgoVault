import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  leetcodeSolvedStatus: { type: Object, default: {} },
  progressState: { type: Object, default: {} },
  striverSolvedStatus: { type: Object, default: {} },
  savedInterviews: { type: Array, default: [] },
  arenaHistory: { type: Array, default: [] },
  arenaElo: { type: Number, default: 1500 },
  updatedAt: { type: Date, default: Date.now }
});

export const ProgressModel = mongoose.model('UserSyncProgress', ProgressSchema);

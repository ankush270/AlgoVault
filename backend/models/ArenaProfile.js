import mongoose from 'mongoose';

const MatchHistorySchema = new mongoose.Schema({
  id: { type: String, required: true },
  opponentName: { type: String, required: true },
  result: { type: String, enum: ['WIN', 'LOSS', 'DRAW'], required: true },
  eloDelta: { type: Number, required: true },
  timeTakenSeconds: { type: Number, required: true },
  problemTitle: { type: String, required: true },
  date: { type: String, required: true }
}, { _id: false });

const ArenaProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true, trim: true },
  elo: { type: Number, default: 1500, index: true },
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  draws: { type: Number, default: 0 },
  matchesPlayed: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  rankTitle: { type: String, default: 'Candidate' },
  badge: { type: String, default: 'Challenger' },
  recentMatches: { type: [MatchHistorySchema], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

export const ArenaProfileModel = mongoose.model('ArenaProfile', ArenaProfileSchema);

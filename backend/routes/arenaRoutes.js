import express from 'express';
import { ArenaProfileModel } from '../models/ArenaProfile.js';
import { validateArenaCode, ARENA_PROBLEMS } from '../services/arenaValidator.js';
import { authenticateToken } from '../middleware/auth.js';
import { executeRateLimiter, arenaRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const BENCHMARK_LEADERBOARD = [
  { rank: 1, username: 'Alex "SpeedCoder" Chen', elo: 2150, wins: 42, losses: 5, winRate: 89.4, badge: 'Grandmaster' },
  { rank: 2, username: 'Sarah_AlgoQueen', elo: 2010, wins: 38, losses: 8, winRate: 82.6, badge: 'Grandmaster' },
  { rank: 3, username: 'AlgoBot AI (Grandmaster Tier)', elo: 1980, wins: 150, losses: 12, winRate: 92.5, badge: 'AI Bot' },
  { rank: 4, username: 'Dev_Ninja_99', elo: 1850, wins: 29, losses: 11, winRate: 72.5, badge: 'Master' },
  { rank: 5, username: 'Elena_CodeCraft', elo: 1720, wins: 21, losses: 9, winRate: 70.0, badge: 'Master' }
];

function calculateRank(elo) {
  if (elo >= 2000) return { rankTitle: 'Grandmaster', badge: 'Grandmaster' };
  if (elo >= 1800) return { rankTitle: 'Master', badge: 'Master' };
  if (elo >= 1600) return { rankTitle: 'Challenger', badge: 'Challenger' };
  return { rankTitle: 'Candidate', badge: 'Candidate' };
}

// GET /api/arena/problems (Protected with Auth + Rate Limiter)
router.get('/problems', authenticateToken, arenaRateLimiter, (req, res) => {
  res.json({
    status: 'success',
    problems: ARENA_PROBLEMS.map(({ testCases, ...safeProblem }) => safeProblem)
  });
});

// POST /api/arena/run-tests (Protected with Auth + Rate Limiter)
router.post('/run-tests', authenticateToken, executeRateLimiter, async (req, res) => {
  try {
    const { problemId, language, code } = req.body;
    if (!problemId || !code) {
      return res.status(400).json({ error: 'problemId and code are required' });
    }

    if (typeof code !== 'string' || code.length > 65536) {
      return res.status(413).json({
        status: 'ERROR',
        testsPassed: 0,
        totalTests: 0,
        allPassed: false,
        output: '',
        stderr: 'Code snippet exceeds maximum allowed size (64KB).'
      });
    }

    const evalResult = await validateArenaCode({ problemId, language, code });
    res.json(evalResult);
  } catch (err) {
    console.error('Error running arena tests:', err);
    res.status(500).json({
      status: 'ERROR',
      testsPassed: 0,
      totalTests: 5,
      allPassed: false,
      output: '',
      stderr: 'Execution service encountered an internal error. Please try again.'
    });
  }
});

// GET /api/arena/leaderboard (Public, Rate Limited)
router.get('/leaderboard', arenaRateLimiter, async (req, res) => {
  try {
    let dbProfiles = [];
    try {
      dbProfiles = await ArenaProfileModel.find({})
        .sort({ elo: -1 })
        .limit(20)
        .lean();
    } catch (dbErr) {
      console.warn('MongoDB not available for leaderboard query, returning fallback:', dbErr.message);
    }

    // Merge benchmark bot/seed players with real DB profiles
    const combined = [...dbProfiles.map((p) => ({
      username: p.username,
      elo: p.elo,
      wins: p.wins,
      losses: p.losses,
      winRate: p.winRate,
      badge: p.badge || calculateRank(p.elo).badge
    }))];

    // Ensure benchmark records are present if DB has fewer users
    for (const bench of BENCHMARK_LEADERBOARD) {
      if (!combined.some((c) => c.username === bench.username)) {
        combined.push(bench);
      }
    }

    // Sort by ELO descending
    combined.sort((a, b) => b.elo - a.elo);

    // Assign rank positions
    const ranked = combined.slice(0, 25).map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    res.json({
      status: 'success',
      leaderboard: ranked
    });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve arena leaderboard.' });
  }
});

// GET /api/arena/profile/me (Protected: Get current user's full arena profile)
router.get('/profile/me', authenticateToken, arenaRateLimiter, async (req, res) => {
  try {
    const userId = req.user.id;
    let profile = await ArenaProfileModel.findOne({ userId });

    if (!profile) {
      profile = {
        userId,
        username: req.user.name || 'Candidate',
        elo: 1500,
        wins: 0,
        losses: 0,
        draws: 0,
        matchesPlayed: 0,
        winRate: 0,
        rankTitle: 'Candidate',
        badge: 'Candidate',
        recentMatches: []
      };
    }

    res.json({ status: 'success', profile });
  } catch (err) {
    console.error('Self profile fetch error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve your arena profile.' });
  }
});

// GET /api/arena/profile/:userId (Protected with Auth + Rate Limiter + Privacy Filter)
router.get('/profile/:userId', authenticateToken, arenaRateLimiter, async (req, res) => {
  try {
    const targetUserId = req.params.userId === 'me' ? req.user.id : req.params.userId;
    const isSelf = targetUserId === req.user.id;

    let profile = await ArenaProfileModel.findOne({ userId: targetUserId });

    if (!profile) {
      if (isSelf) {
        profile = {
          userId: targetUserId,
          username: req.user.name || 'Candidate',
          elo: 1500,
          wins: 0,
          losses: 0,
          draws: 0,
          matchesPlayed: 0,
          winRate: 0,
          rankTitle: 'Candidate',
          badge: 'Candidate',
          recentMatches: []
        };
      } else {
        return res.status(404).json({ status: 'error', message: 'Arena profile not found.' });
      }
    }

    // If viewing another user's profile, return only sanitized public statistics
    if (!isSelf) {
      return res.json({
        status: 'success',
        profile: {
          username: profile.username,
          elo: profile.elo,
          wins: profile.wins,
          losses: profile.losses,
          draws: profile.draws,
          matchesPlayed: profile.matchesPlayed,
          winRate: profile.winRate,
          rankTitle: profile.rankTitle,
          badge: profile.badge,
          recentMatches: (profile.recentMatches || []).slice(0, 5)
        }
      });
    }

    res.json({ status: 'success', profile });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve arena profile.' });
  }
});

export default router;


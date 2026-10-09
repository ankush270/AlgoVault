import express from 'express';
import { ProgressModel } from '../models/ProgressSync.js';
import { authenticateToken } from '../middleware/auth.js';
import { syncRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * GET /api/sync
 * Retrieves the authenticated user's progress data.
 * Protected by authenticateToken: strictly uses req.user.id to eliminate IDOR and data crossover.
 */
const handleGetSync = async (req, res) => {
  try {
    const rawUserId = req.user?.id || req.user?._id;
    if (!rawUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid authentication token' });
    }

    const targetUserId = String(rawUserId);
    const userEmail = req.user?.email ? req.user.email.toLowerCase().trim() : null;

    // 1. Primary lookup: Strictly by the user's authentic MongoDB userId (never uses risky $or)
    let userDoc = await ProgressModel.findOne({ userId: targetUserId });

    // 2. Safe Legacy Migration: Only if NO document exists for this userId, check if an old record used email as userId
    if (!userDoc && userEmail) {
      const legacyDoc = await ProgressModel.findOne({ userId: userEmail });
      if (legacyDoc) {
        // Migrate legacy doc to canonical userId
        legacyDoc.userId = targetUserId;
        userDoc = await legacyDoc.save();
      }
    }

    if (!userDoc) {
      return res.status(404).json({ success: false, message: 'No sync data found for this account' });
    }

    res.json({
      success: true,
      userId: userDoc.userId,
      leetcodeSolvedStatus: userDoc.leetcodeSolvedStatus || {},
      progressState: userDoc.progressState || {},
      striverSolvedStatus: userDoc.striverSolvedStatus || {},
      savedInterviews: userDoc.savedInterviews || [],
      arenaHistory: userDoc.arenaHistory || [],
      arenaElo: userDoc.arenaElo || 1500,
      updatedAt: userDoc.updatedAt
    });
  } catch (error) {
    console.error('Error fetching sync data:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve synchronization data. Please try again later.' });
  }
};

/**
 * POST /api/sync
 * Saves / upserts the authenticated user's progress data.
 * Protected by authenticateToken: strictly upserts by targetUserId.
 */
const handlePostSync = async (req, res) => {
  try {
    const rawUserId = req.user?.id || req.user?._id;
    if (!rawUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid authentication token' });
    }

    const targetUserId = String(rawUserId);
    const userEmail = req.user?.email ? req.user.email.toLowerCase().trim() : null;

    const {
      leetcodeSolvedStatus,
      progressState,
      striverSolvedStatus,
      savedInterviews,
      arenaHistory,
      arenaElo
    } = req.body;

    const updatePayload = {
      userId: targetUserId,
      updatedAt: new Date()
    };

    if (leetcodeSolvedStatus !== undefined) updatePayload.leetcodeSolvedStatus = leetcodeSolvedStatus;
    if (progressState !== undefined) updatePayload.progressState = progressState;
    if (striverSolvedStatus !== undefined) updatePayload.striverSolvedStatus = striverSolvedStatus;
    if (savedInterviews !== undefined) updatePayload.savedInterviews = savedInterviews;
    if (arenaHistory !== undefined) updatePayload.arenaHistory = arenaHistory;
    if (arenaElo !== undefined) updatePayload.arenaElo = arenaElo;

    // Clean up any stale legacy duplicate record if user was previously keyed by email
    if (userEmail && userEmail !== targetUserId) {
      await ProgressModel.deleteOne({ userId: userEmail }).catch(() => {});
    }

    // Strict single-key atomic upsert on canonical userId — ZERO cross-user collision risk
    const updatedDoc = await ProgressModel.findOneAndUpdate(
      { userId: targetUserId },
      { $set: updatePayload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      message: 'All learning progress, sheets, interviews, and arena stats synced to MongoDB!',
      updatedAt: updatedDoc.updatedAt
    });
  } catch (error) {
    console.error('Error saving sync data:', error);
    res.status(500).json({ success: false, message: 'Failed to save synchronization data. Please try again later.' });
  }
};

// Protect all routes with authenticateToken and syncRateLimiter.
// Note: URL param :userId is ignored to strictly enforce req.user.id ownership.
router.get('/', authenticateToken, syncRateLimiter, handleGetSync);
router.get('/:userId', authenticateToken, syncRateLimiter, handleGetSync);

router.post('/', authenticateToken, syncRateLimiter, handlePostSync);
router.post('/:userId', authenticateToken, syncRateLimiter, handlePostSync);

export default router;

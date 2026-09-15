import express from 'express';
import { ProgressModel } from '../models/ProgressSync.js';

const router = express.Router();

// GET Sync Data for a User Key or Email
router.get('/:userId', async (req, res) => {
  try {
    const rawUserId = req.params.userId || '';
    const userId = rawUserId.trim().toLowerCase();
    const userDoc = await ProgressModel.findOne({ userId });

    if (!userDoc) {
      return res.status(404).json({ success: false, message: 'No sync data found for this User Key' });
    }

    res.json({
      success: true,
      userId: userDoc.userId,
      leetcodeSolvedStatus: userDoc.leetcodeSolvedStatus || {},
      progressState: userDoc.progressState || {},
      updatedAt: userDoc.updatedAt
    });
  } catch (error) {
    console.error('Error fetching sync data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Save / Sync Data for a User Key or Email
router.post('/:userId', async (req, res) => {
  try {
    const rawUserId = req.params.userId || '';
    const userId = rawUserId.trim().toLowerCase();
    const { leetcodeSolvedStatus, progressState } = req.body;

    const updatedDoc = await ProgressModel.findOneAndUpdate(
      { userId },
      {
        userId,
        leetcodeSolvedStatus: leetcodeSolvedStatus || {},
        progressState: progressState || {},
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Progress successfully synced to MongoDB!',
      updatedAt: updatedDoc.updatedAt
    });
  } catch (error) {
    console.error('Error saving sync data:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

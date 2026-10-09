import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

import mongoose from 'mongoose';
import { runNodeJobScraper } from '../scrapers/node_job_scraper.js';
import { getJobsFilePath } from '../utils/jobPathResolver.js';
import Job from '../models/Job.js';
import { authenticateToken } from '../middleware/auth.js';
import { jobSyncRateLimiter } from '../middleware/rateLimiter.js';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const COMPANY_SCRAPER_PATH = path.join(__dirname, '../scrapers/company_scraper.py');
const GENERAL_SCRAPER_PATH = path.join(__dirname, '../scrapers/job_scraper.py');

// Mutex & Lease Tracking (Crash-safe & Self-healing)
let isSyncing = false;
let syncLockTimestamp = 0;
const SYNC_LOCK_TTL_MS = 2 * 60 * 1000; // 2 minutes maximum lock lease duration
const GLOBAL_SCRAPER_TIMEOUT_MS = 90 * 1000; // 90 seconds watchdog timeout

let lastSyncTime = new Date().toISOString();
let lastSyncTimestamp = 0;
let lastSyncResult = 'Initialized';
const MIN_MANUAL_SYNC_INTERVAL_MS = 3 * 60 * 1000; // 3-minute cooldown between manual scraping triggers

let cachedPythonBin = undefined;

/**
 * Checks whether the scraper mutex is actively locked.
 * Self-healing: Automatically breaks and reclaims stale locks older than SYNC_LOCK_TTL_MS.
 */
export const isJobScraperLocked = () => {
  if (!isSyncing) return false;
  const now = Date.now();
  if (now - syncLockTimestamp > SYNC_LOCK_TTL_MS) {
    console.warn(`⚠️ [AUTO-SCHEDULER] Detected stale/hung sync lock lease (>${SYNC_LOCK_TTL_MS / 1000}s). Forcibly reclaiming lock.`);
    isSyncing = false;
    syncLockTimestamp = 0;
    return false;
  }
  return true;
};

/**
 * Dynamically detects the available Python binary on the host environment:
 * 1. process.env.PYTHON_BIN (if explicitly set)
 * 2. python3 (standard on Linux, Render, Ubuntu, Docker)
 * 3. python (standard on Windows / legacy environments)
 * 4. null if Python is not installed
 */
export const detectPythonBinary = async () => {
  if (cachedPythonBin !== undefined) return cachedPythonBin;

  if (process.env.PYTHON_BIN) {
    cachedPythonBin = process.env.PYTHON_BIN;
    return cachedPythonBin;
  }

  for (const bin of ['python3', 'python']) {
    try {
      await execAsync(`${bin} --version`, { timeout: 3000 });
      cachedPythonBin = bin;
      return bin;
    } catch {
      // Binary not found or timed out, try next candidate
    }
  }

  cachedPythonBin = null;
  return null;
};

// Helper function to run scraping with watchdog protection
export const runJobScraper = async () => {
  if (isJobScraperLocked()) {
    console.log('⚡ Job sync already in progress. Skipping...');
    return { status: 'already_running' };
  }

  isSyncing = true;
  syncLockTimestamp = Date.now();
  console.log('🤖 [AUTO-SCHEDULER] Starting automatic background job scraping across 600+ companies...');

  // Watchdog timeout to prevent hangs
  const watchdogPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Global scraper execution timed out after ${GLOBAL_SCRAPER_TIMEOUT_MS / 1000} seconds.`));
    }, GLOBAL_SCRAPER_TIMEOUT_MS);
  });

  const executeScrapers = async () => {
    // 1. Primary: Run native Node.js scraper directly for instant reliable fetching (no external Python dependency)
    const nodeScraperResult = await runNodeJobScraper();

    // 2. Secondary: If Python runtime is available, run supplementary Python scrapers with timeout and error checking
    const pythonBin = await detectPythonBinary();
    if (pythonBin) {
      console.log(`🐍 [AUTO-SCHEDULER] Python binary detected (${pythonBin}). Executing supplementary scrapers...`);
      if (fs.existsSync(COMPANY_SCRAPER_PATH)) {
        try {
          await execAsync(`"${pythonBin}" "${COMPANY_SCRAPER_PATH}"`, { timeout: 30000 });
        } catch (pyErr1) {
          console.warn('⚠️ [AUTO-SCHEDULER] Company Python scraper non-fatal error:', pyErr1.message);
        }
      }

      if (fs.existsSync(GENERAL_SCRAPER_PATH)) {
        try {
          await execAsync(`"${pythonBin}" "${GENERAL_SCRAPER_PATH}"`, { timeout: 30000 });
        } catch (pyErr2) {
          console.warn('⚠️ [AUTO-SCHEDULER] General Python scraper non-fatal error:', pyErr2.message);
        }
      }
    } else {
      console.log('ℹ️ [AUTO-SCHEDULER] Python runtime not detected; native Node.js scraper completed all job aggregations successfully.');
    }

    return nodeScraperResult;
  };

  try {
    const nodeScraperResult = await Promise.race([executeScrapers(), watchdogPromise]);

    lastSyncTime = new Date().toISOString();
    lastSyncTimestamp = Date.now();
    lastSyncResult = 'Success';
    console.log('✅ [AUTO-SCHEDULER] Background job sync completed at', lastSyncTime);
    return { status: 'success', time: lastSyncTime, nodeJobsCount: nodeScraperResult?.count };
  } catch (err) {
    lastSyncResult = `Error: ${err.message}`;
    console.error('Job scraper error:', err.message);
    return { status: 'error', message: err.message };
  } finally {
    // Guaranteed lock release
    isSyncing = false;
    syncLockTimestamp = 0;
  }
};

// Start Automatic Scheduler: Scrapes every 6 hours automatically (Zero manual effort needed!)
export const startAutomaticJobScheduler = () => {
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
  
  // Initial background run 5 seconds after server starts
  setTimeout(() => {
    runJobScraper();
  }, 5000);

  // Recurring background interval
  setInterval(() => {
    runJobScraper();
  }, SIX_HOURS_MS);

  console.log('⏰ [AUTO-SCHEDULER] Automatic job synchronization scheduler enabled (runs on backend start & every 6 hours).');
};

// GET /api/jobs - Return all scraped jobs (supports local monorepo, cloud instances & MongoDB fallback)
router.get('/', async (req, res) => {
  try {
    const jobsFilePath = getJobsFilePath(false);

    if (fs.existsSync(jobsFilePath)) {
      try {
        const data = fs.readFileSync(jobsFilePath, 'utf-8');
        const jobs = JSON.parse(data);
        if (Array.isArray(jobs) && jobs.length > 0) {
          return res.json({
            status: 'success',
            count: jobs.length,
            isSyncing: isJobScraperLocked(),
            lastSyncTime: lastSyncTime,
            jobs: jobs
          });
        }
      } catch (parseErr) {
        console.warn('⚠️ [JOBS] Failed to parse jobs JSON file:', parseErr.message);
      }
    }

    // Secondary fallback: Query MongoDB if connected and file was missing or empty
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const mongoJobs = await Job.find({}).sort({ createdAt: -1 }).limit(300).lean();
        if (mongoJobs && mongoJobs.length > 0) {
          return res.json({
            status: 'success',
            count: mongoJobs.length,
            isSyncing: isJobScraperLocked(),
            lastSyncTime: lastSyncTime,
            source: 'mongodb',
            jobs: mongoJobs.map((j) => ({
              company: j.company,
              title: j.title,
              location: j.location,
              tags: j.tags,
              url: j.url,
              source: j.source,
              date: j.date
            }))
          });
        }
      } catch (dbErr) {
        console.warn('⚠️ [JOBS] MongoDB fallback query error:', dbErr.message);
      }
    }

    return res.json({ status: 'success', count: 0, isSyncing: isJobScraperLocked(), jobs: [] });
  } catch (err) {
    console.error('Job fetch error:', err);
    return res.status(500).json({ status: 'error', message: 'Failed to fetch job postings. Please try again later.' });
  }
});

// GET /api/jobs/status - Return scheduler & sync state
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    isSyncing: isJobScraperLocked(),
    lastSyncTime,
    lastSyncResult,
    autoSchedulerActive: true,
    interval: 'Every 6 Hours'
  });
});

// POST /api/jobs/sync - Protected Manual Trigger (Auth + Rate Limited + Cooldown)
router.post('/sync', authenticateToken, jobSyncRateLimiter, async (req, res) => {
  if (isJobScraperLocked()) {
    return res.json({
      status: 'in_progress',
      message: 'Background scraper is already running and updating jobs...'
    });
  }

  const timeSinceLastSync = Date.now() - lastSyncTimestamp;
  if (timeSinceLastSync < MIN_MANUAL_SYNC_INTERVAL_MS) {
    const remainingSecs = Math.ceil((MIN_MANUAL_SYNC_INTERVAL_MS - timeSinceLastSync) / 1000);
    return res.json({
      status: 'fresh',
      message: `Job listings are already fresh! You can trigger a new scan in ${remainingSecs} seconds.`
    });
  }

  lastSyncTimestamp = Date.now();

  // Trigger scraper asynchronously
  runJobScraper();

  return res.json({
    status: 'success',
    message: '🚀 Scraper launched in background! Job listings will automatically update in a few seconds.'
  });
});

export default router;

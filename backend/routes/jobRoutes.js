import express from 'express';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const JOBS_FILE_PATH = path.join(__dirname, '../../frontend/public/data/jobs.json');
const COMPANY_SCRAPER_PATH = path.join(__dirname, '../../scratch/company_scraper.py');
const GENERAL_SCRAPER_PATH = path.join(__dirname, '../../scratch/job_scraper.py');

let isSyncing = false;
let lastSyncTime = new Date().toISOString();
let lastSyncResult = 'Initialized';

// Helper function to run scraping
export const runJobScraper = () => {
  if (isSyncing) {
    console.log('⚡ Job sync already in progress. Skipping...');
    return Promise.resolve({ status: 'already_running' });
  }

  isSyncing = true;
  console.log('🤖 [AUTO-SCHEDULER] Starting automatic background job scraping across 600+ companies...');

  return new Promise((resolve) => {
    // Run company scraper
    exec(`python "${COMPANY_SCRAPER_PATH}"`, (err1, stdout1, stderr1) => {
      if (err1) {
        console.error('Company scraper error:', stderr1);
      }

      // Run general scraper (RemoteOK, Himalayas, Remotive)
      exec(`python "${GENERAL_SCRAPER_PATH}"`, (err2, stdout2, stderr2) => {
        isSyncing = false;
        lastSyncTime = new Date().toISOString();
        lastSyncResult = 'Success';
        console.log('✅ [AUTO-SCHEDULER] Background job sync completed at', lastSyncTime);
        resolve({ status: 'success', time: lastSyncTime });
      });
    });
  });
};

// Start Automatic Scheduler: Scrapes every 6 hours automatically (Zero manual effort needed!)
export const startAutomaticJobScheduler = () => {
  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
  
  // Initial background run 30 seconds after server starts
  setTimeout(() => {
    runJobScraper();
  }, 30000);

  // Recurring background interval
  setInterval(() => {
    runJobScraper();
  }, SIX_HOURS_MS);

  console.log('⏰ [AUTO-SCHEDULER] Automatic 6-hour job synchronization scheduler enabled.');
};

// GET /api/jobs - Return all scraped jobs
router.get('/', (req, res) => {
  try {
    if (fs.existsSync(JOBS_FILE_PATH)) {
      const data = fs.readFileSync(JOBS_FILE_PATH, 'utf-8');
      const jobs = JSON.parse(data);
      return res.json({
        status: 'success',
        count: jobs.length,
        isSyncing: isSyncing,
        lastSyncTime: lastSyncTime,
        jobs: jobs
      });
    }
    return res.json({ status: 'success', count: 0, isSyncing: isSyncing, jobs: [] });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/jobs/status - Return scheduler & sync state
router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    isSyncing,
    lastSyncTime,
    lastSyncResult,
    autoSchedulerActive: true,
    interval: 'Every 6 Hours'
  });
});

// POST /api/jobs/sync - Instant 1-click manual trigger button
router.post('/sync', async (req, res) => {
  if (isSyncing) {
    return res.json({
      status: 'in_progress',
      message: 'Background scraper is already running and updating jobs...'
    });
  }

  // Trigger scraper asynchronously
  runJobScraper();

  return res.json({
    status: 'success',
    message: '🚀 Scraper launched in background! Job listings will automatically update in a few seconds.'
  });
});

export default router;

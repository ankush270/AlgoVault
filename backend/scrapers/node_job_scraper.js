import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { getJobsFilePath } from '../utils/jobPathResolver.js';
import Job from '../models/Job.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runNodeJobScraper = async () => {
  console.log('🤖 [NODE-SCRAPER] Starting automatic background tech job fetching across RemoteOK & Remotive APIs...');
  
  let newJobs = [];

  // 1. Fetch RemoteOK
  try {
    const res = await fetch('https://remoteok.com/api', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.slice(1).forEach((item) => {
          if (item && item.position) {
            newJobs.push({
              company: item.company || 'Unknown',
              title: item.position || 'Software Engineer',
              location: item.location || 'Remote / Worldwide',
              tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
              url: item.url || 'https://remoteok.com',
              source: 'RemoteOK',
              date: item.date || new Date().toISOString()
            });
          }
        });
      }
    }
  } catch (err) {
    console.error('⚠️ [NODE-SCRAPER] RemoteOK API error:', err.message);
  }

  // 2. Fetch Remotive
  try {
    const res = await fetch('https://remotive.com/api/remote-jobs?category=software-dev&limit=50');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.jobs)) {
        data.jobs.forEach((item) => {
          newJobs.push({
            company: item.company_name || 'Tech Company',
            title: item.title || 'Software Engineer',
            location: item.candidate_required_location || 'Remote',
            tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.category || 'Software Development'),
            url: item.url || 'https://remotive.com',
            source: 'Remotive',
            date: item.publication_date || new Date().toISOString()
          });
        });
      }
    }
  } catch (err) {
    console.error('⚠️ [NODE-SCRAPER] Remotive API error:', err.message);
  }

  if (newJobs.length > 0) {
    const readPath = getJobsFilePath(false);
    const writePath = getJobsFilePath(true);

    let existingJobs = [];
    if (fs.existsSync(readPath)) {
      try {
        existingJobs = JSON.parse(fs.readFileSync(readPath, 'utf-8'));
      } catch (e) {
        existingJobs = [];
      }
    }

    const existingUrls = new Set(existingJobs.map((j) => j.url).filter(Boolean));
    let addedCount = 0;

    newJobs.forEach((j) => {
      if (!existingUrls.has(j.url)) {
        existingJobs.unshift(j);
        existingUrls.add(j.url);
        addedCount++;
      }
    });

    // Write to resolved target path (works on local monorepo & isolated cloud instances)
    fs.mkdirSync(path.dirname(writePath), { recursive: true });
    fs.writeFileSync(writePath, JSON.stringify(existingJobs, null, 2), 'utf-8');
    console.log(`✅ [NODE-SCRAPER] Updated ${writePath}! (${addedCount} new jobs added, total ${existingJobs.length} listings)`);

    // Keep backend/data/jobs.json mirrored if writing elsewhere
    const backendDataPath = path.resolve(__dirname, '../data/jobs.json');
    if (path.resolve(writePath) !== backendDataPath) {
      try {
        fs.mkdirSync(path.dirname(backendDataPath), { recursive: true });
        fs.writeFileSync(backendDataPath, JSON.stringify(existingJobs, null, 2), 'utf-8');
      } catch (e) {
        // Non-critical mirror write
      }
    }

    // Persist to MongoDB if connected
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const ops = newJobs.map((job) => ({
          updateOne: {
            filter: { url: job.url },
            update: { $set: job },
            upsert: true,
          },
        }));
        await Job.bulkWrite(ops, { ordered: false });
        console.log(`💾 [NODE-SCRAPER] Synced ${ops.length} job postings to MongoDB collection.`);
      } catch (mongoErr) {
        console.warn('⚠️ [NODE-SCRAPER] MongoDB job sync warning:', mongoErr.message);
      }
    }

    return { status: 'success', addedCount, total: existingJobs.length };
  }

  return { status: 'no_new_jobs' };
};

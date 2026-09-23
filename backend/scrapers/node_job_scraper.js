import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JOBS_FILE_PATH = path.resolve(__dirname, '../../frontend/public/data/jobs.json');

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
    let existingJobs = [];
    if (fs.existsSync(JOBS_FILE_PATH)) {
      try {
        existingJobs = JSON.parse(fs.readFileSync(JOBS_FILE_PATH, 'utf-8'));
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

    fs.mkdirSync(path.dirname(JOBS_FILE_PATH), { recursive: true });
    fs.writeFileSync(JOBS_FILE_PATH, JSON.stringify(existingJobs, null, 2), 'utf-8');

    console.log(`✅ [NODE-SCRAPER] Updated ${JOBS_FILE_PATH}! (${addedCount} new jobs added, total ${existingJobs.length} listings)`);
    return { status: 'success', addedCount, total: existingJobs.length };
  }

  return { status: 'no_new_jobs' };
};

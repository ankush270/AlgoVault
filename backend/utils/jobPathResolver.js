import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dynamically resolves the jobs.json file path across:
 * - Local monorepo development (frontend/public/data/jobs.json)
 * - Isolated cloud container deployments (Render/Docker) (backend/data/jobs.json)
 * - Explicit environment variable override (process.env.JOBS_FILE_PATH)
 *
 * @param {boolean} forWriting - If true, returns a valid writable target path
 * @returns {string} - Absolute path to jobs.json
 */
export const getJobsFilePath = (forWriting = false) => {
  // 1. Explicit env var override
  if (process.env.JOBS_FILE_PATH) {
    return path.resolve(process.env.JOBS_FILE_PATH);
  }

  const readCandidates = [
    // Monorepo frontend paths (local development)
    path.resolve(__dirname, '../../frontend/public/data/jobs.json'),
    path.resolve(process.cwd(), '../frontend/public/data/jobs.json'),
    path.resolve(process.cwd(), 'frontend/public/data/jobs.json'),
    // Standalone container / cloud instance paths
    path.resolve(__dirname, '../data/jobs.json'),
    path.resolve(process.cwd(), 'data/jobs.json'),
    path.resolve(process.cwd(), 'public/data/jobs.json'),
  ];

  // For reading: return the first file that exists on disk
  if (!forWriting) {
    for (const candidate of readCandidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  // For writing: check if frontend/public/data exists (local dev monorepo)
  const monorepoWriteCandidates = [
    path.resolve(__dirname, '../../frontend/public/data/jobs.json'),
    path.resolve(process.cwd(), '../frontend/public/data/jobs.json'),
    path.resolve(process.cwd(), 'frontend/public/data/jobs.json'),
  ];

  for (const candidate of monorepoWriteCandidates) {
    if (fs.existsSync(path.dirname(candidate))) {
      return candidate;
    }
  }

  // Fallback for cloud instances (Render/Docker): backend/data/jobs.json
  return path.resolve(__dirname, '../data/jobs.json');
};

import express from 'express';
import { runCode, checkPistonHealth, initPistonPackages } from '../services/pistonService.js';
import { authenticateToken } from '../middleware/auth.js';
import { executeRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

const ALLOWED_LANGUAGES = new Set(['python', 'py', 'javascript', 'js', 'node', 'cpp', 'c++', 'java']);
const MAX_CODE_LENGTH = 65536; // 64 KB limit
const MAX_STDIN_LENGTH = 10240; // 10 KB limit

// GET /api/execute/health - Check execution engine status
router.get('/health', async (req, res) => {
  try {
    const health = await checkPistonHealth();
    res.json({
      status: 'ok',
      pistonAvailable: health.ok,
      pistonUrl: health.url,
      installedPackages: health.packages ? health.packages.filter(p => p.installed) : [],
      supportedLanguages: ['python', 'javascript', 'cpp', 'java'],
      fallbackAvailable: process.env.ALLOW_LOCAL_FALLBACK === 'true'
    });
  } catch (error) {
    console.error('Execute health check error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve code execution health status.' });
  }
});

// POST /api/execute/init - Trigger package install check (Protected: Admins/Authenticated users only)
router.post('/init', authenticateToken, async (req, res) => {
  try {
    initPistonPackages();
    res.json({ success: true, message: 'Piston runtime initialization started.' });
  } catch (error) {
    console.error('Execute init error:', error);
    res.status(500).json({ success: false, message: 'Failed to initialize execution engine.' });
  }
});

// POST /api/execute - Execute Code (Protected with Auth + Rate Limiter)
router.post('/', authenticateToken, executeRateLimiter, async (req, res) => {
  try {
    const { language, code, stdin } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        output: '',
        stderr: 'Code snippet is required.',
        executionTime: 0,
        memory: 0,
        status: 'ERROR'
      });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return res.status(413).json({
        output: '',
        stderr: `Code length exceeds maximum allowed limit of ${MAX_CODE_LENGTH / 1024}KB.`,
        executionTime: 0,
        memory: 0,
        status: 'ERROR'
      });
    }

    const normalizedLang = (language || '').toLowerCase().trim();
    if (!ALLOWED_LANGUAGES.has(normalizedLang)) {
      return res.status(400).json({
        output: '',
        stderr: `Unsupported language: '${language}'. Supported languages: python, javascript, cpp, java.`,
        executionTime: 0,
        memory: 0,
        status: 'ERROR'
      });
    }

    if (stdin && typeof stdin === 'string' && stdin.length > MAX_STDIN_LENGTH) {
      return res.status(413).json({
        output: '',
        stderr: `Standard input exceeds maximum allowed limit of ${MAX_STDIN_LENGTH / 1024}KB.`,
        executionTime: 0,
        memory: 0,
        status: 'ERROR'
      });
    }

    const result = await runCode({ language: normalizedLang, code, stdin });
    return res.json(result);
  } catch (error) {
    console.error('Execute route error:', error);
    return res.status(500).json({
      output: '',
      stderr: 'Execution service encountered an internal error. Please try again later.',
      executionTime: 0,
      memory: 0,
      status: 'ERROR'
    });
  }
});

export default router;


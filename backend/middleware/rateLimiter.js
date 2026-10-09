import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication routes (login, register).
 * Prevents brute-force attacks by limiting requests to 20 per 15-minute window per IP.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 attempts per IP
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

/**
 * Rate limiter for AI chat and AI code review endpoints.
 * Protects third-party API quotas and server resources from abuse.
 * Limits to 20 requests per 1-minute window per IP.
 */
export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Max 20 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many AI requests. Please slow down and try again shortly.'
  }
});

/**
 * Rate limiter for code execution and arena test evaluation.
 * Limits to 20 requests per minute per IP to prevent DoS, crypto-mining, and sandbox exhaustion.
 */
export const executeRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Max 20 execution runs per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    output: '',
    stderr: 'Rate limit exceeded: Too many code execution requests. Please wait a minute before running code again.',
    executionTime: 0,
    memory: 0,
    status: 'RATE_LIMITED'
  }
});

/**
 * Rate limiter for Arena profile lookups and problems retrieval.
 * Limits to 60 requests per minute per IP to prevent profile enumeration and brute-force scraping.
 */
export const arenaRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Max 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many arena requests. Please slow down and try again shortly.'
  }
});

/**
 * Rate limiter for dataset modifications and deletions.
 * Prevents mass-deletion and resource tampering attacks.
 * Limits to 30 requests per minute per IP.
 */
export const datasetRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Max 30 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many dataset deletion requests. Please slow down and try again shortly.'
  }
});

/**
 * Rate limiter for manual job scraping triggers.
 * Prevents third-party ATS API quota exhaustion and server CPU overload.
 * Limits to 2 manual triggers per 10-minute window per IP.
 */
export const jobSyncRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 2, // Max 2 manual triggers per 10 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'rate_limited',
    message: 'Manual job sync rate limit reached. Jobs auto-refresh periodically; please wait a few minutes before syncing again.'
  }
});

/**
 * Rate limiter for progress sync operations.
 * Limits to 60 requests per minute per IP to prevent sync spam and DB resource exhaustion.
 */
export const syncRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Max 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many sync requests. Please slow down and try again shortly.'
  }
});

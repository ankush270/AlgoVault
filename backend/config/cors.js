// Regex specifically for DevForge, AlgoVault & TechSwitch project deployments on Vercel (NOT all vercel apps)
export const vercelPreviewRegex = /^https:\/\/(?:dev-?forge|algo-?vault|techswitch(?:-pro)?)(?:-[a-z0-9-]+)?\.vercel\.app$/i;

export function getCorsOptions() {
  const envFrontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '';
  const additionalOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim().replace(/\/$/, '')).filter(Boolean)
    : [];

  const allowedOrigins = new Set([
    envFrontendUrl,
    ...additionalOrigins,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:4173'
  ].filter(Boolean));

  const originValidator = (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server health checks)
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.trim().replace(/\/+$/, '');

    // 1. Explicitly configured origins (FRONTEND_URL, ALLOWED_ORIGINS, standard dev ports)
    if (allowedOrigins.has(cleanOrigin)) {
      return callback(null, true);
    }

    // 2. Strict DevForge, AlgoVault & TechSwitch project preview/production deployments on Vercel
    if (vercelPreviewRegex.test(cleanOrigin)) {
      return callback(null, true);
    }

    // 3. Localhost origins for local development
    if (process.env.NODE_ENV !== 'production') {
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin);
      if (isLocalhost) {
        return callback(null, true);
      }
    }

    // Reject all unauthorized origins
    return callback(new Error(`CORS policy violation: Origin '${origin}' is not permitted.`), false);
  };

  return {
    origin: originValidator,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'api-subscription-key']
  };
}

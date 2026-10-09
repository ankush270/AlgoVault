import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import syncRoutes from './routes/syncRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import datasetRoutes from './routes/datasetRoutes.js';
import jobRoutes, { startAutomaticJobScheduler } from './routes/jobRoutes.js';
import executeRoutes from './routes/executeRoutes.js';
import arenaRoutes from './routes/arenaRoutes.js';
import vaultRoutes from './routes/vaultRoutes.js';
import { initPistonPackages } from './services/pistonService.js';
import setupSocketServer from './socketServer.js';
import { getCorsOptions } from './config/cors.js';

dotenv.config();

// Critical Security Validation: Crash server if JWT_SECRET is missing or empty
if (!process.env.JWT_SECRET || !process.env.JWT_SECRET.trim()) {
  console.error('❌ FATAL SECURITY ERROR: JWT_SECRET environment variable is missing.');
  console.error('Server cannot start with an insecure or missing JWT secret.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);

// Strict CORS Configuration
const corsOptions = getCorsOptions();

// Attach Socket.io Engine with matching secure CORS options
setupSocketServer(httpServer, corsOptions);

app.use(cors(corsOptions));

// Security: Constrain JSON request body size to 500kb to mitigate memory exhaustion & DoS attacks
app.use(express.json({ limit: '500kb' }));

// Middleware to gracefully handle oversized JSON bodies (413 Payload Too Large)
app.use((err, req, res, next) => {
  if (err && (err.type === 'entity.too.large' || err.status === 413)) {
    return res.status(413).json({
      success: false,
      message: 'Request payload too large. Maximum allowed size is 500KB.'
    });
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload.'
    });
  }
  next(err);
});


// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: '🚀 TechSwitch Pro API Backend is running.'
  });
});

// Health check Endpoint
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: 'ok',
    server: 'TechSwitch Pro MongoDB Sync API',
    mongoConnected: isDbConnected
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dataset', datasetRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/execute', executeRoutes);
app.use('/api/arena', arenaRoutes);
app.use('/api/vault', vaultRoutes);

// Centralized Error Handling Middleware: Prevents stack trace / internal details leakage
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred. Please try again later.'
  });
});

// Boot Server only after Database connection is confirmed
const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`🚀 DevForge API & Socket.io Server running on http://localhost:${PORT}`);
      // Start Automatic Job Scraping Scheduler
      startAutomaticJobScheduler();
      // Initialize Piston runtime packages
      initPistonPackages();
    });
  } catch (err) {
    console.error('💥 Fatal error starting server:', err);
    process.exit(1);
  }
};

// Graceful Shutdown
const handleShutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
  try {
    httpServer.close(() => {
      console.log('HTTP server closed.');
    });
    await mongoose.connection.close(false);
    console.log('MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

startServer();


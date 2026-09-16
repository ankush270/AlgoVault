import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import syncRoutes from './routes/syncRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const cleanFrontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '';
    const cleanOrigin = origin.replace(/\/$/, '');

    if (
      cleanOrigin.includes('vercel.app') || 
      cleanOrigin.includes('localhost') || 
      cleanOrigin.includes('127.0.0.1') ||
      (cleanFrontendUrl && cleanOrigin === cleanFrontendUrl)
    ) {
      return callback(null, true);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'api-subscription-key']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Connect Database
connectDB();

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

app.listen(PORT, () => {
  console.log(`🚀 TechSwitch Pro Auth & Sync Server running on http://localhost:${PORT}`);
});

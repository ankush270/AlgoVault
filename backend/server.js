import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import syncRoutes from './routes/syncRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Connect Database
connectDB();

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

app.listen(PORT, () => {
  console.log(`🚀 TechSwitch Pro Auth & Sync Server running on http://localhost:${PORT}`);
});

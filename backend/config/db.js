import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

export const getMongoUri = () => {
  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  return rawUri ? rawUri.trim() : 'mongodb://127.0.0.1:27017/techswitch_pro';
};

export const connectDB = async (retries = MAX_RETRIES) => {
  const uriToUse = getMongoUri();

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📡 Connecting to MongoDB (Attempt ${attempt}/${retries})...`);
      await mongoose.connect(uriToUse, {
        dbName: 'techswitch_pro',
        serverSelectionTimeoutMS: 5000 // Fast fail per attempt instead of hanging for 30s
      });
      console.log('✅ MongoDB Connected successfully!');
      return;
    } catch (err) {
      console.error(`❌ MongoDB Connection Error (Attempt ${attempt}/${retries}):`, err.message);
      if (attempt < retries) {
        console.log(`⏳ Retrying MongoDB connection in ${RETRY_INTERVAL_MS / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
      } else {
        console.error('💥 FATAL ERROR: Unable to connect to MongoDB after multiple attempts. Exiting process.');
        process.exit(1);
      }
    }
  }
};

// Monitor runtime connection lifecycle
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected! Waiting for automatic reconnection...');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected successfully.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err.message);
});


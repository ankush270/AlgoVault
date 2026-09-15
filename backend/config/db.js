import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uriToUse = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techswitch_pro';
    await mongoose.connect(uriToUse, { dbName: 'techswitch_pro' });
    console.log(`✅ MongoDB Connected successfully!`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
  }
};

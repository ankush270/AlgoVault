import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getMongoUri } from '../../../backend/config/db.js';

describe('MongoDB Connection URI Dual Variable Resolution', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.MONGODB_URI;
    delete process.env.MONGO_URI;
  });

  afterEach(() => {
    delete process.env.MONGODB_URI;
    delete process.env.MONGO_URI;
    Object.assign(process.env, originalEnv);
  });

  it('resolves MONGO_URI when MONGODB_URI is absent', () => {
    process.env.MONGO_URI = 'mongodb+srv://user:pass@cluster.mongodb.net/testdb';
    expect(getMongoUri()).toBe('mongodb+srv://user:pass@cluster.mongodb.net/testdb');
  });

  it('resolves MONGODB_URI when MONGO_URI is absent', () => {
    process.env.MONGODB_URI = 'mongodb+srv://admin:pass@cluster.mongodb.net/proddb';
    expect(getMongoUri()).toBe('mongodb+srv://admin:pass@cluster.mongodb.net/proddb');
  });

  it('prioritizes MONGODB_URI if both are specified and trims whitespace', () => {
    process.env.MONGODB_URI = '  mongodb+srv://primary:pass@cluster.mongodb.net/db1  ';
    process.env.MONGO_URI = 'mongodb+srv://secondary:pass@cluster.mongodb.net/db2';
    expect(getMongoUri()).toBe('mongodb+srv://primary:pass@cluster.mongodb.net/db1');
  });

  it('falls back to local mongo connection when neither environment variable is provided', () => {
    expect(getMongoUri()).toBe('mongodb://127.0.0.1:27017/techswitch_pro');
  });
});

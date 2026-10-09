import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pushToMongo, MongoSyncData } from '../services/mongoSync';

describe('mongoSync Service pushToMongo Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('skips sync and returns false when authentication token is missing', async () => {
    const result = await pushToMongo({ arenaElo: 1600 });
    expect(result).toBe(false);
  });

  it('correctly serializes and sends snapshot payload when called with pushToMongo(snapshot)', async () => {
    localStorage.setItem('techswitch_token', 'mock-jwt-token-123');

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    } as any);

    const snapshotPayload: Partial<MongoSyncData> = {
      arenaElo: 1650,
      striverSolvedStatus: { 'step-1-1': 'completed' },
      leetcodeSolvedStatus: { 'problem-1': 'mastered' }
    };

    const result = await pushToMongo(snapshotPayload);

    expect(result).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/sync'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-jwt-token-123'
        }),
        body: JSON.stringify(snapshotPayload)
      })
    );
  });

  it('handles legacy signature pushToMongo(key, snapshot) without dropping data', async () => {
    localStorage.setItem('techswitch_token', 'mock-jwt-token-123');

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    } as any);

    const snapshotPayload: Partial<MongoSyncData> = {
      arenaElo: 1700,
      savedInterviews: [{ id: 'int-1', title: 'Google Interview' }]
    };

    const result = await pushToMongo('user@example.com', snapshotPayload);

    expect(result).toBe(true);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/sync'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(snapshotPayload)
      })
    );
  });
});

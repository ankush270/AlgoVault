import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiSync, API_BASE_URL } from '../services/api';

describe('apiSync Service Unit Tests', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('attaches Authorization Bearer header when token is in localStorage for fetchUserData', async () => {
    localStorage.setItem('techswitch_token', 'test-token-xyz');
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, userId: 'user-123' }),
    });

    const result = await apiSync.fetchUserData('user-123');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/sync/user-123`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token-xyz',
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result).toEqual({ success: true, userId: 'user-123' });
  });

  it('allows tokenOverride in fetchUserData', async () => {
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await apiSync.fetchUserData('user-123', 'override-token');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/sync/user-123`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer override-token',
        }),
      })
    );
  });

  it('attaches Authorization Bearer header and payload in pushUserData', async () => {
    localStorage.setItem('techswitch_token', 'jwt-push-token-123');
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const leetcodeStatus = { 'two-sum': true };
    const progressState = { streak: 5 };

    const result = await apiSync.pushUserData('user-123', leetcodeStatus, progressState);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/sync/user-123`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer jwt-push-token-123',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          leetcodeSolvedStatus: leetcodeStatus,
          progressState: progressState,
        }),
      })
    );
    expect(result).toEqual({ success: true });
  });
});

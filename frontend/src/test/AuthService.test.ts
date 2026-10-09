import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { refreshAccessToken, logoutUserApi, registerUser, loginUser } from '../services/authService';

describe('Auth Service & Refresh Token Mechanism', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('refreshAccessToken successfully exchanges refresh token for new access token', async () => {
    const mockResponse = {
      success: true,
      token: 'new-access-token-7d',
      refreshToken: 'new-refresh-token-30d',
      user: {
        id: 'user-123',
        name: 'Jane Doe',
        email: 'jane@example.com'
      }
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse)
    } as any);

    const result = await refreshAccessToken('valid-refresh-token');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/refresh'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: 'valid-refresh-token' })
      })
    );

    expect(result.success).toBe(true);
    expect(result.token).toBe('new-access-token-7d');
    expect(result.refreshToken).toBe('new-refresh-token-30d');
  });

  it('logoutUserApi sends post request with refreshToken to revoke server session', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true })
    } as any);

    await logoutUserApi('token-to-revoke');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/auth/logout'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: 'token-to-revoke' })
      })
    );
  });

  it('handles network error gracefully in refreshAccessToken', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await refreshAccessToken('any-token');
    expect(result.success).toBe(false);
    expect(result.message).toContain('Network error');
  });
});

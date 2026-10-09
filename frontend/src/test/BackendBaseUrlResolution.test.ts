import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBackendBaseUrl, getApiBaseUrl } from '../services/api';
import { loginUser } from '../services/authService';
import { fetchFromMongo } from '../services/mongoSync';

describe('Backend Base URL Resolution Consistency Across Services', () => {
  const originalEnv = { ...import.meta.env };
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    // Restore env
    Object.keys(import.meta.env).forEach(key => {
      delete (import.meta.env as any)[key];
    });
    Object.assign(import.meta.env, originalEnv);
  });

  it('correctly prioritizes VITE_BACKEND_URL when only VITE_BACKEND_URL is provided', () => {
    delete (import.meta.env as any).VITE_API_URL;
    delete (import.meta.env as any).VITE_SYNC_SERVER_URL;
    (import.meta.env as any).VITE_BACKEND_URL = 'https://algovault-custom.onrender.com';

    expect(getBackendBaseUrl()).toBe('https://algovault-custom.onrender.com');
    expect(getApiBaseUrl()).toBe('https://algovault-custom.onrender.com/api');
  });

  it('strips trailing slashes and /api path from environment variables safely', () => {
    delete (import.meta.env as any).VITE_BACKEND_URL;
    delete (import.meta.env as any).VITE_SYNC_SERVER_URL;
    (import.meta.env as any).VITE_API_URL = 'https://algovault-custom.onrender.com/api/';

    expect(getBackendBaseUrl()).toBe('https://algovault-custom.onrender.com');
    expect(getApiBaseUrl()).toBe('https://algovault-custom.onrender.com/api');
  });

  it('falls back to http://localhost:5000 when no environment variables are set', () => {
    delete (import.meta.env as any).VITE_BACKEND_URL;
    delete (import.meta.env as any).VITE_API_URL;
    delete (import.meta.env as any).VITE_SYNC_SERVER_URL;

    expect(getBackendBaseUrl()).toBe('http://localhost:5000');
    expect(getApiBaseUrl()).toBe('http://localhost:5000/api');
  });

  it('ensures authService routes to the same resolved backend URL as api.ts when only VITE_BACKEND_URL is set', async () => {
    delete (import.meta.env as any).VITE_API_URL;
    delete (import.meta.env as any).VITE_SYNC_SERVER_URL;
    (import.meta.env as any).VITE_BACKEND_URL = 'https://production-cluster.algovault.app';

    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, token: 'fake_jwt' })
    } as any);

    await loginUser('test@example.com', 'password123');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://production-cluster.algovault.app/api/auth/login',
      expect.anything()
    );
  });

  it('ensures mongoSync routes to the same resolved backend URL as api.ts when only VITE_BACKEND_URL is set', async () => {
    delete (import.meta.env as any).VITE_API_URL;
    delete (import.meta.env as any).VITE_SYNC_SERVER_URL;
    (import.meta.env as any).VITE_BACKEND_URL = 'https://production-cluster.algovault.app';

    localStorage.setItem('techswitch_token', 'valid-token');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, userId: 'u1' })
    } as any);

    await fetchFromMongo('u1');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://production-cluster.algovault.app/api/sync',
      expect.anything()
    );
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMongoSync } from '../hooks/useMongoSync';

let mockUser: { email?: string; id?: string } | null = null;

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

vi.mock('../context/ProgressContext', () => ({
  useProgress: () => ({
    progress: {},
    restoreProgressState: vi.fn(),
  }),
}));

vi.mock('../services/mongoSync', () => ({
  fetchFromMongo: vi.fn().mockResolvedValue(null),
  pushToMongo: vi.fn().mockResolvedValue(true),
}));

describe('useMongoSync Default Fallback User Key Tests (Bug 8)', () => {
  beforeEach(() => {
    localStorage.clear();
    mockUser = null;
    vi.clearAllMocks();
  });

  it('defaults mongoUserKey to "guest-session" for unauthenticated users without localStorage', () => {
    const { result } = renderHook(() => useMongoSync());

    expect(result.current.mongoUserKey).toBe('guest-session');
    expect(result.current.mongoUserKey).not.toBe('ankush-user-1');
  });

  it('sanitizes legacy "ankush-user-1" from localStorage and falls back to "guest-session"', () => {
    localStorage.setItem('mongo_sync_user_key', 'ankush-user-1');

    const { result } = renderHook(() => useMongoSync());

    expect(result.current.mongoUserKey).toBe('guest-session');
    expect(result.current.mongoUserKey).not.toBe('ankush-user-1');
  });

  it('preserves valid custom non-legacy keys stored in localStorage for unauthenticated sessions', () => {
    localStorage.setItem('mongo_sync_user_key', 'custom-workspace-session');

    const { result } = renderHook(() => useMongoSync());

    expect(result.current.mongoUserKey).toBe('custom-workspace-session');
  });

  it('prioritizes user.email when user is authenticated', () => {
    mockUser = { email: 'developer@example.com', id: 'usr-42' };

    const { result } = renderHook(() => useMongoSync());

    expect(result.current.mongoUserKey).toBe('developer@example.com');
  });
});

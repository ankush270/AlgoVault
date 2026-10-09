import { describe, it, expect, vi, beforeEach } from 'vitest';
import { vaultService } from '../services/vaultService';

describe('vaultService API Client Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('fetches topics with proper query parameters', async () => {
    const mockTopics = [
      {
        _id: 'top-1',
        domain: 'dsa',
        category: 'Graphs',
        title: 'Graph: Basics & Representations',
        difficulty: 'Medium',
        importanceRating: 5,
        tags: ['Google'],
        subtopics: [
          {
            _id: 'sub-1',
            title: '1. Intuition & Terms',
            revisionStatus: 'mastered',
            problemsCount: 1,
            hasMedia: true
          }
        ]
      }
    ];

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, topics: mockTopics })
    } as any);

    const result = await vaultService.getTopics({ domain: 'dsa', search: 'graph' });

    expect(fetchSpy).toHaveBeenCalled();
    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/vault/topics');
    expect(calledUrl).toContain('domain=dsa');
    expect(calledUrl).toContain('search=graph');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Graph: Basics & Representations');
  });

  it('sends Authorization header when token exists on mutations', async () => {
    localStorage.setItem('techswitch_token', 'mock_jwt_token_123');

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, topic: { _id: 'new-1', title: 'New Graph Topic' } })
    } as any);

    await vaultService.createTopic({
      domain: 'dsa',
      category: 'Graphs',
      title: 'New Graph Topic'
    });

    expect(fetchSpy).toHaveBeenCalled();
    const options = fetchSpy.mock.calls[0][1] as RequestInit;
    expect((options.headers as any)['Authorization']).toBe('Bearer mock_jwt_token_123');
    expect(options.method).toBe('POST');
  });

  it('updates revision status via PATCH request', async () => {
    localStorage.setItem('techswitch_token', 'mock_jwt_token_123');

    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, subtopic: { _id: 'sub-1', revisionStatus: 'weak' } })
    } as any);

    const result = await vaultService.updateRevisionStatus('sub-1', 'weak');

    expect(fetchSpy).toHaveBeenCalled();
    const options = fetchSpy.mock.calls[0][1] as RequestInit;
    expect(options.method).toBe('PATCH');
    expect(JSON.parse(options.body as string)).toEqual({ revisionStatus: 'weak' });
    expect(result.revisionStatus).toBe('weak');
  });
});

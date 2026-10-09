import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProgressProvider, useProgress } from '../context/ProgressContext';
import { allTopics } from '../data/allData';

// Mock confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('ProgressContext Domain Metrics & Readiness Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <ProgressProvider>{children}</ProgressProvider>
  );

  it('getTotalCount() returns all topics count, not hardcoded 18', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    expect(result.current.getTotalCount()).toBe(allTopics.length);
    expect(result.current.getTotalCount()).toBeGreaterThan(50);
  });

  it('getTotalCount(domain) returns domain-specific topic count', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    const osTopics = allTopics.filter((t) => t.domain === 'os');
    const dsaTopics = allTopics.filter((t) => t.domain === 'dsa');
    const sysDesignTopics = allTopics.filter((t) => t.domain === 'system-design');

    expect(result.current.getTotalCount('os')).toBe(osTopics.length);
    expect(result.current.getTotalCount('dsa')).toBe(dsaTopics.length);
    expect(result.current.getTotalCount('system-design')).toBe(sysDesignTopics.length);
  });

  it('getMasteredCount(domain) only counts mastered topics in that domain', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    const osTopic = allTopics.find((t) => t.domain === 'os');
    const dsaTopic = allTopics.find((t) => t.domain === 'dsa');

    expect(osTopic).toBeDefined();
    expect(dsaTopic).toBeDefined();

    if (osTopic && dsaTopic) {
      act(() => {
        result.current.updateStatus(osTopic.id, 'mastered');
      });

      // Total mastered should be 1
      expect(result.current.getMasteredCount()).toBe(1);

      // OS mastered should be 1
      expect(result.current.getMasteredCount('os')).toBe(1);

      // DSA mastered should be 0
      expect(result.current.getMasteredCount('dsa')).toBe(0);

      // Master DSA topic
      act(() => {
        result.current.updateStatus(dsaTopic.id, 'mastered');
      });

      // Total mastered should be 2
      expect(result.current.getMasteredCount()).toBe(2);

      // OS mastered still 1
      expect(result.current.getMasteredCount('os')).toBe(1);

      // DSA mastered now 1
      expect(result.current.getMasteredCount('dsa')).toBe(1);
    }
  });

  it('getReadinessPercentage(domain) calculates correct percentage based on actual counts', () => {
    const { result } = renderHook(() => useProgress(), { wrapper });

    const osTopics = allTopics.filter((t) => t.domain === 'os');
    expect(osTopics.length).toBeGreaterThan(0);

    // Initial readiness should be 0%
    expect(result.current.getReadinessPercentage('os')).toBe(0);

    // Master first OS topic
    act(() => {
      result.current.updateStatus(osTopics[0].id, 'mastered');
    });

    const expectedPct = Math.min(100, Math.round((1 / osTopics.length) * 100));
    expect(result.current.getReadinessPercentage('os')).toBe(expectedPct);
  });
});

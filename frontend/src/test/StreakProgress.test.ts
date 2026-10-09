import { describe, it, expect, vi } from 'vitest';
import { calculateStreakProgress } from '../context/ProgressContext';
import { UserProgressState } from '../types';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('Streak and Daily Goal Progress Unit Tests', () => {
  const baseState: UserProgressState = {
    statuses: {},
    starred: {},
    notes: {},
    revisions: {},
    activeAlgorithm: 'smart-adaptive',
    streak: 0,
    lastActiveDate: '',
    dailyGoal: 3,
    todayCompletedCount: 0,
    completedDates: [],
  };

  it('increments todayCompletedCount on first topic but does not add to completedDates or increment streak before goal', () => {
    const today = '2026-10-04';
    const result = calculateStreakProgress(baseState, today);

    expect(result.todayCompletedCount).toBe(1);
    expect(result.streak).toBe(0);
    expect(result.completedDates).toEqual([]);
    expect(result.lastActiveDate).toBe(today);
  });

  it('increments streak to 1 and records date in completedDates when daily goal (3) is met for the first time', () => {
    const today = '2026-10-04';
    const stateAtTwoCompleted: UserProgressState = {
      ...baseState,
      streak: 0,
      lastActiveDate: today,
      todayCompletedCount: 2,
      completedDates: [],
    };

    const result = calculateStreakProgress(stateAtTwoCompleted, today);

    expect(result.todayCompletedCount).toBe(3);
    expect(result.streak).toBe(1);
    expect(result.completedDates).toEqual([today]);
  });

  it('does not increment streak again if solving a 4th problem on the same day after goal is already met', () => {
    const today = '2026-10-04';
    const stateAtGoalMet: UserProgressState = {
      ...baseState,
      streak: 1,
      lastActiveDate: today,
      todayCompletedCount: 3,
      completedDates: [today],
    };

    const result = calculateStreakProgress(stateAtGoalMet, today);

    expect(result.todayCompletedCount).toBe(4);
    expect(result.streak).toBe(1);
    expect(result.completedDates).toEqual([today]);
  });

  it('increments streak from 1 to 2 when consecutive day daily goal is met', () => {
    const yesterday = '2026-10-03';
    const today = '2026-10-04';

    const day2State: UserProgressState = {
      ...baseState,
      streak: 1,
      lastActiveDate: today,
      todayCompletedCount: 2, // 2 completed today, 3rd will hit goal
      completedDates: [yesterday],
    };

    const result = calculateStreakProgress(day2State, today);

    expect(result.todayCompletedCount).toBe(3);
    expect(result.streak).toBe(2);
    expect(result.completedDates).toEqual([yesterday, today]);
  });

  it('resets streak to 1 if yesterday was skipped (broken streak)', () => {
    const twoDaysAgo = '2026-10-02';
    const today = '2026-10-04'; // 2026-10-03 was skipped

    const brokenStreakState: UserProgressState = {
      ...baseState,
      streak: 0, // decayed or reset
      lastActiveDate: today,
      todayCompletedCount: 2,
      completedDates: [twoDaysAgo],
    };

    const result = calculateStreakProgress(brokenStreakState, today);

    expect(result.todayCompletedCount).toBe(3);
    expect(result.streak).toBe(1);
    expect(result.completedDates).toEqual([twoDaysAgo, today]);
  });

  it('correctly tracks streak across month boundary (e.g. Oct 31 to Nov 01)', () => {
    const endOfMonth = '2026-10-31';
    const startOfNextMonth = '2026-11-01';

    const monthBoundaryState: UserProgressState = {
      ...baseState,
      streak: 5,
      lastActiveDate: startOfNextMonth,
      todayCompletedCount: 2,
      completedDates: ['2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', endOfMonth],
    };

    const result = calculateStreakProgress(monthBoundaryState, startOfNextMonth);

    expect(result.todayCompletedCount).toBe(3);
    expect(result.streak).toBe(6);
    expect(result.completedDates).toContain(startOfNextMonth);
  });

  it('recovers and increments streak when completedDates contains today prematurely before goal is met', () => {
    const yesterday = '2026-10-03';
    const today = '2026-10-04';

    // State where completedDates erroneously contains today prematurely (old bug)
    const buggyPrevState: UserProgressState = {
      ...baseState,
      streak: 1,
      lastActiveDate: today,
      todayCompletedCount: 2, // 2 completed, next hits daily goal (3)
      completedDates: [yesterday, today], // today is prematurely in completedDates
    };

    const result = calculateStreakProgress(buggyPrevState, today);

    // Should successfully detect that daily goal was just satisfied and increment streak
    expect(result.todayCompletedCount).toBe(3);
    expect(result.streak).toBe(2);
    expect(result.completedDates).toEqual([yesterday, today]);
  });

  it('purges premature today from completedDates when todayCompletedCount is below dailyGoal', () => {
    const today = '2026-10-04';

    const buggyInitialState: UserProgressState = {
      ...baseState,
      streak: 0,
      lastActiveDate: today,
      todayCompletedCount: 0,
      completedDates: [today], // buggy initial state
    };

    const result = calculateStreakProgress(buggyInitialState, today);

    expect(result.todayCompletedCount).toBe(1);
    expect(result.streak).toBe(0);
    // Premature today must be cleaned out until goal is reached
    expect(result.completedDates).toEqual([]);
  });
});

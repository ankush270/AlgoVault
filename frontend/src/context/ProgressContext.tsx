import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProgressState, ItemStatus, RatingDifficulty, AlgorithmType, RevisionRecord, TopicItem } from '../types';
import { calculateNextRevision, getTodayISO, addDaysISO } from '../utils/spacedRepetition';
import { allTopics } from '../data/allData';

interface ProgressContextType {
  progress: UserProgressState;
  updateStatus: (topicId: string, status: ItemStatus) => void;
  recordRevision: (topicId: string, rating: RatingDifficulty, topicMeta?: Partial<TopicItem>) => RevisionRecord;
  setAlgorithm: (algorithm: AlgorithmType) => void;
  toggleStar: (topicId: string) => void;
  saveNote: (topicId: string, noteText: string) => void;
  updateDailyGoal: (goal: number) => void;
  exportProgressJSON: () => void;
  importProgressJSON: (jsonString: string) => boolean;
  restoreProgressState: (incomingState: Partial<UserProgressState>) => void;
  resetProgress: () => void;
  getMasteredCount: (domain?: string) => number;
  getTotalCount: (domain?: string) => number;
  getReadinessPercentage: (domain?: string) => number;
  getDueRevisionsCount: () => number;
  getRevisionRecord: (topicId: string) => RevisionRecord | undefined;
}

const STORAGE_KEY = 'techswitch_pro_progress_v1';

/**
 * Calculates updated todayCompletedCount, streak, and completedDates.
 * Note: A date is ONLY added to completedDates when dailyGoal is actually achieved.
 */
export const calculateStreakProgress = (
  prev: UserProgressState,
  todayStr: string = getTodayISO()
): {
  todayCompletedCount: number;
  streak: number;
  completedDates: string[];
  lastActiveDate: string;
} => {
  const isSameDay = prev.lastActiveDate === todayStr;
  const currentTodayCount = isSameDay ? prev.todayCompletedCount : 0;
  const newTodayCount = currentTodayCount + 1;

  let newStreak = prev.streak;
  const updatedDates = new Set(prev.completedDates);

  // A day's goal is genuinely completed only if current count ALREADY reached daily goal AND today was in completedDates
  const alreadyCompletedToday = isSameDay && currentTodayCount >= prev.dailyGoal && prev.completedDates.includes(todayStr);

  // Check if daily goal is satisfied for the first time today
  if (newTodayCount >= prev.dailyGoal && !alreadyCompletedToday) {
    updatedDates.add(todayStr);

    const yesterdayStr = addDaysISO(todayStr, -1);
    const yesterdayCompleted = prev.completedDates.includes(yesterdayStr);

    if (yesterdayCompleted && prev.streak > 0) {
      newStreak = prev.streak + 1;
    } else {
      // First day meeting daily goal, or fresh streak after break
      newStreak = 1;
    }

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Fallback if confetti fails
    }
  } else if (!alreadyCompletedToday && newTodayCount < prev.dailyGoal) {
    // Crucial safeguard: Ensure today is NOT in completedDates until daily goal is reached
    updatedDates.delete(todayStr);
  }

  return {
    todayCompletedCount: newTodayCount,
    streak: newStreak,
    completedDates: Array.from(updatedDates),
    lastActiveDate: todayStr
  };
};

const getInitialState = (): UserProgressState => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const today = getTodayISO();
      let completedDates = Array.isArray(parsed.completedDates) ? parsed.completedDates : [];
      const todayCount = typeof parsed.todayCompletedCount === 'number' ? parsed.todayCompletedCount : 0;
      const dailyGoal = typeof parsed.dailyGoal === 'number' ? parsed.dailyGoal : 3;

      // Clean up corrupt completedDates from previous versions where today was added prematurely before goal was met
      if (completedDates.includes(today) && (parsed.lastActiveDate !== today || todayCount < dailyGoal)) {
        completedDates = completedDates.filter((d: string) => d !== today);
      }

      return {
        statuses: parsed.statuses || {},
        starred: parsed.starred || {},
        notes: parsed.notes || {},
        revisions: parsed.revisions || {},
        activeAlgorithm: parsed.activeAlgorithm || 'smart-adaptive',
        streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
        lastActiveDate: parsed.lastActiveDate || '',
        dailyGoal: dailyGoal,
        todayCompletedCount: todayCount,
        completedDates
      };
    } catch (e) {
      console.error('Failed to parse saved progress', e);
    }
  }

  return {
    statuses: {},
    starred: {},
    notes: {},
    revisions: {},
    activeAlgorithm: 'smart-adaptive',
    streak: 0,
    lastActiveDate: '',
    dailyGoal: 3,
    todayCompletedCount: 0,
    completedDates: []
  };
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgressState>(getInitialState);

  // Auto save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Streak check on initial mount
  useEffect(() => {
    const today = getTodayISO();
    if (!progress.lastActiveDate) {
      setProgress(prev => ({
        ...prev,
        lastActiveDate: today,
        todayCompletedCount: 0,
        completedDates: prev.completedDates.filter(d => d !== today)
      }));
      return;
    }

    if (progress.lastActiveDate !== today) {
      const lastDate = new Date(progress.lastActiveDate + 'T00:00:00');
      const currentDate = new Date(today + 'T00:00:00');
      const diffTime = currentDate.getTime() - lastDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      const yesterdayStr = addDaysISO(today, -1);
      const yesterdayGoalMet = progress.completedDates.includes(yesterdayStr);

      if (diffDays === 1 && yesterdayGoalMet) {
        // Preserved streak from yesterday, reset today's completed counter
        setProgress(prev => ({
          ...prev,
          lastActiveDate: today,
          todayCompletedCount: 0,
          completedDates: prev.completedDates.filter(d => d !== today)
        }));
      } else {
        // Missed yesterday's goal or missed more than 1 day
        setProgress(prev => ({
          ...prev,
          streak: 0,
          lastActiveDate: today,
          todayCompletedCount: 0,
          completedDates: prev.completedDates.filter(d => d !== today)
        }));
      }
    } else {
      // Same day check: if today's goal was not met yet, ensure today is not in completedDates
      if (progress.todayCompletedCount < progress.dailyGoal && progress.completedDates.includes(today)) {
        setProgress(prev => ({
          ...prev,
          completedDates: prev.completedDates.filter(d => d !== today)
        }));
      }
    }
  }, []);

  const updateStatus = (topicId: string, status: ItemStatus) => {
    setProgress(prev => {
      const prevStatus = prev.statuses[topicId];
      const newStatuses = { ...prev.statuses, [topicId]: status };

      if (status === 'mastered' && prevStatus !== 'mastered') {
        const streakData = calculateStreakProgress(prev);
        return {
          ...prev,
          statuses: newStatuses,
          ...streakData
        };
      }

      return {
        ...prev,
        statuses: newStatuses
      };
    });
  };

  /**
   * Evaluates and records a revision based on user comprehension input
   */
  const recordRevision = (
    topicId: string,
    rating: RatingDifficulty,
    topicMeta?: Partial<TopicItem>
  ): RevisionRecord => {
    const existingRec = progress.revisions[topicId];
    const newRecord = calculateNextRevision({
      topicId,
      rating,
      intrinsicDifficulty: topicMeta?.difficulty,
      importanceRating: topicMeta?.importanceRating,
      companyTagsCount: topicMeta?.companyTags?.length || 0,
      existingRecord: existingRec,
      algorithm: progress.activeAlgorithm
    });

    const newStatus: ItemStatus =
      rating === 'easy' || rating === 'medium' ? 'mastered' : 'needs-revision';

    setProgress(prev => {
      const newStatuses = { ...prev.statuses, [topicId]: newStatus };
      const newRevisions = { ...prev.revisions, [topicId]: newRecord };

      if ((rating === 'easy' || rating === 'medium') && prev.statuses[topicId] !== 'mastered') {
        const streakData = calculateStreakProgress(prev);
        return {
          ...prev,
          statuses: newStatuses,
          revisions: newRevisions,
          ...streakData
        };
      }

      return {
        ...prev,
        statuses: newStatuses,
        revisions: newRevisions
      };
    });

    return newRecord;
  };

  const setAlgorithm = (algorithm: AlgorithmType) => {
    setProgress(prev => ({
      ...prev,
      activeAlgorithm: algorithm
    }));
  };

  const getDueRevisionsCount = (): number => {
    const todayStr = getTodayISO();
    let dueCount = 0;

    // Count topics with nextRevisionDate <= today
    Object.values(progress.revisions).forEach(rec => {
      if (rec.nextRevisionDate <= todayStr) {
        dueCount++;
      }
    });

    // Also count topics explicitly marked as 'needs-revision' if not already in revisions
    Object.entries(progress.statuses).forEach(([id, status]) => {
      if (status === 'needs-revision' && !progress.revisions[id]) {
        dueCount++;
      }
    });

    return dueCount;
  };

  const getRevisionRecord = (topicId: string): RevisionRecord | undefined => {
    return progress.revisions[topicId];
  };

  const toggleStar = (topicId: string) => {
    setProgress(prev => ({
      ...prev,
      starred: {
        ...prev.starred,
        [topicId]: !prev.starred[topicId]
      }
    }));
  };

  const saveNote = (topicId: string, noteText: string) => {
    setProgress(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [topicId]: noteText
      }
    }));
  };

  const updateDailyGoal = (goal: number) => {
    const validGoal = Math.max(1, goal);
    setProgress(prev => {
      const todayStr = getTodayISO();
      const alreadyCompleted = prev.completedDates.includes(todayStr);
      let newStreak = prev.streak;
      let newCompletedDates = prev.completedDates;

      if (prev.todayCompletedCount >= validGoal && !alreadyCompleted) {
        newCompletedDates = [...prev.completedDates, todayStr];
        const yesterdayStr = addDaysISO(todayStr, -1);
        const yesterdayCompleted = prev.completedDates.includes(yesterdayStr);
        newStreak = yesterdayCompleted && prev.streak > 0 ? prev.streak + 1 : 1;
      }

      return {
        ...prev,
        dailyGoal: validGoal,
        streak: newStreak,
        completedDates: newCompletedDates
      };
    });
  };

  const exportProgressJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `techswitch_progress_backup_${getTodayISO()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importProgressJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object' && parsed.statuses) {
        setProgress(parsed);
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON file', e);
    }
    return false;
  };

  const restoreProgressState = (incomingState: Partial<UserProgressState>) => {
    if (!incomingState || typeof incomingState !== 'object') return;
    setProgress(prev => {
      const merged: UserProgressState = {
        statuses: { ...prev.statuses, ...(incomingState.statuses || {}) },
        starred: { ...prev.starred, ...(incomingState.starred || {}) },
        notes: { ...prev.notes, ...(incomingState.notes || {}) },
        revisions: { ...prev.revisions, ...(incomingState.revisions || {}) },
        activeAlgorithm: incomingState.activeAlgorithm || prev.activeAlgorithm || 'smart-adaptive',
        streak: typeof incomingState.streak === 'number' ? incomingState.streak : prev.streak,
        lastActiveDate: incomingState.lastActiveDate || prev.lastActiveDate,
        dailyGoal: incomingState.dailyGoal || prev.dailyGoal || 3,
        todayCompletedCount: typeof incomingState.todayCompletedCount === 'number' ? incomingState.todayCompletedCount : prev.todayCompletedCount,
        completedDates: Array.isArray(incomingState.completedDates)
          ? Array.from(new Set([...prev.completedDates, ...incomingState.completedDates]))
          : prev.completedDates
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
  };

  const resetProgress = () => {
    const initial: UserProgressState = {
      statuses: {},
      starred: {},
      notes: {},
      revisions: {},
      activeAlgorithm: 'smart-adaptive',
      streak: 0,
      lastActiveDate: '',
      dailyGoal: 3,
      todayCompletedCount: 0,
      completedDates: []
    };
    setProgress(initial);
  };

  const normalizeDomain = (domain: string): string => {
    const d = domain.trim().toLowerCase();
    if (d === 'object-oriented-programming') return 'oops';
    if (d === 'dbms' || d === 'sql') return 'dbms-sql';
    if (d === 'networks') return 'computer-networks';
    if (d === 'genai' || d === 'ai' || d === 'ml') return 'genai-ml';
    return d;
  };

  const getMasteredCount = (domain?: string): number => {
    if (!domain || domain === 'all') {
      return Object.values(progress.statuses).filter((status) => status === 'mastered').length;
    }
    const normDomain = normalizeDomain(domain);
    const domainTopicIds = new Set(
      allTopics
        .filter((t) => normalizeDomain(t.domain) === normDomain)
        .map((t) => t.id)
    );
    return Object.entries(progress.statuses).filter(
      ([id, status]) => status === 'mastered' && domainTopicIds.has(id)
    ).length;
  };

  const getTotalCount = (domain?: string): number => {
    if (!domain || domain === 'all') {
      return allTopics.length;
    }
    const normDomain = normalizeDomain(domain);
    return allTopics.filter((t) => normalizeDomain(t.domain) === normDomain).length;
  };

  const getReadinessPercentage = (domain?: string): number => {
    const total = getTotalCount(domain);
    if (total === 0) return 0;
    const mastered = getMasteredCount(domain);
    return Math.min(100, Math.round((mastered / total) * 100));
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateStatus,
        recordRevision,
        setAlgorithm,
        toggleStar,
        saveNote,
        updateDailyGoal,
        exportProgressJSON,
        importProgressJSON,
        restoreProgressState,
        resetProgress,
        getMasteredCount,
        getTotalCount,
        getReadinessPercentage,
        getDueRevisionsCount,
        getRevisionRecord
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProgressState, ItemStatus, RatingDifficulty, AlgorithmType, RevisionRecord, TopicItem } from '../types';
import { calculateNextRevision, getTodayISO, calculateRetentionScore } from '../utils/spacedRepetition';

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
  resetProgress: () => void;
  getMasteredCount: (domain?: string) => number;
  getTotalCount: (domain?: string) => number;
  getDueRevisionsCount: () => number;
  getRevisionRecord: (topicId: string) => RevisionRecord | undefined;
}

const STORAGE_KEY = 'techswitch_pro_progress_v1';

const getInitialState = (): UserProgressState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const todayStr = getTodayISO();

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        statuses: parsed.statuses || {},
        starred: parsed.starred || {},
        notes: parsed.notes || {},
        revisions: parsed.revisions || {},
        activeAlgorithm: parsed.activeAlgorithm || 'smart-adaptive',
        streak: parsed.streak || 1,
        lastActiveDate: parsed.lastActiveDate || todayStr,
        dailyGoal: parsed.dailyGoal || 3,
        todayCompletedCount: parsed.todayCompletedCount || 0,
        completedDates: parsed.completedDates || [todayStr]
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
    streak: 1,
    lastActiveDate: todayStr,
    dailyGoal: 3,
    todayCompletedCount: 0,
    completedDates: [todayStr]
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
    if (progress.lastActiveDate !== today) {
      const lastDate = new Date(progress.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        setProgress(prev => ({
          ...prev,
          lastActiveDate: today,
          todayCompletedCount: 0
        }));
      } else if (diffDays > 1) {
        setProgress(prev => ({
          ...prev,
          streak: 1,
          lastActiveDate: today,
          todayCompletedCount: 0
        }));
      }
    }
  }, []);

  const updateStatus = (topicId: string, status: ItemStatus) => {
    setProgress(prev => {
      const prevStatus = prev.statuses[topicId];
      const newStatuses = { ...prev.statuses, [topicId]: status };

      let todayCount = prev.todayCompletedCount;
      let newStreak = prev.streak;
      const todayStr = getTodayISO();
      const updatedDates = new Set(prev.completedDates);

      if (status === 'mastered' && prevStatus !== 'mastered') {
        todayCount += 1;
        updatedDates.add(todayStr);

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // Fallback if confetti fails
        }

        if (todayCount >= prev.dailyGoal && !prev.completedDates.includes(todayStr)) {
          newStreak += 1;
        }
      }

      return {
        ...prev,
        statuses: newStatuses,
        todayCompletedCount: todayCount,
        streak: newStreak,
        lastActiveDate: todayStr,
        completedDates: Array.from(updatedDates)
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

      let todayCount = prev.todayCompletedCount;
      let newStreak = prev.streak;
      const todayStr = getTodayISO();
      const updatedDates = new Set(prev.completedDates);

      if ((rating === 'easy' || rating === 'medium') && prev.statuses[topicId] !== 'mastered') {
        todayCount += 1;
        updatedDates.add(todayStr);

        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {}

        if (todayCount >= prev.dailyGoal && !prev.completedDates.includes(todayStr)) {
          newStreak += 1;
        }
      }

      return {
        ...prev,
        statuses: newStatuses,
        revisions: newRevisions,
        todayCompletedCount: todayCount,
        streak: newStreak,
        lastActiveDate: todayStr,
        completedDates: Array.from(updatedDates)
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
    setProgress(prev => ({
      ...prev,
      dailyGoal: Math.max(1, goal)
    }));
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

  const resetProgress = () => {
    const todayStr = getTodayISO();
    const initial: UserProgressState = {
      statuses: {},
      starred: {},
      notes: {},
      revisions: {},
      activeAlgorithm: 'smart-adaptive',
      streak: 1,
      lastActiveDate: todayStr,
      dailyGoal: 3,
      todayCompletedCount: 0,
      completedDates: [todayStr]
    };
    setProgress(initial);
  };

  const getMasteredCount = (domain?: string): number => {
    return Object.entries(progress.statuses).filter(([_, status]) => status === 'mastered').length;
  };

  const getTotalCount = (domain?: string): number => {
    return 18;
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
        resetProgress,
        getMasteredCount,
        getTotalCount,
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

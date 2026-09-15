import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserProgressState, ItemStatus } from '../types';

interface ProgressContextType {
  progress: UserProgressState;
  updateStatus: (topicId: string, status: ItemStatus) => void;
  toggleStar: (topicId: string) => void;
  saveNote: (topicId: string, noteText: string) => void;
  updateDailyGoal: (goal: number) => void;
  exportProgressJSON: () => void;
  importProgressJSON: (jsonString: string) => boolean;
  resetProgress: () => void;
  getMasteredCount: (domain?: string) => number;
  getTotalCount: (domain?: string) => number;
}

const STORAGE_KEY = 'techswitch_pro_progress_v1';

const getInitialState = (): UserProgressState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved progress', e);
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return {
    statuses: {},
    starred: {},
    notes: {},
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
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastActiveDate !== today) {
      const lastDate = new Date(progress.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Continuous streak
        setProgress(prev => ({
          ...prev,
          lastActiveDate: today,
          todayCompletedCount: 0
        }));
      } else if (diffDays > 1) {
        // Streak broken
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
      const todayStr = new Date().toISOString().split('T')[0];
      const updatedDates = new Set(prev.completedDates);

      // Trigger celebratory confetti if topic marked as mastered
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
    downloadAnchor.setAttribute("download", `techswitch_progress_backup_${new Date().toISOString().split('T')[0]}.json`);
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
    const todayStr = new Date().toISOString().split('T')[0];
    const initial: UserProgressState = {
      statuses: {},
      starred: {},
      notes: {},
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
    return 18; // total sample topics
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateStatus,
        toggleStar,
        saveNote,
        updateDailyGoal,
        exportProgressJSON,
        importProgressJSON,
        resetProgress,
        getMasteredCount,
        getTotalCount
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

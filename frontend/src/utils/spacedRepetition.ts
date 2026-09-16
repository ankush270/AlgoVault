import { RatingDifficulty, AlgorithmType, RevisionRecord, Difficulty } from '../types';

/**
 * Formats ISO date (YYYY-MM-DD) or Date object into human readable format like "12 Sep", "07 Oct", "07 Nov"
 */
export const formatDisplayDate = (dateInput: Date | string): string => {
  const dateObj = typeof dateInput === 'string' ? new Date(dateInput + 'T00:00:00') : dateInput;
  if (isNaN(dateObj.getTime())) {
    return 'Today';
  }
  const day = String(dateObj.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[dateObj.getMonth()];
  return `${day} ${month}`;
};

/**
 * Returns today's ISO date string (YYYY-MM-DD)
 */
export const getTodayISO = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Helper to add N days to ISO date string
 */
export const addDaysISO = (startDateStr: string, days: number): string => {
  const dt = new Date(startDateStr + 'T00:00:00');
  dt.setDate(dt.getDate() + days);
  return dt.toISOString().split('T')[0];
};

/**
 * Calculates current memory retention score (%) based on time elapsed since last attempt vs interval
 */
export const calculateRetentionScore = (lastAttemptedIso: string, nextRevisionIso: string): number => {
  const today = new Date();
  const last = new Date(lastAttemptedIso + 'T00:00:00');
  const next = new Date(nextRevisionIso + 'T00:00:00');

  const totalTime = Math.max(1, (next.getTime() - last.getTime()) / (1000 * 3600 * 24));
  const elapsed = Math.max(0, (today.getTime() - last.getTime()) / (1000 * 3600 * 24));

  if (elapsed >= totalTime) {
    const overdueDays = elapsed - totalTime;
    const score = Math.max(10, 60 - overdueDays * 10);
    return Math.round(score);
  }

  // Ebbinghaus decay curve retention formula
  const retention = 100 * Math.exp(-0.5 * (elapsed / totalTime));
  return Math.min(100, Math.max(20, Math.round(retention)));
};

/**
 * Generates a 5-step milestone date array (e.g. ["13 Sep", "16 Sep", "23 Sep", "07 Oct", "07 Nov"])
 */
export const generateScheduledDatesSequence = (
  baseDateIso: string,
  initialInterval: number,
  rating: RatingDifficulty
): string[] => {
  const intervals: string[] = [];
  let currentInt = Math.max(1, initialInterval);

  // Growth multipliers based on user comprehension feedback
  const multiplier = rating === 'easy' ? 2.2 : rating === 'medium' ? 1.7 : rating === 'hard' ? 1.3 : 1.0;

  let accumDays = 0;
  for (let i = 0; i < 5; i++) {
    if (i === 0) {
      accumDays += currentInt;
    } else {
      currentInt = Math.max(currentInt + 1, Math.round(currentInt * multiplier));
      accumDays += currentInt;
    }
    const milestoneIso = addDaysISO(baseDateIso, accumDays);
    intervals.push(milestoneIso);
  }

  return intervals.map(iso => formatDisplayDate(iso));
};

export interface CalculateRevisionParams {
  topicId: string;
  rating: RatingDifficulty; // 'easy' (Pura), 'medium' (Aadha), 'hard' (Kam), 'failed' (Nahi)
  intrinsicDifficulty?: Difficulty;
  importanceRating?: number; // 1 to 5 stars
  companyTagsCount?: number;
  existingRecord?: RevisionRecord;
  algorithm?: AlgorithmType;
}

/**
 * Multi-Algorithm Spaced Repetition Engine
 */
export const calculateNextRevision = (params: CalculateRevisionParams): RevisionRecord => {
  const {
    topicId,
    rating,
    intrinsicDifficulty = 'Medium',
    importanceRating = 3,
    companyTagsCount = 0,
    existingRecord,
    algorithm = 'smart-adaptive',
  } = params;

  const todayIso = getTodayISO();
  const prevRepetitions = existingRecord?.repetitions || 0;
  const prevEaseFactor = existingRecord?.easeFactor || 2.5;
  const prevLeitnerBox = existingRecord?.leitnerBox || 1;
  const prevInterval = existingRecord?.interval || 1;

  let newInterval = 1;
  let newEaseFactor = prevEaseFactor;
  let newLeitnerBox = prevLeitnerBox;
  let newRepetitions = prevRepetitions;

  if (algorithm === 'leitner') {
    // Leitner 5-Box Algorithm
    if (rating === 'easy' || rating === 'medium') {
      newLeitnerBox = Math.min(5, prevLeitnerBox + 1);
      newRepetitions += 1;
    } else {
      newLeitnerBox = 1; // Drop back to Box 1 on failure/struggle
      newRepetitions = 0;
    }

    const leitnerIntervals = [1, 3, 7, 14, 30];
    newInterval = leitnerIntervals[newLeitnerBox - 1];

  } else if (algorithm === 'sm2') {
    // SuperMemo SM-2 Algorithm
    if (rating === 'failed') {
      newRepetitions = 0;
      newInterval = 1;
    } else {
      if (newRepetitions === 0) {
        newInterval = 1;
      } else if (newRepetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(prevInterval * prevEaseFactor);
      }
      newRepetitions += 1;
    }

    // Quality mapping for SM-2 (0-5 scale): Easy=5, Medium=4, Hard=3, Failed=1
    const q = rating === 'easy' ? 5 : rating === 'medium' ? 4 : rating === 'hard' ? 3 : 1;
    newEaseFactor = Math.max(1.3, prevEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  } else {
    // Smart Adaptive Engine (Hybrid Ebbinghaus + Intrinsic Difficulty + Importance + Rating)
    let baseMultiplier = 1.0;

    // 1. User Comprehension Rating Vector
    if (rating === 'easy') {
      baseMultiplier = 2.4; // Pura Samajh Aaya
      newRepetitions += 1;
    } else if (rating === 'medium') {
      baseMultiplier = 1.6; // Aadha Samajh Aaya
      newRepetitions += 1;
    } else if (rating === 'hard') {
      baseMultiplier = 1.2; // Kam Samajh Aaya
      newRepetitions += 1;
    } else {
      baseMultiplier = 0.5; // Nahi Samajh Aaya
      newRepetitions = 0;
    }

    // 2. Intrinsic Difficulty Weight
    const diffWeight = intrinsicDifficulty === 'Hard' ? 0.85 : intrinsicDifficulty === 'Easy' ? 1.2 : 1.0;

    // 3. Importance & High-Frequency Company Tags Weight
    const importanceWeight = importanceRating >= 4 ? 0.9 : 1.0; // High priority questions revised slightly earlier
    const companyWeight = companyTagsCount > 3 ? 0.9 : 1.0;

    // Combine factors
    const combinedFactor = baseMultiplier * diffWeight * importanceWeight * companyWeight;

    if (rating === 'failed') {
      newInterval = 1;
    } else {
      if (prevRepetitions === 0) {
        newInterval = rating === 'easy' ? 3 : rating === 'medium' ? 2 : 1;
      } else {
        newInterval = Math.max(1, Math.round(prevInterval * combinedFactor));
      }
    }

    newEaseFactor = Math.max(1.3, Math.min(3.0, prevEaseFactor + (rating === 'easy' ? 0.15 : rating === 'failed' ? -0.2 : 0)));
  }

  const nextRevisionDateIso = addDaysISO(todayIso, newInterval);
  const scheduledDates = generateScheduledDatesSequence(todayIso, newInterval, rating);
  const retentionScore = 100; // Reset to 100% right after review

  const newHistoryEntry = {
    date: todayIso,
    dateFormatted: formatDisplayDate(todayIso),
    rating,
    nextDate: nextRevisionDateIso,
    nextDateFormatted: formatDisplayDate(nextRevisionDateIso)
  };

  const updatedHistory = existingRecord?.history ? [newHistoryEntry, ...existingRecord.history] : [newHistoryEntry];

  return {
    topicId,
    algorithmUsed: algorithm,
    lastAttempted: todayIso,
    lastAttemptedFormatted: formatDisplayDate(todayIso),
    nextRevisionDate: nextRevisionDateIso,
    nextRevisionDateFormatted: formatDisplayDate(nextRevisionDateIso),
    interval: newInterval,
    easeFactor: Number(newEaseFactor.toFixed(2)),
    leitnerBox: newLeitnerBox,
    retentionScore,
    repetitions: newRepetitions,
    lastRating: rating,
    scheduledDates,
    history: updatedHistory
  };
};

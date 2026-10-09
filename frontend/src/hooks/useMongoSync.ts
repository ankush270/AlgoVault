import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { fetchFromMongo, pushToMongo, MongoSyncData } from '../services/mongoSync';

export function useMongoSync() {
  const { user } = useAuth();
  const { progress, restoreProgressState } = useProgress();

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(() => {
    const saved = localStorage.getItem('techswitch_last_cloud_sync');
    return saved ? new Date(saved) : null;
  });

  const [mongoUserKey, setMongoUserKey] = useState<string>(() => {
    const saved = localStorage.getItem('mongo_sync_user_key');
    if (user?.email) return user.email;
    if (saved && saved !== 'ankush-user-1') return saved;
    return 'guest-session';
  });

  const autoSyncTimerRef = useRef<any>(null);
  const lastPushedHashRef = useRef<string>('');

  /**
   * Restores all data from MongoDB into localStorage and React Contexts
   */
  const applyRestoredData = useCallback((data: MongoSyncData) => {
    if (!data) return;

    let restoredCount = 0;

    // 1. Restore LeetCode Solved Status
    if (data.leetcodeSolvedStatus && typeof data.leetcodeSolvedStatus === 'object') {
      const jsonStr = JSON.stringify(data.leetcodeSolvedStatus);
      localStorage.setItem('leetcode_solved_status', jsonStr);
      localStorage.setItem('leetcode_solved_questions_status_v1', jsonStr);
      restoredCount += Object.keys(data.leetcodeSolvedStatus).length;
    }

    // 2. Restore ProgressContext (Topic statuses, starred, notes, revisions, streak)
    if (data.progressState && typeof data.progressState === 'object') {
      restoreProgressState(data.progressState);
    }

    // 3. Restore Striver Sheet Solved Status
    if (data.striverSolvedStatus && typeof data.striverSolvedStatus === 'object') {
      localStorage.setItem('striver_a2z_solved_status_v1', JSON.stringify(data.striverSolvedStatus));
    }

    // 4. Restore Saved Interview Experiences
    if (Array.isArray(data.savedInterviews)) {
      localStorage.setItem('saved_interview_experiences', JSON.stringify(data.savedInterviews));
    }

    // 5. Restore 1v1 Arena History and ELO
    if (Array.isArray(data.arenaHistory)) {
      localStorage.setItem('algovault_match_history', JSON.stringify(data.arenaHistory));
    }
    if (typeof data.arenaElo === 'number') {
      localStorage.setItem('algovault_elo', data.arenaElo.toString());
    }

    // Dispatch global events so all active components re-render immediately
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('techswitch_cloud_sync_restored', { detail: data }));

    const now = new Date();
    setLastSyncTime(now);
    localStorage.setItem('techswitch_last_cloud_sync', now.toISOString());

    return restoredCount;
  }, [restoreProgressState]);

  /**
   * Helper to collect current local snapshot of all data
   */
  const getFullLocalSnapshot = useCallback(() => {
    let leetcodeSolvedStatus = {};
    try {
      const saved = localStorage.getItem('leetcode_solved_status') || localStorage.getItem('leetcode_solved_questions_status_v1');
      if (saved) leetcodeSolvedStatus = JSON.parse(saved);
    } catch (e) {}

    let striverSolvedStatus = {};
    try {
      const saved = localStorage.getItem('striver_a2z_solved_status_v1');
      if (saved) striverSolvedStatus = JSON.parse(saved);
    } catch (e) {}

    let savedInterviews = [];
    try {
      const saved = localStorage.getItem('saved_interview_experiences');
      if (saved) savedInterviews = JSON.parse(saved);
    } catch (e) {}

    let arenaHistory = [];
    try {
      const saved = localStorage.getItem('algovault_match_history');
      if (saved) arenaHistory = JSON.parse(saved);
    } catch (e) {}

    let arenaElo = 1500;
    try {
      const saved = localStorage.getItem('algovault_elo');
      if (saved) arenaElo = parseInt(saved, 10);
    } catch (e) {}

    return {
      leetcodeSolvedStatus,
      progressState: progress,
      striverSolvedStatus,
      savedInterviews,
      arenaHistory,
      arenaElo
    };
  }, [progress]);

  const getFullLocalSnapshotRef = useRef(getFullLocalSnapshot);
  getFullLocalSnapshotRef.current = getFullLocalSnapshot;
  const lastSyncedUserRef = useRef<string | null>(null);

  // Pull data on user login (strictly once per authenticated user session)
  useEffect(() => {
    if (user?.email && lastSyncedUserRef.current !== user.email) {
      lastSyncedUserRef.current = user.email;
      setMongoUserKey(user.email);
      localStorage.setItem('mongo_sync_user_key', user.email);

      fetchFromMongo(user.email).then((data) => {
        if (data) {
          applyRestoredData(data);
          // Set initial hash to avoid instant re-push
          lastPushedHashRef.current = JSON.stringify(getFullLocalSnapshotRef.current());
        }
      });
    } else if (!user?.email) {
      lastSyncedUserRef.current = null;
    }
  }, [user?.email, applyRestoredData]);

  const lastAutoSyncTimeRef = useRef<number>(0);

  // Push to MongoDB
  const handleMongoPush = useCallback(async (isAuto = false) => {
    const token = localStorage.getItem('techswitch_token');
    if (!token) {
      if (!isAuto) {
        alert('Authentication required: Please sign in or create an account to sync your progress to the cloud.');
      }
      return false;
    }

    const key = (user?.email || mongoUserKey || 'guest-session').trim();
    if (!isAuto) setIsSyncing(true);
    localStorage.setItem('mongo_sync_user_key', key);

    const snapshot = getFullLocalSnapshotRef.current();
    const currentHash = JSON.stringify(snapshot);

    if (isAuto && currentHash === lastPushedHashRef.current) {
      return false; // No changes to push
    }

    // Auto-sync throttling: Prevent firing auto-sync more frequently than once every 30 seconds
    const now = Date.now();
    if (isAuto && now - lastAutoSyncTimeRef.current < 30000) {
      // Re-schedule for after the 30s cooldown expires
      if (autoSyncTimerRef.current) clearTimeout(autoSyncTimerRef.current);
      autoSyncTimerRef.current = setTimeout(() => {
        handleMongoPush(true);
      }, 30000 - (now - lastAutoSyncTimeRef.current));
      return false;
    }

    const success = await pushToMongo(snapshot);
    if (!isAuto) setIsSyncing(false);

    if (success) {
      lastPushedHashRef.current = currentHash;
      lastAutoSyncTimeRef.current = Date.now();
      const dateNow = new Date();
      setLastSyncTime(dateNow);
      localStorage.setItem('techswitch_last_cloud_sync', dateNow.toISOString());

      if (!isAuto) {
        setSyncSuccessMsg('All progress, bookmarks, and notes successfully synced to your cloud account!');
        setTimeout(() => setSyncSuccessMsg(''), 4000);
      }
      return true;
    } else if (!isAuto) {
      alert('Could not sync to cloud server. Please verify your connection or ensure the backend service is reachable.');
    }
    return false;
  }, [mongoUserKey, user?.email]);

  // Pull from MongoDB
  const handleMongoPull = useCallback(async () => {
    const token = localStorage.getItem('techswitch_token');
    if (!token) {
      alert('Authentication required: Please sign in or create an account to restore your progress from the cloud.');
      return;
    }

    const key = (user?.email || mongoUserKey || 'guest-session').trim();

    setIsSyncing(true);
    localStorage.setItem('mongo_sync_user_key', key);

    const result = await fetchFromMongo(key);
    setIsSyncing(false);

    if (result) {
      applyRestoredData(result);
      lastPushedHashRef.current = JSON.stringify(getFullLocalSnapshotRef.current());
      setSyncSuccessMsg('Successfully restored all progress from your cloud account!');
      setTimeout(() => setSyncSuccessMsg(''), 4000);
    } else {
      alert('Could not find cloud data for your account. You may not have saved any cloud progress yet, or the server is unavailable.');
    }
  }, [mongoUserKey, user?.email, applyRestoredData]);

  // Debounced Auto-Sync with dirty check when user is logged in (15s debounce, 30s throttle)
  useEffect(() => {
    if (!user?.email) return;

    // Check if state is dirty before scheduling auto-sync
    const currentSnapshot = getFullLocalSnapshotRef.current();
    if (JSON.stringify(currentSnapshot) === lastPushedHashRef.current) {
      return; // No local changes since last push
    }

    if (autoSyncTimerRef.current) clearTimeout(autoSyncTimerRef.current);

    autoSyncTimerRef.current = setTimeout(() => {
      handleMongoPush(true);
    }, 15000);

    return () => {
      if (autoSyncTimerRef.current) clearTimeout(autoSyncTimerRef.current);
    };
  }, [user?.email, progress, handleMongoPush]);

  // Safe Flush on Tab Close / Hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && user?.email) {
        const currentSnapshot = getFullLocalSnapshotRef.current();
        if (JSON.stringify(currentSnapshot) !== lastPushedHashRef.current) {
          handleMongoPush(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.email, handleMongoPush]);

  return {
    mongoUserKey,
    setMongoUserKey,
    isSyncing,
    showSyncModal,
    setShowSyncModal,
    syncSuccessMsg,
    handleMongoPush,
    handleMongoPull,
    lastSyncTime,
    isAutoSyncActive: !!user?.email
  };
}

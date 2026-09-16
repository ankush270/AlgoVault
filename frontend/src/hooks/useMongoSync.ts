import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { fetchFromMongo, pushToMongo } from '../services/mongoSync';

export function useMongoSync() {
  const { user } = useAuth();
  const { progress } = useProgress();

  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [mongoUserKey, setMongoUserKey] = useState<string>(() => {
    return user?.email || localStorage.getItem('mongo_sync_user_key') || 'ankush-user-1';
  });

  useEffect(() => {
    if (user?.email) {
      setMongoUserKey(user.email);
      fetchFromMongo(user.email).then((data) => {
        if (data && data.leetcodeSolvedStatus) {
          localStorage.setItem('leetcode_solved_questions_status_v1', JSON.stringify(data.leetcodeSolvedStatus));
          window.dispatchEvent(new Event('storage'));
        }
      });
    }
  }, [user]);

  const handleMongoPush = useCallback(async () => {
    if (!mongoUserKey.trim()) return;
    setIsSyncing(true);
    localStorage.setItem('mongo_sync_user_key', mongoUserKey.trim());

    let leetcodeSolvedStatus = {};
    try {
      const saved = localStorage.getItem('leetcode_solved_status');
      if (saved) leetcodeSolvedStatus = JSON.parse(saved);
    } catch (e) {}

    const success = await pushToMongo(mongoUserKey, leetcodeSolvedStatus, progress);
    setIsSyncing(false);

    if (success) {
      setSyncSuccessMsg(`Successfully synced data to MongoDB under Key '${mongoUserKey.trim()}'!`);
      setTimeout(() => setSyncSuccessMsg(''), 3000);
    } else {
      alert('Could not push to MongoDB server. Ensure backend server is running.');
    }
  }, [mongoUserKey, progress]);

  const handleMongoPull = useCallback(async () => {
    if (!mongoUserKey.trim()) return;
    setIsSyncing(true);
    localStorage.setItem('mongo_sync_user_key', mongoUserKey.trim());

    const result = await fetchFromMongo(mongoUserKey);
    setIsSyncing(false);

    if (result) {
      setSyncSuccessMsg(`Successfully pulled data from MongoDB for Key '${mongoUserKey.trim()}'!`);
      setTimeout(() => setSyncSuccessMsg(''), 3000);
      window.dispatchEvent(new Event('storage'));
    } else {
      alert(`Could not find data on MongoDB for Key '${mongoUserKey.trim()}'.`);
    }
  }, [mongoUserKey]);

  return {
    mongoUserKey,
    setMongoUserKey,
    isSyncing,
    showSyncModal,
    setShowSyncModal,
    syncSuccessMsg,
    handleMongoPush,
    handleMongoPull,
  };
}

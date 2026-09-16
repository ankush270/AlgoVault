const getSyncServerUrl = (): string => {
  const syncUrl = import.meta.env.VITE_SYNC_SERVER_URL as string;
  const apiUrl = import.meta.env.VITE_API_URL as string;
  if (syncUrl) return syncUrl.replace(/\/$/, '');
  if (apiUrl) return apiUrl.replace(/\/api\/?$/, '');
  return 'http://localhost:5000';
};

const SERVER_URL = getSyncServerUrl();

export interface MongoSyncData {
  userId: string;
  leetcodeSolvedStatus: Record<string, 'solved' | 'review' | undefined>;
  progressState: any;
  updatedAt?: string;
}

export const checkMongoHealth = async (): Promise<{ ok: boolean; dbConnected: boolean }> => {
  try {
    const res = await fetch(`${SERVER_URL}/api/health`);
    if (!res.ok) return { ok: false, dbConnected: false };
    const data = await res.json();
    return { ok: true, dbConnected: data.mongoConnected };
  } catch (e) {
    return { ok: false, dbConnected: false };
  }
};

export const fetchFromMongo = async (userId: string): Promise<MongoSyncData | null> => {
  try {
    const res = await fetch(`${SERVER_URL}/api/sync/${encodeURIComponent(userId.toLowerCase().trim())}`);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success) {
      return {
        userId: json.userId,
        leetcodeSolvedStatus: json.leetcodeSolvedStatus || {},
        progressState: json.progressState || {},
        updatedAt: json.updatedAt
      };
    }
    return null;
  } catch (e) {
    console.error('Error fetching from MongoDB:', e);
    return null;
  }
};

export const pushToMongo = async (
  userId: string,
  leetcodeSolvedStatus: Record<string, any>,
  progressState: any
): Promise<boolean> => {
  try {
    const res = await fetch(`${SERVER_URL}/api/sync/${encodeURIComponent(userId.toLowerCase().trim())}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        leetcodeSolvedStatus,
        progressState
      })
    });
    const json = await res.json();
    return json.success === true;
  } catch (e) {
    console.error('Error pushing to MongoDB:', e);
    return false;
  }
};

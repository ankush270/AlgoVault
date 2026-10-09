import { getBackendBaseUrl } from './api';

const getServerUrl = (): string => getBackendBaseUrl();

export interface MongoSyncData {
  userId: string;
  leetcodeSolvedStatus: Record<string, 'solved' | 'review' | undefined>;
  progressState: any;
  striverSolvedStatus?: Record<string, boolean>;
  savedInterviews?: any[];
  arenaHistory?: any[];
  arenaElo?: number;
  updatedAt?: string;
}

export const checkMongoHealth = async (): Promise<{ ok: boolean; dbConnected: boolean }> => {
  try {
    const res = await fetch(`${getServerUrl()}/api/health`);
    if (!res.ok) return { ok: false, dbConnected: false };
    const data = await res.json();
    return { ok: true, dbConnected: data.mongoConnected };
  } catch (e) {
    return { ok: false, dbConnected: false };
  }
};

const getAuthToken = (): string | null => {
  return localStorage.getItem('techswitch_token') || null;
};

export const fetchFromMongo = async (userId?: string): Promise<MongoSyncData | null> => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.warn('Sync fetch skipped: No authentication token found.');
      return null;
    }

    const res = await fetch(`${getServerUrl()}/api/sync`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success) {
      return {
        userId: json.userId,
        leetcodeSolvedStatus: json.leetcodeSolvedStatus || {},
        progressState: json.progressState || {},
        striverSolvedStatus: json.striverSolvedStatus || {},
        savedInterviews: json.savedInterviews || [],
        arenaHistory: json.arenaHistory || [],
        arenaElo: json.arenaElo || 1500,
        updatedAt: json.updatedAt
      };
    }
    return null;
  } catch (e) {
    console.error('Error fetching from MongoDB:', e);
    return null;
  }
};

/**
 * Push full or partial user progress state to MongoDB.
 * Accepts either:
 * - pushToMongo(snapshot: Partial<MongoSyncData>)
 * - pushToMongo(userIdOrKey: string, snapshot: Partial<MongoSyncData>) [legacy signature]
 */
export const pushToMongo = async (
  dataOrKey: string | Partial<MongoSyncData>,
  dataSnapshot?: Partial<MongoSyncData>
): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.warn('Sync push skipped: No authentication token found.');
      return false;
    }

    const bodyPayload: Partial<MongoSyncData> =
      typeof dataOrKey === 'object' && dataOrKey !== null
        ? dataOrKey
        : (dataSnapshot && typeof dataSnapshot === 'object' ? dataSnapshot : {});

    const res = await fetch(`${getServerUrl()}/api/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bodyPayload)
    });
    const json = await res.json();
    return json.success === true;
  } catch (e) {
    console.error('Error pushing to MongoDB:', e);
    return false;
  }
};

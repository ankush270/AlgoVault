const getSyncServerUrl = (): string => {
  const syncUrl = import.meta.env.VITE_SYNC_SERVER_URL as string;
  const apiUrl = import.meta.env.VITE_API_URL as string;
  if (syncUrl) return syncUrl.replace(/\/$/, '');
  if (apiUrl) return apiUrl.replace(/\/api\/?$/, '');
  return 'http://localhost:5000';
};

const SERVER_URL = getSyncServerUrl();

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: UserProfile;
}

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${SERVER_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to connect to authentication server' };
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${SERVER_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to connect to authentication server' };
  }
};

export const fetchUserProfile = async (token: string): Promise<UserProfile | null> => {
  try {
    const res = await fetch(`${SERVER_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.success) {
      return data.user;
    }
    return null;
  } catch (error) {
    return null;
  }
};

import { getBackendBaseUrl } from './api';

const getServerUrl = (): string => getBackendBaseUrl();

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
  refreshToken?: string;
  user?: UserProfile;
}

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${getServerUrl()}/api/auth/register`, {
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
    const res = await fetch(`${getServerUrl()}/api/auth/login`, {
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

export const refreshAccessToken = async (refreshToken: string): Promise<AuthResponse> => {
  try {
    const res = await fetch(`${getServerUrl()}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to connect to authentication server' };
  }
};

export const logoutUserApi = async (refreshToken?: string | null): Promise<void> => {
  if (!refreshToken) return;
  try {
    await fetch(`${getServerUrl()}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
  } catch (error) {
    // Fail-open for client logout
  }
};

export const fetchUserProfile = async (token: string): Promise<UserProfile | null> => {
  try {
    const res = await fetch(`${getServerUrl()}/api/auth/me`, {
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

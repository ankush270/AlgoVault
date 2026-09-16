const getApiBaseUrl = (): string => {
  const syncUrl = import.meta.env.VITE_SYNC_SERVER_URL as string;
  const apiUrl = import.meta.env.VITE_API_URL as string;
  if (apiUrl) return apiUrl.replace(/\/$/, '');
  if (syncUrl) return `${syncUrl.replace(/\/$/, '')}/api`;
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// 1. Auth API Calls
export const apiAuth = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async getMe(token: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  },
};

// 2. Cloud Sync API Calls
export const apiSync = {
  async fetchUserData(userId: string) {
    const res = await fetch(`${API_BASE_URL}/sync/${encodeURIComponent(userId)}`);
    return res.json();
  },

  async pushUserData(userId: string, leetcodeSolvedStatus: Record<string, boolean>, progressState: Record<string, any>) {
    const res = await fetch(`${API_BASE_URL}/sync/${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leetcodeSolvedStatus, progressState }),
    });
    return res.json();
  },
};

// 3. AI Chatbot API Calls (Sarvam AI)
export const apiChat = {
  async sendMessage(messages: { role: string; content: string }[]): Promise<{ success: boolean; reply?: string; message?: string }> {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    return res.json();
  },
};

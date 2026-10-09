export const getBackendBaseUrl = (): string => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;
  const apiUrl = import.meta.env.VITE_API_URL as string;
  const syncUrl = import.meta.env.VITE_SYNC_SERVER_URL as string;

  const normalize = (url?: string): string => {
    if (!url || typeof url !== 'string') return '';
    return url.trim().replace(/\/api\/?$/i, '').replace(/\/+$/, '');
  };

  const normalizedBackend = normalize(backendUrl);
  if (normalizedBackend) return normalizedBackend;

  const normalizedApi = normalize(apiUrl);
  if (normalizedApi) return normalizedApi;

  const normalizedSync = normalize(syncUrl);
  if (normalizedSync) return normalizedSync;

  return 'http://localhost:5000';
};

export const getApiBaseUrl = (): string => {
  return `${getBackendBaseUrl()}/api`;
};

export const API_BASE_URL = getApiBaseUrl();

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
  async fetchUserData(userId?: string, tokenOverride?: string) {
    const token = tokenOverride || (typeof window !== 'undefined' ? localStorage.getItem('techswitch_token') : null);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = userId 
      ? `${API_BASE_URL}/sync/${encodeURIComponent(userId)}`
      : `${API_BASE_URL}/sync`;

    const res = await fetch(url, { headers });
    return res.json();
  },

  async pushUserData(
    userId: string,
    leetcodeSolvedStatus: Record<string, any>,
    progressState: Record<string, any>,
    extraData?: Record<string, any>,
    tokenOverride?: string
  ) {
    const token = tokenOverride || (typeof window !== 'undefined' ? localStorage.getItem('techswitch_token') : null);
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = userId 
      ? `${API_BASE_URL}/sync/${encodeURIComponent(userId)}`
      : `${API_BASE_URL}/sync`;

    const payload = {
      leetcodeSolvedStatus,
      progressState,
      ...(extraData || {}),
    };

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};

// 3. AI Chatbot API Calls (Sarvam AI)
export const apiChat = {
  async sendMessage(messages: { role: string; content: string }[]): Promise<{ success: boolean; reply?: string; message?: string; status?: number }> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('techswitch_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ messages }),
    });
    const data = await res.json().catch(() => ({ success: false, message: 'Invalid response from server' }));
    return { ...data, status: res.status };
  },
};

// 4. Code Execution API Calls (Piston / Local Backend Engine)
export const apiExecute = {
  async runCode(language: string, code: string, stdin = '') {
    const token = typeof window !== 'undefined' ? localStorage.getItem('techswitch_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/execute`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ language, code, stdin }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401) {
        return {
          output: '',
          stderr: '🔒 Please log in to run code.',
          status: 'ERROR',
          executionTime: 0,
          memory: 0,
          isUnauthorized: true
        };
      }
      return {
        output: '',
        stderr: data?.stderr || data?.message || `Execution failed (Status: ${res.status})`,
        status: data?.status || 'ERROR',
        executionTime: 0,
        memory: 0
      };
    }
    return data;
  },
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/execute/health`);
      return res.json();
    } catch (e: any) {
      return { status: 'error', message: e.message };
    }
  }
};

// 5. 1v1 Arena API Calls (Tests Verification, Leaderboard, Profiles)
export const apiArena = {
  async runTests(problemId: string, language: string, code: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('techswitch_token') : null;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/arena/run-tests`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ problemId, language, code }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401) {
        return {
          status: 'ERROR',
          testsPassed: 0,
          totalTests: 0,
          allPassed: false,
          output: '',
          stderr: '🔒 Please log in to run arena tests.'
        };
      }
      return {
        status: 'ERROR',
        testsPassed: 0,
        totalTests: 0,
        allPassed: false,
        output: '',
        stderr: data?.stderr || data?.error || data?.message || `Arena evaluation failed (Status: ${res.status})`
      };
    }
    return data;
  },
  async fetchLeaderboard() {
    const res = await fetch(`${API_BASE_URL}/arena/leaderboard`);
    return res.json();
  },
  async fetchProfile(userId: string, username?: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('techswitch_token') : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const query = username ? `?username=${encodeURIComponent(username)}` : '';
    try {
      const res = await fetch(`${API_BASE_URL}/arena/profile/${encodeURIComponent(userId)}${query}`, {
        headers
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

};




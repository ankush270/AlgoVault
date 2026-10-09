import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, fetchUserProfile, refreshAccessToken, logoutUserApi } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserProfile, refreshToken?: string) => void;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('techswitch_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse techswitch_user from localStorage:', e);
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('techswitch_token') || null;
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem('techswitch_refresh_token') || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    const currentRefresh = refreshToken || localStorage.getItem('techswitch_refresh_token');
    if (currentRefresh) {
      logoutUserApi(currentRefresh).catch(() => {});
    }

    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('techswitch_token');
    localStorage.removeItem('techswitch_refresh_token');
    localStorage.removeItem('techswitch_user');
  }, [refreshToken]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const currentRefresh = refreshToken || localStorage.getItem('techswitch_refresh_token');
    if (!currentRefresh) {
      logout();
      return false;
    }

    const res = await refreshAccessToken(currentRefresh);
    if (res.success && res.token && res.user) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('techswitch_token', res.token);
      localStorage.setItem('techswitch_user', JSON.stringify(res.user));

      if (res.refreshToken) {
        setRefreshToken(res.refreshToken);
        localStorage.setItem('techswitch_refresh_token', res.refreshToken);
      }
      return true;
    }

    logout();
    return false;
  }, [refreshToken, logout]);

  useEffect(() => {
    const verifyUserSession = async () => {
      if (token) {
        const profile = await fetchUserProfile(token);
        if (profile) {
          setUser(profile);
          localStorage.setItem('techswitch_user', JSON.stringify(profile));
        } else {
          // Token expired or invalid — attempt refresh
          await refreshSession();
        }
      }
      setIsLoading(false);
    };

    verifyUserSession();
  }, [token, refreshSession]);

  const login = (newToken: string, newUser: UserProfile, newRefreshToken?: string) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('techswitch_token', newToken);
    localStorage.setItem('techswitch_user', JSON.stringify(newUser));

    if (newRefreshToken) {
      setRefreshToken(newRefreshToken);
      localStorage.setItem('techswitch_refresh_token', newRefreshToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useOptionalAuth = () => {
  return useContext(AuthContext);
};

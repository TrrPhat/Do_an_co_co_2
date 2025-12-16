import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { apiFetch, getToken, setToken, clearToken } from '@/lib/auth';

const AuthContext = createContext({ user: null, initializing: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setInitializing(false);
      return null;
    }
    try {
      const res = await apiFetch('/auth/me');
      setUser(res.user || null);
      return res.user || null;
    } catch (e) {
      clearToken();
      setUser(null);
      return null;
    } finally {
      setInitializing(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try { await apiFetch('/auth/logout', { method: 'POST' }); } catch (e) {}
    clearToken();
    setUser(null);
  }, []);

  useEffect(() => {
    refreshUser();
    const onStorage = (e) => {
      if (e.key === 'auth_token') {
        refreshUser();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshUser]);

  const value = useMemo(() => ({ user, setUser, initializing, refreshUser, logout }), [user, initializing, refreshUser, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}


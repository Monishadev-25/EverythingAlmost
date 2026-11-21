import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from '../api/auth';
import { clearStoredToken, getStoredToken, setStoredToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(getStoredToken()));

  const applySession = useCallback((nextToken, nextUser) => {
    setStoredToken(nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async (signal) => {
    const activeToken = getStoredToken();
    if (!activeToken) {
      clearSession();
      setIsLoading(false);
      return null;
    }

    try {
      const data = await fetchCurrentUser(signal);
      setUser(data.user);
      return data.user;
    } catch (error) {
      if (error.name !== 'AbortError') {
        clearSession();
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    const controller = new AbortController();

    if (token) {
      refreshUser(controller.signal);
    } else {
      setIsLoading(false);
    }

    return () => controller.abort();
  }, [token, refreshUser]);

  const register = useCallback(async (payload) => {
    const data = await registerUser(payload);
    applySession(data.token, data.user);
    return data;
  }, [applySession]);

  const login = useCallback(async (payload) => {
    const data = await loginUser(payload);
    applySession(data.token, data.user);
    return data;
  }, [applySession]);

  const logout = useCallback(async () => {
    try {
      if (getStoredToken()) {
        await logoutUser();
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const isSuperAdmin = Boolean(
    user && (user.is_superadmin === true || user.username === 'superadmin')
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        isSuperAdmin,
        isLoading,
        register,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

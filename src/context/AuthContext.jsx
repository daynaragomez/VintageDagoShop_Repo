import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getToken,
  getUser,
  login as loginRequest,
  logout as logoutRequest,
} from '../infrastructure/api/authService';

const AuthContext = createContext(null);

function getStoredAuth() {
  return {
    token: getToken(),
    user: getUser(),
  };
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getStoredAuth);

  useEffect(() => {
    const handleAuthChanged = () => setAuthState(getStoredAuth());

    window.addEventListener('auth:changed', handleAuthChanged);
    window.addEventListener('storage', handleAuthChanged);

    return () => {
      window.removeEventListener('auth:changed', handleAuthChanged);
      window.removeEventListener('storage', handleAuthChanged);
    };
  }, []);

  const handleLogin = async (email, password) => {
    const data = await loginRequest(email, password);
    setAuthState({ token: data.token, user: data.user });
    return data;
  };

  const handleLogout = () => {
    logoutRequest();
    setAuthState({ token: null, user: null });
  };

  const value = useMemo(() => ({
    token: authState.token,
    user: authState.user,
    isAuthenticated: Boolean(authState.token),
    isAdmin: authState.user?.role === 'admin',
    login: handleLogin,
    logout: handleLogout,
    syncAuthState: () => setAuthState(getStoredAuth()),
  }), [authState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

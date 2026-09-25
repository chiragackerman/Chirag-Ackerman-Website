import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAdminSession, loginAdmin, logoutAdmin } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    fetchAdminSession()
      .then((session) => setAdminUser(session?.authenticated ? session.user : null))
      .catch(() => setAdminUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const login = async ({ email, password }) => {
    const data = await loginAdmin({ email, password });
    if (data.success) {
      setAdminUser(data.user);
      return data.user;
    }
    throw new Error('Authentication failed');
  };

  const logout = async () => {
    await logoutAdmin();
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ adminUser, isAuthenticated: !!adminUser, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

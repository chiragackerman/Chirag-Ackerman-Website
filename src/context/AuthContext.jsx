import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem('chirag_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('chirag_admin_token') || null;
    } catch {
      return null;
    }
  });

  const login = async ({ email, password, googleUser }) => {
    const data = await loginAdmin({ email, password, googleUser });
    if (data.success) {
      setAdminUser(data.user);
      setToken(data.token);
      localStorage.setItem('chirag_admin_user', JSON.stringify(data.user));
      localStorage.setItem('chirag_admin_token', data.token);
      return data.user;
    }
    throw new Error('Authentication failed');
  };

  const logout = () => {
    setAdminUser(null);
    setToken(null);
    localStorage.removeItem('chirag_admin_user');
    localStorage.removeItem('chirag_admin_token');
  };

  return (
    <AuthContext.Provider value={{ adminUser, token, isAuthenticated: !!adminUser, login, logout }}>
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

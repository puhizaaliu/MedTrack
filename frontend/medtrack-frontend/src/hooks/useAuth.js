import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, refreshToken as apiRefresh } from '../api/auth';
import api from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session using refresh token
  useEffect(() => {
    async function restore() {
      const token = localStorage.getItem('refreshToken');
      if (token) {
        try {
          const { accessToken, refreshToken, user } = await apiRefresh(token);
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          setUser(user);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setLoading(false);
    }
    restore();
  }, []);

  const login = async (credentials) => {
    const { accessToken, refreshToken, user } = await apiLogin(credentials);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

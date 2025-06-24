import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, refreshToken as apiRefresh } from '../api/auth';

const AuthContext = createContext();

/**
 * Exposes:
 *  - user: null | { userId, role, name, … }
 *  - login(credentials): Promise<{ accessToken, refreshToken, user }>
 *  - logout()
 *  - loading: boolean (true while we’re restoring session on page-load)
 */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session with refresh token
  useEffect(() => {
    (async function restore() {
      const rt = localStorage.getItem('refreshToken');
      if (rt) {
        try {
          // your refresh endpoint returns { accessToken, refreshToken, user }
          const data = await apiRefresh(rt);
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('role',data.user.role);
          localStorage.setItem('userId',data.user.userId);
          setUser(data.user);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setLoading(false);
    })();
  }, []);
      

  const login = async credentials => {
    const data = await apiLogin(credentials);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('role',data.user.role);
    localStorage.setItem('userId',data.user.userId)
    setUser(data.user);
    return data;
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

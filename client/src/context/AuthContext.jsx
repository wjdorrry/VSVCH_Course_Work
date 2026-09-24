import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('catering_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('catering_token')));

  useEffect(() => {
    const token = localStorage.getItem('catering_token');
    if (!token) return setLoading(false);
    api('/auth/me')
      .then(({ user: current }) => {
        setUser(current);
        localStorage.setItem('catering_user', JSON.stringify(current));
      })
      .catch(() => {
        localStorage.removeItem('catering_token');
        localStorage.removeItem('catering_user');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveSession = (payload) => {
    localStorage.setItem('catering_token', payload.token);
    localStorage.setItem('catering_user', JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const login = async (email, password) => {
    const payload = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    saveSession(payload);
    return payload.user;
  };

  const register = async (data) => {
    const payload = await api('/auth/register', { method: 'POST', body: JSON.stringify(data) });
    saveSession(payload);
    return payload.user;
  };

  const logout = () => {
    localStorage.removeItem('catering_token');
    localStorage.removeItem('catering_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

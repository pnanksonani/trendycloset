import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // { username, role }
  const [loading, setLoading] = useState(true);

  // Hydrate from cookie on first load
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { user } = await api('/auth/me');           // needs /me route
        if (!cancelled){
            setUser({ username: user.username, role: user.role });  
            console.log(user);
        } 
      } catch {
        if (!cancelled){
            setUser(null);
        }                    // not logged in / expired
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Call after successful login to store role+username
  async function login({ email, password, captchaAnswer, captchaToken }) {
    const data = await api('/auth/login', {
      method: 'POST',
      data: { email, password, captchaAnswer, captchaToken },
    });
    setUser({ username: data.username, role: data.role });
    return data;
  }

  async function logout() {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
  }

  const value = useMemo(() => ({
    user,                 // { username, role } or null
    role: user?.role || null,
    username: user?.username || null,
    loading,
    login,
    logout,
    setUser,              // expose in case you want to tweak manually
  }), [user, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, logout } from '@/lib/auth';
import { decodeUserFromToken } from '@/lib/jwt';

interface AuthUser {
  id: string;
  username: string;
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  setToken: () => {},
  setUser: () => {},
  logoutUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Load token + decode user on mount
  useEffect(() => {
    const savedToken = getToken();
    if (!savedToken) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(savedToken);

    const decoded = decodeUserFromToken(savedToken);
    if (decoded) {
      setUser({
        id: decoded.userId,
        username: decoded.username,
      });
    }
  }, []);

  const logoutUser = () => {
    logout();
    setToken(null);
    setUser(null);
  };

  const value = { token, user, setToken, setUser, logoutUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

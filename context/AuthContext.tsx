'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getToken, logout } from '@/lib/auth';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  logoutUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  // read token when component mounts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(getToken());
  }, []);

  const logoutUser = () => {
    logout();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

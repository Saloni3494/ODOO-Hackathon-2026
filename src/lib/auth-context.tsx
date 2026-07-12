import { createContext, useContext, useEffect, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { getSessionFn } from '../server-functions';
import { hasPermission, Permission, Role } from './permissions';

type UserSession = {
  id: string;
  email: string;
  name: string;
  role: Role;
  departmentId?: string | null;
};

type AuthContextType = {
  user: UserSession | null;
  loading: boolean;
  can: (permission: Permission) => boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  can: () => false,
  refresh: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchSession = useServerFn(getSessionFn);

  const loadSession = async () => {
    setLoading(true);
    try {
      const session = await fetchSession();
      setUser(session as UserSession);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const can = (permission: Permission) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  return (
    <AuthContext.Provider value={{ user, loading, can, refresh: loadSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

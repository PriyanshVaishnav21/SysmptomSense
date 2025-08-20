
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiFetch } from '@/lib/api';

type AuthContextType = {
  session: any | null;
  user: { id: string; email: string } | null;
  userName: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUserName: (name: string) => Promise<{ error: any | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage token
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    if (token && userJson) {
      setSession({ token });
      setUser(JSON.parse(userJson));
      fetchUserProfile(JSON.parse(userJson).id);
    }
    setLoading(false);
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const data = await apiFetch<{ name: string | null; email: string }>(`/api/profiles/me`);
      setUserName(data?.name || null);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await apiFetch<{ token: string; user: { id: string; email: string } }>(`/api/auth/signin`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSession({ token: data.token });
      setUser(data.user);
      await fetchUserProfile(data.user.id);
      return { error: null };
    } catch (error) {
      return { error } as any;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const data = await apiFetch<{ token: string; user: { id: string; email: string } }>(`/api/auth/signup`, {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSession({ token: data.token });
      setUser(data.user);
      setUserName(name);
      return { error: null };
    } catch (error) {
      return { error } as any;
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setSession(null);
    setUser(null);
    setUserName(null);
  };

  const updateUserName = async (name: string) => {
    if (!user) return { error: new Error('User not authenticated') };
    try {
      await apiFetch(`/api/profiles/me`, { method: 'PATCH', body: JSON.stringify({ name }) });
      setUserName(name);
      return { error: null };
    } catch (error) {
      return { error } as any;
    }
  };

  const value = {
    session,
    user,
    userName,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserName
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

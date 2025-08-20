
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-pulse mb-4 h-8 w-32 bg-muted rounded mx-auto"></div>
          <div className="animate-pulse h-4 w-48 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return user ? <>{children}</> : null;
};

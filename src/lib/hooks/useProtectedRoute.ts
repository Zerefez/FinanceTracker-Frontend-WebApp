import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { authUtils } from '../utils';

/**
 * Hook for handling protected route logic
 */
export function useProtectedRoute() {
  const location = useLocation();
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean | null;
    isVerifying: boolean;
  }>({
    isAuthenticated: null,
    isVerifying: true
  });
  
  // Check authentication on mount and location change
  useEffect(() => {
    try {
      const isAuth = authUtils.isAuthenticated();
      console.log('Protected route auth check:', isAuth);
      
      setAuthState({
        isAuthenticated: isAuth,
        isVerifying: false
      });
    } catch (error) {
      console.error('Auth verification failed:', error);
      setAuthState({
        isAuthenticated: false,
        isVerifying: false
      });
    }
  }, [location.pathname]);

  return {
    ...authState,
    location
  };
} 
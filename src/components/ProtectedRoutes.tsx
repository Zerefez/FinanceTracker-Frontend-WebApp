import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authUtils } from '../lib/utils';
import Inner from './Inner';

/**
 * ProtectedRoutes component handles authentication protection for all nested routes
 * and takes care of proper redirections based on auth state.
 */
const ProtectedRoutes = () => {
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

  // Show loading state while verifying
  if (authState.isVerifying) {
    return (
      <Inner showHeader={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium mb-4">Verifying your session...</h2>
          </div>
        </div>
      </Inner>
    );
  }

  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child routes with header
  console.log('User authenticated, rendering protected content');
  return (
    <Inner showHeader={true}>
      <Outlet />
    </Inner>
  );
};

export default ProtectedRoutes; 
import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import Inner from './Inner';

/**
 * ProtectedRoutes component handles authentication protection for all nested routes
 * and takes care of proper redirections based on auth state.
 */
const ProtectedRoutes = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  
  // Check authentication status on mount and location change
  useEffect(() => {
    let isMounted = true;
    
    const verifyAuth = () => {
      setIsVerifying(true);
      try {
        // Check if token is valid and not expired
        const isAuth = authService.isAuthenticated();
        
        if (isMounted) {
          setIsAuthenticated(isAuth);
          setIsVerifying(false);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          setIsVerifying(false);
        }
      }
    };
    
    verifyAuth();
    
    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  // Show loading state while verifying
  if (isVerifying) {
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

  // If not authenticated, redirect to login while saving the attempted location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child routes using Outlet wrapped with Inner component that includes Header
  return (
    <Inner showHeader={true}>
      <Outlet />
    </Inner>
  );
};

export default ProtectedRoutes; 
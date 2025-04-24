import { Navigate, Outlet } from 'react-router-dom';
import { useProtectedRoute } from '../lib/hooks';
import Inner from './Inner';

/**
 * ProtectedRoutes component handles authentication protection for all nested routes
 * and takes care of proper redirections based on auth state.
 */
const ProtectedRoutes = () => {
  const { isAuthenticated, isVerifying, location } = useProtectedRoute();
  
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

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
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
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authUtils } from '../utils';

/**
 * ProtectedRoutes component handles authentication protection for all nested routes
 * and takes care of proper redirections based on auth state.
 */
const ProtectedRoutes = () => {
  const location = useLocation();
  const isAuthenticated = authUtils.isAuthenticated();

  // If not authenticated, redirect to login while saving the attempted location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child routes using Outlet
  return <Outlet />;
};

export default ProtectedRoutes; 
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Inner from './Inner';

/**
 * ProtectedRoutes component handles authentication protection for all nested routes
 * and takes care of proper redirections based on auth state.
 */
const ProtectedRoutes = () => {
  const location = useLocation();
  
  // Check auth status directly from localStorage
  const isAuthenticated = !!localStorage.getItem('authToken');

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
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AUTH_EVENTS } from "../lib/utils";
import Home from "../pages/Home";
import JobDetailPage from "../pages/JobPage";
import { LoginPage } from "../pages/LoginPage";
import { LogoutPage } from "../pages/LogoutPage";
import Paycheck from "../pages/Paycheck";
import StudentGrant from "../pages/StudentGrant";
import ProtectedRoutes from "./ProtectedRoutes";

const RouteConfig = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    
    // Check auth on mount
    checkAuth();
    
    // Listen for auth events
    const handleLogin = () => {
      setIsAuthenticated(true);
    };
    
    const handleLogout = () => {
      setIsAuthenticated(false);
    };
    
    window.addEventListener(AUTH_EVENTS.LOGIN, handleLogin);
    window.addEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener(AUTH_EVENTS.LOGIN, handleLogin);
      window.removeEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Check if the current path is the logout page
  const isLogoutPage = location.pathname === '/logout';
  
  // Dynamic routing key helps ensure proper redirects when auth state changes
  // Skip changing the key for logout page to prevent re-rendering during logout
  const routingKey = isLogoutPage 
    ? 'logout-page' 
    : `${location.pathname}-${isAuthenticated ? 'auth' : 'noauth'}`;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={routingKey}>
        {/* Public routes - accessible whether logged in or not */}
        <Route path="/login" element={
          isAuthenticated && !isLogoutPage ? <Navigate to="/" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />
        } />
        <Route path="/logout" element={<LogoutPage />} />
        
        {/* Protected routes - nested under ProtectedRoutes with Outlet */}
        <Route path="/" element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="paycheck" element={<Paycheck />} />
          <Route path="student-grant" element={<StudentGrant />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
        </Route>

        {/* Catch all route - redirect to login if not authenticated, home if authenticated */}
        <Route path="*" element={
          isAuthenticated ? 
            <Navigate to="/" replace /> : 
            <Navigate to="/login" replace />
        } />
      </Routes>
    </AnimatePresence>
  );
};

export default RouteConfig; 
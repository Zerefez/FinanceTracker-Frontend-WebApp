import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AUTH_EVENTS } from "../lib/utils";
import Home from "../pages/Home";
import JobDetailPage from "../pages/JobPage";
import { LoginPage } from "../pages/LoginPage";
import { LogoutPage } from "../pages/LogoutPage";
import Paycheck from "../pages/Paycheck";
import { RegisterPage } from "../pages/RegisterPage";
import StudentGrant from "../pages/StudentGrant";
import { authService } from "../services/authService";
import ProtectedRoutes from "./ProtectedRoutes";

const RouteConfig = () => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check authentication status
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = () => {
      try {
        // Now using the synchronous method since JWT validation is done on the client
        const isAuth = authService.isAuthenticated();
        if (isMounted) {
          setIsAuthenticated(isAuth);
          setIsInitializing(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          setIsInitializing(false);
        }
      }
    };
    
    // Check auth on mount
    checkAuth();
    
    // Listen for auth events
    const handleLogin = () => {
      setIsAuthenticated(true);
      console.log('Auth state updated: User is now authenticated');
    };
    
    const handleLogout = () => {
      setIsAuthenticated(false);
      console.log('Auth state updated: User is now logged out');
    };
    
    window.addEventListener(AUTH_EVENTS.LOGIN, handleLogin);
    window.addEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
    
    return () => {
      isMounted = false;
      window.removeEventListener(AUTH_EVENTS.LOGIN, handleLogin);
      window.removeEventListener(AUTH_EVENTS.LOGOUT, handleLogout);
    };
  }, []);

  // Show loading screen while initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
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
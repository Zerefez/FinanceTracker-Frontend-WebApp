import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AUTH_EVENTS, authUtils } from "../lib/utils";
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
  const [isInitializing, setIsInitializing] = useState(true);

  // Check authentication and setup auth event listeners
  useEffect(() => {
    // Initial auth check
    const initialAuth = authUtils.isAuthenticated();
    console.log('Initial auth check in RouteConfig:', initialAuth);
    setIsAuthenticated(initialAuth);
    setIsInitializing(false);
    
    // Event handlers for login/logout events
    const handleAuthEvent = (event: Event) => {
      const newAuthState = event.type === AUTH_EVENTS.LOGIN;
      console.log('Auth event received:', event.type, 'New state:', newAuthState);
      setIsAuthenticated(newAuthState);
    };
    
    // Setup event listeners
    window.addEventListener(AUTH_EVENTS.LOGIN, handleAuthEvent);
    window.addEventListener(AUTH_EVENTS.LOGOUT, handleAuthEvent);
    
    return () => {
      window.removeEventListener(AUTH_EVENTS.LOGIN, handleAuthEvent);
      window.removeEventListener(AUTH_EVENTS.LOGOUT, handleAuthEvent);
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

  // Generate a key for route transitions
  const routingKey = location.pathname === '/logout'
    ? 'logout-page'
    : `${location.pathname}-${isAuthenticated ? 'auth' : 'noauth'}`;
  
  console.log('Rendering routes with key:', routingKey, 'Auth state:', isAuthenticated);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={routingKey}>
        {/* Public routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />
        } />

        <Route path="/logout" element={<LogoutPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="paycheck" element={<Paycheck />} />
          <Route path="student-grant" element={<StudentGrant />} />
          <Route path="jobs/:id" element={<JobDetailPage />} />
        </Route>

        {/* Catch all route */}
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
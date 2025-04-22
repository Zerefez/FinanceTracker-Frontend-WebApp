import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../lib/hooks";
import Home from "../pages/Home";
import JobPage from "../pages/JobPage";
import { LoginPage } from "../pages/LoginPage";
import { LogoutPage } from "../pages/LogoutPage";
import Paycheck from "../pages/Paycheck";
import StudentGrant from "../pages/StudentGrant";
import ProtectedRoutes from "./ProtectedRoutes";

const RouteConfig = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

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
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage setIsAuthenticated={() => {/* No-op, using hook now */}} />
        } />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="paycheck" element={<Paycheck />} />
          <Route path="student-grant" element={<StudentGrant />} />
          <Route path="jobs/:id" element={<JobPage />} />
          <Route path="jobs/new" element={<JobPage />} />
          <Route path="/logout" element={<LogoutPage />} />
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
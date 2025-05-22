import { AnimatePresence } from "framer-motion";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../lib/hooks";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
import { LoginPage } from "../pages/LoginPage";
import { LogoutPage } from "../pages/LogoutPage";
import PaycheckComparePage from "../pages/PaycheckComparePage";
import Paycheck from "../pages/PaycheckPage";
import { RegisterPage } from "../pages/RegisterPage";
import StudentGrant from "../pages/StudentGrantPage";
import VacationPay from "../pages/VacationPayPage";
import JobPage from "./JobDetail";
import ProtectedRoutes from "./ProtectedRoutes";

const RouteConfig = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  // Show loading screen while initializing
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Check if the current path is the logout page
  const isLogoutPage = location.pathname === "/logout";

  // Add detailed logging
  console.log("Current location:", location.pathname);
  console.log("Is logout page?", isLogoutPage);

  // Generate a key for route transitions
  const routingKey = isLogoutPage
    ? "logout-page"
    : `${location.pathname}-${isAuthenticated ? "auth" : "noauth"}`;

  console.log("Rendering routes with key:", routingKey, "Auth state:", isAuthenticated);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={routingKey}>
        {/* Public routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoutes />}>
          <Route index element={<Home />} />
          <Route path="paycheck" element={<Paycheck />} />
          <Route path="paycheck/:PaycheckId" element={<Paycheck />} />
          <Route path="paycheck-compare" element={<PaycheckComparePage />} />
          <Route path="paycheck-compare/:companyName" element={<PaycheckComparePage />} />
          <Route path="vacation-pay" element={<VacationPay />} />
          <Route path="vacation-pay/:companyName" element={<VacationPay />} />
          <Route path="student-grant" element={<StudentGrant />} />
          <Route path="jobs/:companyName" element={<JobPage />} />
          <Route path="jobs/new" element={<JobPage />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Catch all route */}
        <Route
          path="*"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </AnimatePresence>
  );
};

export default RouteConfig;

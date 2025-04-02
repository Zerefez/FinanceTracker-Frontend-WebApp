import { AnimatePresence } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Home from "./pages/Home"
import JobDetailPage from "./pages/JobPage"
import { LoginPage } from "./pages/LoginPage"
import Paycheck from "./pages/Paycheck"
import StudentGrant from "./pages/StudentGrant"

// Create a wrapper component to access location
function AnimatedRoutes() {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken') // or however you store your auth token
      setIsAuthenticated(!!token)
    }
    
    // Check auth on mount
    checkAuth()
    
    // Listen for auth events
    const handleLogin = () => setIsAuthenticated(true);
    const handleLogout = () => setIsAuthenticated(false);
    
    window.addEventListener('auth:login', handleLogin);
    window.addEventListener('auth:logout', handleLogout);
    window.addEventListener('storage', checkAuth); // For cross-tab state sync
    
    return () => {
      window.removeEventListener('auth:login', handleLogin);
      window.removeEventListener('auth:logout', handleLogout);
      window.removeEventListener('storage', checkAuth);
    }
  }, [])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public route */}
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        
        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paycheck"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Paycheck />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-grant"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <StudentGrant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <JobDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const locomotiveScrollRef = useRef<any>(null)

  useEffect(() => {
    ;(async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default
      locomotiveScrollRef.current = new LocomotiveScroll()

      return () => {
        if (locomotiveScrollRef.current) {
          locomotiveScrollRef.current.destroy()
        }
      }
    })()
  }, [])

  return (
    <Router>
      <div className="bg-white w-full min-h-screen">
        <div className="main min-h-screen bg-white text-primary font-sans">
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  )
}

export default App


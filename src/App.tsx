import { AnimatePresence } from "framer-motion"
import { useEffect, useRef } from "react"
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import JobDetailPage from "./pages/JobPage"
import { LoginPage } from "./pages/LoginPage"
import Paycheck from "./pages/Paycheck"
import StudentGrant from "./pages/StudentGrant"

// Create a wrapper component to access location
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/paycheck" element={<Paycheck />} />
        <Route path="/student-grant" element={<StudentGrant />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
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


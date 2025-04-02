import { useEffect, useRef } from "react"
import { BrowserRouter as Router } from "react-router-dom"
import RouteConfig from "./components/RouteConfig"

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
          <RouteConfig />
        </div>
      </div>
    </Router>
  )
}

export default App


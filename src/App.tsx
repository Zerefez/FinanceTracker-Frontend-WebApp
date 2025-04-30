import { BrowserRouter as Router } from "react-router-dom";
import RouteConfig from "./components/RouteConfig";
import { ConfirmationDialogContainer } from "./components/ui/confirmation-dialog";
import { ToastContainer } from "./components/ui/toast";
import { useLocomotiveScroll } from "./lib/hooks";

function App() {
  // Use the custom hook for locomotive scroll
  useLocomotiveScroll();

  return (
    <Router>
      <div className="bg-white w-full min-h-screen">
        <div className="main min-h-screen bg-white text-primary font-sans">
          <RouteConfig />
          <ToastContainer />
          <ConfirmationDialogContainer />
        </div>
      </div>
    </Router>
  )
}

export default App


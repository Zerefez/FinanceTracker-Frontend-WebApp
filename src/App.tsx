import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Paycheck from './pages/Paycheck';


function App() {
  
  useEffect(() => {
    (async () => {
      const LocomotiveScroll = (await import("locomotive-scroll")).default;
      new LocomotiveScroll();
    })();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white text-primary font-sans">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Paycheck" element={<Paycheck />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

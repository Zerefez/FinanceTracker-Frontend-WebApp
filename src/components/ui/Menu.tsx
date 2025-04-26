import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimButton from './animation/animButton';
import Nav from './nav';

export default function Menu() {
  const [isActive, setIsActive] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);

  // Check if the screen size is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
      setIsSmallMobile(window.innerWidth < 480);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const menu = {
    open: {
      width: isSmallMobile ? "280px" : "340px",
      height: isSmallMobile ? "550px" : "650px",
      bottom: "-25px",
      right: "-25px",
      transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] }
    },
    closed: {
      width: "100px",
      height: "40px",
      bottom: "0px",
      right: "0px",
      transition: { duration: 0.75, delay: 0.35, type: "tween", ease: [0.76, 0, 0.24, 1] }
    }
  };

  // Only render the menu on mobile devices
  if (!isSmallScreen) return null;

  return (
    <div className="fixed right-[50px] bottom-[50px] lg:hidden z-50">
      <motion.div 
        className={`${isSmallMobile ? 'w-[400px] h-[550px]' : 'w-[480px] h-[650px]'} bg-accent rounded-2xl relative z-50`}
        variants={menu}
        animate={isActive ? "open" : "closed"}
        initial="closed"
      >
        <AnimatePresence>
          {isActive && <Nav />}
        </AnimatePresence>
      </motion.div>
      <AnimButton isActive={isActive} toggleMenu={() => {setIsActive(!isActive)}} />
    </div>
  );
}
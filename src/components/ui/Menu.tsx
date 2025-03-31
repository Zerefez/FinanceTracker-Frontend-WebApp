import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimButton from './animation/animButton';
import Nav from './nav';

export default function Menu() {
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen size is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const menu = {
    open: {
      width: "480px",
      height: "650px",
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
  if (!isMobile) return null;

  return (
    <div className="fixed right-[50px] bottom-[50px] lg:hidden z-1000">
      <motion.div 
        className="w-[480px] h-[650px] bg-accent rounded-2xl relative"
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
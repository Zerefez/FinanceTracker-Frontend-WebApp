import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook for managing the logout process
 */
export function useLogout() {
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    console.log('useLogout effect running');
    
    // Redirect to login page after a delay
    const redirectTimer = setTimeout(() => {
      if (!hasRedirected.current) {
        console.log('Redirecting to login page');
        hasRedirected.current = true;
        navigate('/login', { replace: true });
      }
    }, 3000);
    
    // Cleanup function to clear timer if component unmounts
    return () => {
      console.log('Cleaning up logout timers');
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return {
    hasRedirected
  };
} 
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { AUTH_EVENTS } from '../utils';

/**
 * Hook for managing the logout process
 */
export function useLogout() {
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    const performLogout = async () => {
      // Prevent multiple redirects
      if (hasRedirected.current) return;
      
      try {
        // Use auth service to handle logout (clears JWT token from localStorage)
        await authService.logout();
        
        // Make sure logout event is dispatched to update any components tracking auth state
        window.dispatchEvent(new Event(AUTH_EVENTS.LOGOUT));
      } catch (error) {
        console.error('Logout error:', error);
      }
      
      // Redirect to login page after a short delay
      const timer = setTimeout(() => {
        // Prevent multiple redirects from happening
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          // Use replace: true to prevent going back to the logout page
          navigate('/login', { replace: true });
        }
      }, 1500);
      
      // Return cleanup function
      return () => clearTimeout(timer);
    };
    
    performLogout();
  }, [navigate]);

  return {
    hasRedirected
  };
} 
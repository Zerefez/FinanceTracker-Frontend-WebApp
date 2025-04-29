import { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import { AUTH_EVENTS, authUtils } from '../utils';

/**
 * Hook for managing authentication state and handling auth events
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check authentication and setup auth event listeners
  useEffect(() => {
    // Initial auth check
    const checkAuth = () => {
      const initialAuth = authUtils.isAuthenticated();
      console.log('Auth check in useAuth hook:', initialAuth);
      setIsAuthenticated(initialAuth);
      return initialAuth;
    };
    
    // Perform initial check
    checkAuth();
    setIsInitializing(false);
    
    // Event handlers for login/logout events
    const handleAuthEvent = (event: Event) => {
      const newAuthState = event.type === AUTH_EVENTS.LOGIN;
      console.log('Auth event received in hook:', event.type, 'New state:', newAuthState);
      setIsAuthenticated(newAuthState);
    };
    
    // Handler for storage events to check auth across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'user_data') {
        console.log('Auth storage changed:', e.key);
        const authState = authUtils.isAuthenticated();
        console.log('New auth state after storage change:', authState);
        setIsAuthenticated(authState);
      }
    };
    
    // Setup event listeners
    window.addEventListener(AUTH_EVENTS.LOGIN, handleAuthEvent);
    window.addEventListener(AUTH_EVENTS.LOGOUT, handleAuthEvent);
    window.addEventListener('storage', handleStorageChange);
    
    // Set up regular auth checks (every 5 minutes)
    const authCheckInterval = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000);
    
    return () => {
      window.removeEventListener(AUTH_EVENTS.LOGIN, handleAuthEvent);
      window.removeEventListener(AUTH_EVENTS.LOGOUT, handleAuthEvent);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(authCheckInterval);
    };
  }, []);

  // Authentication actions
  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);
      if (response.success) {
        setIsAuthenticated(true);
        authUtils.loginSuccess();
      }
      return response;
    } catch (error) {
      console.error('Login failed in hook:', error);
      throw error;
    }
  };

  const logout = () => {
    authUtils.logout();
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isInitializing,
    login,
    logout
  };
} 
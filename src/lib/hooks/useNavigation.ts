import { Location, useLocation, useNavigate } from 'react-router-dom';
import { authUtils } from '../utils';

interface LocationState {
  from?: {
    pathname: string;
  };
  message?: string;
  email?: string;
}

/**
 * Hook for handling navigation logic
 */
export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateToLogin = (redirectState?: { 
    message?: string;
    email?: string;
    from?: string;
  }) => {
    let state: LocationState | undefined;
    
    if (redirectState) {
      state = {};
      
      if (redirectState.message) {
        state.message = redirectState.message;
      }
      
      if (redirectState.email) {
        state.email = redirectState.email;
      }
      
      if (redirectState.from) {
        state.from = { pathname: redirectState.from };
      }
    }
    
    navigate('/login', { state, replace: true });
  };

  const handleLogout = () => {
    // Perform the actual logout
    console.log('Logging out user');
    
    // Clear auth data
    authUtils.logout();
    
    // Use React Router navigation instead of direct window.location change
    // This preserves the animation context
    navigate(`/logout?t=${Date.now()}`, { replace: true });
  };

  const navigateAfterLogin = (currentLocation: Location, defaultPath = '/') => {
    const locState = currentLocation.state as LocationState;
    const from = locState?.from?.pathname || defaultPath;
    navigate(from, { replace: true });
  };

  return {
    navigate,
    location,
    navigateToLogin,
    handleLogout,
    navigateAfterLogin
  };
} 
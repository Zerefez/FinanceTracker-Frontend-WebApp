import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Inner from '../components/Inner';
import { Login } from '../components/Login';
import { AUTH_EVENTS } from '../lib/utils';
import { authService } from '../services/authService';

interface LocationState {
  from?: {
    pathname: string;
  };
  message?: string;
  email?: string;
}

interface LoginPageProps {
  setIsAuthenticated: (value: boolean) => void;
}

export function LoginPage({ setIsAuthenticated }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [initialEmail, setInitialEmail] = useState<string>('');
  
  // Check if there's a success message or email from registration
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.message) {
      setSuccessMessage(state.message);
    }
    if (state?.email) {
      setInitialEmail(state.email);
    }
    // Clean up the location state
    navigate(location.pathname, { replace: true, state: { from: state?.from } });
  }, [location, navigate]);
  
  // Check if already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = authService.isAuthenticated();
      if (isAuth) {
        // Already authenticated, redirect to home
        const state = location.state as LocationState;
        const from = state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate, location]);

  const handleLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      /* 
      // Validation now happens on the server side
      const isValidUser = await authService.validateUser(username);
      if (!isValidUser) {
        setErrorMessage('User does not exist. Please check your credentials or register.');
        return;
      }
      */
      
      // Call the auth service to login with JWT
      const response = await authService.login(username, password);
      
      if (!response.success) {
        throw new Error('Login failed');
      }
      
      // Update authentication state
      setIsAuthenticated(true);
      
      // Dispatch custom event for login
      window.dispatchEvent(new Event(AUTH_EVENTS.LOGIN));
      
      // Redirect to the page the user tried to visit, or home page
      const state = location.state as LocationState;
      const from = state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    alert('Forgot password functionality not implemented yet.');
  };

  const handleRegister = () => {
    // Navigate to registration page
    navigate('/register', { replace: false });
  };

  return (
    <Inner showHeader={false}>
      <section>
        <div className="min-h-screen flex items-center justify-center flex-col">
          {successMessage && (
            <div className="p-3 mb-4 bg-green-100 border border-green-400 text-green-700 rounded w-[350px]">
              {successMessage}
            </div>
          )}
          <Login 
            onLogin={handleLogin} 
            isLoading={isLoading} 
            errorMessage={errorMessage}
            onForgotPassword={handleForgotPassword}
            onRegister={handleRegister}
            initialEmail={initialEmail}
          />
        </div> 
      </section>
    </Inner>
  );
} 
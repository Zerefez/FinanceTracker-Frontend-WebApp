import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Inner from '../components/Inner';
import { Login } from '../components/Login';
import { authUtils } from '../lib/utils';
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
  const [state, setState] = useState({
    isLoading: false,
    errorMessage: null as string | null,
    successMessage: null as string | null,
    initialEmail: ''
  });
  
  // Process location state on mount and redirect if already authenticated
  useEffect(() => {
    console.log('LoginPage mounted, checking auth state');
    
    const locState = location.state as LocationState;
    if (locState) {
      setState(prev => ({
        ...prev,
        successMessage: locState.message || null,
        initialEmail: locState.email || ''
      }));
      
      // Preserve only redirect path in location state
      navigate(location.pathname, { 
        replace: true, 
        state: locState.from ? { from: locState.from } : undefined 
      });
    }
    
    // Redirect if already authenticated
    const isAuth = authService.isAuthenticated();
    console.log('User authenticated?', isAuth);
    if (isAuth) {
      const from = locState?.from?.pathname || '/';
      console.log('Already authenticated, redirecting to:', from);
      setIsAuthenticated(true); // Make sure we update parent state
      navigate(from, { replace: true });
    }
  }, [location, navigate, setIsAuthenticated]);

  const handleLogin = async (username: string, password: string) => {
    console.log('Login attempt with username:', username);
    try {
      setState(prev => ({ ...prev, isLoading: true, errorMessage: null, successMessage: null }));
      
      const response = await authService.login(username, password);
      console.log('Login response:', response.success ? 'Success' : 'Failed');
      
      if (response.success) {
        // Update auth state in parent component
        setIsAuthenticated(true);
        
        // Dispatch login event
        authUtils.loginSuccess();
        console.log('Login event dispatched');
        
        // Get redirect destination
        const locState = location.state as LocationState;
        const from = locState?.from?.pathname || '/';
        console.log('Login successful, redirecting to:', from);
        
        // Redirect
        navigate(from, { replace: true });
      } else {
        throw new Error('Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error.message);
      setState(prev => ({ 
        ...prev, 
        errorMessage: error.message || 'Login failed. Please check your credentials.'
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <Inner showHeader={false}>
      <section>
        <div className="min-h-screen flex items-center justify-center flex-col">
          {state.successMessage && (
            <div className="p-3 mb-4 bg-green-100 border border-green-400 text-green-700 rounded w-[350px]">
              {state.successMessage}
            </div>
          )}
          <Login 
            onLogin={handleLogin} 
            isLoading={state.isLoading} 
            errorMessage={state.errorMessage}
            onForgotPassword={() => alert('Forgot password not implemented')}
            onRegister={() => navigate('/register')}
            initialEmail={state.initialEmail}
          />
        </div> 
      </section>
    </Inner>
  );
} 
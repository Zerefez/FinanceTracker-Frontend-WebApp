import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Inner from '../components/Inner';
import { Login } from '../components/Login';
import { useAuth, useLoginForm, useNavigation } from '../lib/hooks';

interface LocationState {
  from?: {
    pathname: string;
  };
  message?: string;
  email?: string;
}

interface LoginPageProps {
  setIsAuthenticated?: (value: boolean) => void;
}

export function LoginPage({ setIsAuthenticated }: LoginPageProps) {
  const { isAuthenticated } = useAuth();
  const { navigate } = useNavigation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Get location state
  const locState = location.state as LocationState;
  const initialEmail = locState?.email || '';
  const successMessage = locState?.message || null;
  
  // Check for error from query params (like session_expired)
  const error = searchParams.get('error');
  const errorFromQuery = error === 'session_expired' ? 'Your session has expired. Please log in again.' : null;
  
  // Use login form hook
  const {
    username,
    setUsername,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleLogin,
    resetForm
  } = useLoginForm(initialEmail);
  
  // Process location state on mount and redirect if already authenticated
  useEffect(() => {
    console.log('LoginPage mounted, checking auth state');
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      const from = locState?.from?.pathname || '/';
      console.log('Already authenticated, redirecting to:', from);
      if (setIsAuthenticated) {
        setIsAuthenticated(true); // Make sure we update parent state if provided
      }
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, locState, navigate, setIsAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin();
    // Update parent state if authenticated and function provided
    if (setIsAuthenticated) {
      setIsAuthenticated(true);
    }
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
            username={username}
            password={password}
            onUsernameChange={(e) => setUsername(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={handleSubmit}
            onReset={resetForm}
            isLoading={isLoading} 
            errorMessage={errorMessage || errorFromQuery}
            onForgotPassword={() => alert('Forgot password not implemented')}
            onRegister={() => navigate('/register')}
          />
        </div>
      </section>
    </Inner>
  );
}
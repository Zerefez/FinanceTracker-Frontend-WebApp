import { useLocation, useNavigate } from 'react-router-dom';
import Inner from '../components/Inner';
import { Login } from '../components/Login';
import { AUTH_EVENTS } from '../lib/utils';

interface LoginPageProps {
  setIsAuthenticated: (value: boolean) => void;
}

export function LoginPage({ setIsAuthenticated }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (email: string, password: string) => {
    try {
      // TODO: Implement actual login logic here
      // For now, we'll just simulate a successful login
      console.log('Logging in with:', email);
      
      // Store authentication token
      localStorage.setItem('authToken', 'dummy-token'); // Replace with actual token from your backend
      
      // Update authentication state
      setIsAuthenticated(true);
      
      // Dispatch custom event for login
      window.dispatchEvent(new Event(AUTH_EVENTS.LOGIN));
      
      // Redirect to the page the user tried to visit, or home page
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <Inner showHeader={false}>
      <section>
        <div className="min-h-screen flex items-center justify-center">
          <Login onLogin={handleLogin} />
        </div> 
      </section>
    </Inner>
  );
} 
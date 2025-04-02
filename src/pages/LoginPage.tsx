import { useLocation, useNavigate } from 'react-router-dom';
import Inner from '../components/Inner';
import { Login } from '../components/Login';

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
      setIsAuthenticated(true);
      
      // Redirect to the page the user tried to visit, or home page
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <section>
      <Inner>
        <div className="min-h-screen flex items-center justify-center">
          <Login onLogin={handleLogin} />
        </div>
      </Inner>
    </section>
  );
} 
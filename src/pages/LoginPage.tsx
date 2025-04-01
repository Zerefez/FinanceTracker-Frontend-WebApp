import { useNavigate } from 'react-router-dom';
import Inner from '../components/Inner';
import { Login } from '../components/Login';

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      // TODO: Implement actual login logic here
      // For now, we'll just simulate a successful login
      console.log('Logging in with:', email);
      
      // After successful login, redirect to home page
      navigate('/');
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
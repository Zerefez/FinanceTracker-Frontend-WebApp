import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Inner from '../components/Inner';
import { Register } from '../components/Register';
import { authService } from '../services/authService';

export function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      // Call the auth service to register the user
      const response = await authService.register(email, password);
      
      if (response.success) {
        // Registration successful, navigate to login
        navigate('/login', { 
          replace: true,
          state: { 
            message: 'Registration successful! Please login with your new account.',
            email
          }
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/login', { replace: false });
  };

  return (
    <Inner showHeader={false}>
      <section>
        <div className="min-h-screen flex items-center justify-center">
          <Register
            onRegister={handleRegister}
            isLoading={isLoading}
            errorMessage={errorMessage}
            onLogin={handleLogin}
          />
        </div>
      </section>
    </Inner>
  );
} 
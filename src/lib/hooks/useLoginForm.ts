import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useNavigation } from './useNavigation';

/**
 * Hook for managing login form state and login process
 */
export function useLoginForm(initialEmail = '') {
  const [username, setUsername] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const { login } = useAuth();
  const { location, navigateAfterLogin } = useNavigation();
  
  // Update username if initialEmail changes
  useEffect(() => {
    if (initialEmail) {
      setUsername(initialEmail);
    }
  }, [initialEmail]);
  
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      const response = await login(username, password);
      
      if (response.success) {
        setSuccessMessage('Login successful');
        navigateAfterLogin(location);
      } else {
        throw new Error('Login failed');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setErrorMessage(message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setUsername(initialEmail);
    setPassword('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };
  
  return {
    username,
    setUsername,
    password,
    setPassword,
    isLoading,
    errorMessage,
    successMessage,
    handleLogin,
    resetForm
  };
} 
interface User {
  id: string;
  email: string;
  name?: string;
}

interface LoginResponse {
  token: string;
  success: boolean;
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

// API URL - Use relative URL to leverage the Vite proxy
const API_URL = '/api';

// Security constants
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes (if token expires in 15 mins)

// Common fetch helper function to reduce redundancy
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}, parseAsJson = false): Promise<any> => {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Default headers for all requests
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };
  
  const requestOptions = {
    ...options,
    headers
  };
  
  const response = await fetch(url, requestOptions);
  
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Request failed';
    
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch (e) {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }
  
  // Parse response based on content type or requested format
  return parseAsJson ? response.json() : response.text();
};

// Helper function to parse user data from JWT token
const parseUserFromToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.nameid || '',
      email: payload.name || '',
    };
  } catch (e) {
    console.error('Failed to parse token', e);
    return null;
  }
};

export const authService = {
  // Login with username and password
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const token = await fetchWithAuth('/Account', {
        method: 'POST',
        body: JSON.stringify({ Username: username, Password: password })
      });
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Parse and store user data
      const userData = parseUserFromToken(token);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return { token, success: true };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Register a new user
  register: async (email: string, password: string): Promise<RegisterResponse> => {
    try {
      const message = await fetchWithAuth('/Account/register', {
        method: 'POST',
        body: JSON.stringify({ Email: email, Password: password })
      });
      
      return { success: true, message };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // Validate if user exists
  validateUser: async (email: string): Promise<boolean> => {
    try {
      const data = await fetchWithAuth('/Account/validate', {
        method: 'POST',
        body: JSON.stringify({ Email: email })
      }, true);
      
      return data.success === true;
    } catch (error) {
      console.error('User validation failed:', error);
      return false;
    }
  },

  // Logout - clear local storage
  logout: (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      
      if (Date.now() >= expiry) {
        // Token expired, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  // Get the authentication token
  getToken: (): string | null => localStorage.getItem('token')
}; 
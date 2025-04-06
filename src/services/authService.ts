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

export const authService = {
  // Login with username and password - validates user against database
  login: async (username: string, password: string): Promise<LoginResponse> => {
    console.log('Sending login request with:', { Username: username, Password: password });
    
    const response = await fetch(`${API_URL}/Account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        // Match the C# model property names exactly
        Username: username, 
        Password: password 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = 'Login failed';
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        console.error('Error parsing error response:', e);
        errorMessage = errorText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }

    const token = await response.text();
    console.log('Received token:', token.substring(0, 20) + '...');
    
    // Store token in localStorage
    localStorage.setItem('token', token);

    // Parse user from token (JWT)
    const userData = parseUserFromToken(token);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    }

    return {
      token,
      success: true
    };
  },

  // Register a new user
  register: async (email: string, password: string): Promise<RegisterResponse> => {
    try {
      const response = await fetch(`${API_URL}/Account/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          Email: email, 
          Password: password 
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Registration failed';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const message = await response.text();
      return {
        success: true,
        message
      };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // Validates if user exists in database with given credentials
  validateUser: async (email: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/Account/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ Email: email })
      });

      if (response.ok) {
        const data = await response.json();
        return data.success === true;
      }
      return false;
    } catch (error) {
      console.error('User validation failed:', error);
      return false;
    }
  },

  // Logout - clears local storage
  logout: async (): Promise<void> => {
    try {
      // No server-side logout needed as we're using JWT
      // Just clear local storage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error('Failed to parse user data', e);
        localStorage.removeItem('user');
      }
    }
    return null;
  },

  // Check if user is authenticated based on presence of token
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Check if token is expired
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
    } catch (e) {
      console.error('Failed to parse token', e);
      return false;
    }
  },

  // Get the authentication token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
};

// Helper function to parse user data from JWT token
function parseUserFromToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.nameid || '',
      email: payload.name || '', // Using 'name' claim which contains the username (email in this case)
    };
  } catch (e) {
    console.error('Failed to parse token', e);
    return null;
  }
} 
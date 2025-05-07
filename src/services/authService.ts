import { apiService } from './apiService';

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

// Security constants
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes (if token expires in 15 mins)
const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

// Helper function to parse user data from JWT token
const parseUserFromToken = (token: string): User | null => {
  try {
    console.log("Parsing token to extract user data");
    const payload = JSON.parse(atob(token.split(".")[1]));
    console.log("JWT payload:", payload);

    // Extract data based on the ClaimTypes used in the backend
    return {
      id:
        payload.nameid ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        "",
      email:
        payload.email ||
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
        "",
      name:
        payload.name || payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "",
    };
  } catch (e) {
    console.error("Failed to parse token", e);
    return null;
  }
};

export const authService = {
  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Login with username and password
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      console.log("Attempting login for user:", username);

      // Use apiService with skipAuth option since this is a login endpoint
      const token = await apiService.request<string>('/Accounts/login', {
        method: 'POST',
        body: { username, password },
        skipAuth: true,
        parseAsJson: false
      });

      console.log("Received token length:", token ? token.length : 0);
      console.log("Received token preview:", token ? `${token.substring(0, 15)}...` : "No token");

      if (!token || typeof token !== "string" || token.trim() === "") {
        throw new Error("Invalid token received from server");
      }

      // Store token in localStorage with consistent key
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      console.log("Token stored in localStorage");

      // Parse and store user data
      const userData = parseUserFromToken(token);
      if (userData) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
        console.log("User data successfully parsed from token:", userData);
      } else {
        console.error("Failed to parse user data from token");
      }

      console.log("Login successful, token stored");
      return { token, success: true };
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  // Register a new user
  register: async (
    email: string,
    password: string,
    fullName: string,
  ): Promise<RegisterResponse> => {
    // Basic validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    try {
      const message = await apiService.post<string>('/Accounts/register', {
        Email: email,
        Password: password,
        FullName: fullName,
      }, { skipAuth: true, parseAsJson: false });

      return { success: true, message };
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  // Validate if user exists
  validateUser: async (email: string): Promise<boolean> => {
    try {
      const data = await apiService.post<{ success: boolean }>('/Account/validate', { Email: email });
      return data.success === true;
    } catch (error) {
      console.error("User validation failed:", error);
      return false;
    }
  },

  // Logout - clear local storage
  logout: (): void => {
    console.log("Logging out user, clearing auth data");
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(USER_DATA_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      localStorage.removeItem(USER_DATA_KEY);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      console.log("No auth token found");
      return false;
    }

    try {
      // Check if token is a valid JWT
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("Invalid token format");
        return false;
      }

      // Parse the payload
      const payload = JSON.parse(atob(parts[1]));

      // Check for expiration
      if (!payload.exp) {
        console.log("Token has no expiration, considering valid");
        return true;
      }

      const expiry = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();

      console.log(`Token expiry check: Now=${now}, Expires=${expiry}, Diff=${expiry - now}ms`);

      if (now >= expiry) {
        // Token expired, clear it
        console.log("Token expired, clearing auth data");
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error parsing token:", error);
      // Don't clear token on parsing error - it might be temporarily invalid
      return false;
    }
  },
};

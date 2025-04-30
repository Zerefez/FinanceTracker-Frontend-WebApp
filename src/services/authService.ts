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
const API_URL = "/api";

// Security constants
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes (if token expires in 15 mins)
const AUTH_TOKEN_KEY = "auth_token";
const USER_DATA_KEY = "user_data";

// Common fetch helper function to reduce redundancy
const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {},
  parseAsJson = false,
): Promise<any> => {
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Default headers for all requests
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers || {}),
  };

  const requestOptions = {
    ...options,
    headers,
  };

  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = "Request failed";

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
  // Login with username and password
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      console.log("Attempting login for user:", username);

      // Try using the API URL with proxy first
      const url = `${API_URL}/Account/login`;
      console.log(`Making login request to: ${url}`);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        credentials: "include", // Include cookies if server uses them
        body: JSON.stringify({ username, password }),
      });

      console.log("Login response status:", response.status);
      console.log("Login response headers:", [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login failed with status:", response.status, errorText);
        throw new Error(errorText || "Login failed");
      }

      // Get the raw token string
      const token = await response.text();

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
    hourlyRate: string,
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
      const message = await fetchWithAuth("/Account/register", {
        method: "POST",
        body: JSON.stringify({
          Email: email,
          Password: password,
          HourlyRate: hourlyRate || null, // Send null if hourlyRate is empty
          FullName: fullName,
        }),
      });

      return { success: true, message };
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  },

  // Validate if user exists
  validateUser: async (email: string): Promise<boolean> => {
    try {
      const data = await fetchWithAuth(
        "/Account/validate",
        {
          method: "POST",
          body: JSON.stringify({ Email: email }),
        },
        true,
      );

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

  // Get the authentication token
  getToken: (): string | null => localStorage.getItem(AUTH_TOKEN_KEY),
};

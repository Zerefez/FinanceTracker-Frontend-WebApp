import { authService } from './authService';

// API URL - Use relative URL to leverage the Vite proxy
const API_URL = '/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

export const apiService = {
  /**
   * Make an authenticated API request
   * @param endpoint The API endpoint to call (without the base URL)
   * @param options Request options
   * @returns Promise with the response data
   */
  request: async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const {
      method = 'GET',
      body,
      headers = {},
      skipAuth = false
    } = options;

    // Prepare the request URL
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    };
    
    // Add authorization header if not skipping auth
    if (!skipAuth) {
      const token = authService.getToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      } else {
        // Token is missing but required - reject
        return Promise.reject(new Error('Authentication required'));
      }
    }
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders
    };
    
    // Add body if provided
    if (body) {
      requestOptions.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, requestOptions);
    
    // Handle unauthorized response - could trigger logout
    if (response.status === 401) {
      // Unauthorized - clear auth state
      await authService.logout();
      // Optionally redirect to login page
      window.location.href = '/login';
      return Promise.reject(new Error('Session expired or unauthorized'));
    }
    
    // Handle successful response
    if (response.ok) {
      // Check content type to determine how to parse the response
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        // For non-JSON responses (like plain text)
        const text = await response.text();
        try {
          // Try to parse as JSON anyway
          return JSON.parse(text) as T;
        } catch {
          // If not JSON, return as is
          return text as unknown as T;
        }
      }
    }
    
    // Handle error responses
    const errorText = await response.text();
    let errorData;
    
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = { message: errorText };
    }
    
    throw new Error(errorData.detail || errorData.message || 'Request failed');
  },
  
  // Convenience methods
  get: <T>(endpoint: string, options: Omit<ApiOptions, 'method' | 'body'> = {}) => {
    return apiService.request<T>(endpoint, { ...options, method: 'GET' });
  },
  
  post: <T>(endpoint: string, body: any, options: Omit<ApiOptions, 'method'> = {}) => {
    return apiService.request<T>(endpoint, { ...options, method: 'POST', body });
  },
  
  put: <T>(endpoint: string, body: any, options: Omit<ApiOptions, 'method'> = {}) => {
    return apiService.request<T>(endpoint, { ...options, method: 'PUT', body });
  },
  
  delete: <T>(endpoint: string, options: Omit<ApiOptions, 'method'> = {}) => {
    return apiService.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}; 
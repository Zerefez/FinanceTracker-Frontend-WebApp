import { logger } from '../services/logger';
import { authService } from './authService';

// API URL - Use relative URL to leverage the Vite proxy
// This should match the proxy setup in your Vite config
const API_URL = '';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  parseAsJson?: boolean;
}

export const apiService = {
  /**
   * Make an authenticated API request
   */
  request: async <T>(endpoint: string, options: ApiOptions = {}): Promise<T> => {
    const {
      method = 'GET',
      body,
      headers = {},
      skipAuth = false,
      parseAsJson = true
    } = options;

    // For login/register endpoints, we shouldn't try to attach Authorization header
    const isAuthEndpoint = 
      endpoint.includes('/Account/login') || 
      endpoint.includes('/Account/register');

    // Build URL
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    
    // Setup headers with auth token
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    };
    
    if (!skipAuth && !isAuthEndpoint) {
      const token = authService.getToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
        console.log(`Added auth token to request for ${endpoint}`);
      } else {
        console.error('Authentication required but no token found');
        
        // Only reject if not on auth pages
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/register')) {
          return Promise.reject(new Error('Authentication required'));
        }
      }
    }
    
    // Build request
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined
    };
    
    // Execute request
    try {
      console.log(`Making ${method} request to ${url}`);
      const response = await fetch(url, requestOptions);
      console.log(`Response status: ${response.status} for ${url}`);
      
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.error('Received 401 Unauthorized response');
        // Only log out if we're not already on login/logout/register page
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/logout') &&
            !window.location.pathname.includes('/register')) {
          console.log('Unauthorized access, logging out');
          authService.logout();
          window.location.href = `/login?t=${Date.now()}&error=session_expired`;
          return Promise.reject(new Error('Session expired'));
        }
      }
      
      // Handle other errors
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Request failed';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse response
      if (parseAsJson) {
        try {
          const jsonData = await response.json();
          return jsonData;
        } catch (error) {
          console.log('Response is not valid JSON, returning as-is');
          // Return raw text if it can't be parsed as JSON
          return response.text() as unknown as T;
        }
      } else {
        return await response.text() as unknown as T;
      }
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw error;
    }
  },
  
  // Convenience methods
  get: <T>(endpoint: string, options: Omit<ApiOptions, 'method' | 'body'> = {}) => 
    apiService.request<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body: any, options: Omit<ApiOptions, 'method'> = {}) => 
    apiService.request<T>(endpoint, { ...options, method: 'POST', body }),
  
  put: <T>(endpoint: string, body: any, options: Omit<ApiOptions, 'method'> = {}) => 
    apiService.request<T>(endpoint, { ...options, method: 'PUT', body }),
  
  delete: <T>(endpoint: string, options: Omit<ApiOptions, 'method'> = {}) => 
    apiService.request<T>(endpoint, { ...options, method: 'DELETE' })
};

// Configure the logger
logger.configure({
  minLevel: 'info', // Only show info and above in production
  includeTimestamp: true,
  includeStacktrace: true,
  performanceTracking: true
});

// Basic logging
logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');

// With additional data
logger.info('User action', { userId: '123', action: 'login' });

// Track performance of a function or operation
logger.startPerformanceMark('fetchData');
try {
  const data = await fetchData();
  logger.endPerformanceMark('fetchData');
} catch (error) {
  logger.error('Failed to fetch data', error);
}

async function fetchData() {
  logger.logApiRequest('GET', '');
  try {
    const response = await fetch('');
    const data = await response.json();
    logger.logApiResponse('GET', '', response.status, data);
    return data;
  } catch (error) {
    logger.logApiError('GET', '', error);
    throw error;
  }
} 
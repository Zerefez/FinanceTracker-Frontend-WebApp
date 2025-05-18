import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiService } from '../../services/apiService';
import { authService } from '../../services/authService';

// Mock apiService
vi.mock('../../services/apiService', () => ({
  apiService: {
    request: vi.fn(),
    post: vi.fn(),
  },
}));

describe('authService', () => {
  // Create a properly formatted JWT token with a valid payload
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
  };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('getToken', () => {
    it('should return null when no token exists', () => {
      expect(authService.getToken()).toBeNull();
    });

    it('should return token from localStorage', () => {
      localStorage.setItem('auth_token', mockToken);
      expect(authService.getToken()).toBe(mockToken);
    });
  });

  describe('login', () => {
    it('should successfully login and store token', async () => {
      vi.mocked(apiService.request).mockResolvedValueOnce(mockToken);

      const result = await authService.login('test@example.com', 'password');
      
      expect(result.success).toBe(true);
      expect(result.token).toBe(mockToken);
      expect(localStorage.getItem('auth_token')).toBe(mockToken);
      expect(apiService.request).toHaveBeenCalledWith('/Accounts/login', {
        method: 'POST',
        body: { username: 'test@example.com', password: 'password' },
        skipAuth: true,
        parseAsJson: false,
      });
    });

    it('should throw error on invalid token response', async () => {
      vi.mocked(apiService.request).mockResolvedValueOnce('');

      await expect(authService.login('test@example.com', 'password'))
        .rejects
        .toThrow('Invalid token received from server');
    });

    it('should throw error on API failure', async () => {
      vi.mocked(apiService.request).mockRejectedValueOnce(new Error('API Error'));

      await expect(authService.login('test@example.com', 'password'))
        .rejects
        .toThrow('API Error');
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const successMessage = 'Registration successful';
      vi.mocked(apiService.post).mockResolvedValueOnce(successMessage);

      const result = await authService.register('test@example.com', 'password123', 'Test User');
      
      expect(result.success).toBe(true);
      expect(result.message).toBe(successMessage);
      expect(apiService.post).toHaveBeenCalledWith(
        '/Accounts/register',
        {
          Email: 'test@example.com',
          Password: 'password123',
          FullName: 'Test User',
        },
        { skipAuth: true, parseAsJson: false }
      );
    });

    it('should throw error when email is missing', async () => {
      await expect(authService.register('', 'password123', 'Test User'))
        .rejects
        .toThrow('Email and password are required');
    });

    it('should throw error when password is too short', async () => {
      await expect(authService.register('test@example.com', '12345', 'Test User'))
        .rejects
        .toThrow('Password must be at least 6 characters long');
    });

    it('should throw error on API failure', async () => {
      vi.mocked(apiService.post).mockRejectedValueOnce(new Error('API Error'));

      await expect(authService.register('test@example.com', 'password123', 'Test User'))
        .rejects
        .toThrow('API Error');
    });
  });

  describe('validateUser', () => {
    it('should return true for valid user', async () => {
      vi.mocked(apiService.post).mockResolvedValueOnce({ success: true });

      const result = await authService.validateUser('test@example.com');
      expect(result).toBe(true);
      expect(apiService.post).toHaveBeenCalledWith('/Account/validate', { Email: 'test@example.com' });
    });

    it('should return false for invalid user', async () => {
      vi.mocked(apiService.post).mockResolvedValueOnce({ success: false });

      const result = await authService.validateUser('test@example.com');
      expect(result).toBe(false);
    });

    it('should return false on API error', async () => {
      vi.mocked(apiService.post).mockRejectedValueOnce(new Error('API Error'));

      const result = await authService.validateUser('test@example.com');
      expect(result).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear auth data from localStorage', () => {
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(mockUser));

      authService.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user_data')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no user data exists', () => {
      expect(authService.getCurrentUser()).toBeNull();
    });

    it('should return user data from localStorage', () => {
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      expect(authService.getCurrentUser()).toEqual(mockUser);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorage.setItem('user_data', 'invalid-json');
      expect(authService.getCurrentUser()).toBeNull();
      expect(localStorage.getItem('user_data')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return false for invalid token format', () => {
      localStorage.setItem('auth_token', 'invalid-token');
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should return true for valid token', () => {
      localStorage.setItem('auth_token', mockToken);
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false for expired token', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      localStorage.setItem('auth_token', expiredToken);
      expect(authService.isAuthenticated()).toBe(false);
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should handle token parsing error', () => {
      localStorage.setItem('auth_token', 'invalid.base64.token');
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
}); 
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '../../lib/hooks/useAuth';
import { AUTH_EVENTS, authUtils } from '../../lib/utils';
import { authService } from '../../services/authService';

// Mock dependencies
vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

vi.mock('../../lib/utils', () => ({
  AUTH_EVENTS: {
    LOGIN: 'auth:login',
    LOGOUT: 'auth:logout',
  },
  authUtils: {
    isAuthenticated: vi.fn(),
    loginSuccess: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock initial auth state
    vi.mocked(authUtils.isAuthenticated).mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isInitializing).toBe(false);
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('should check authentication on mount', () => {
    renderHook(() => useAuth());
    
    expect(authUtils.isAuthenticated).toHaveBeenCalled();
  });

  it('should handle login event', () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      window.dispatchEvent(new Event(AUTH_EVENTS.LOGIN));
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle logout event', () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      window.dispatchEvent(new Event(AUTH_EVENTS.LOGOUT));
    });
    
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle storage changes', () => {
    const { result } = renderHook(() => useAuth());
    
    // Mock auth state after storage change
    vi.mocked(authUtils.isAuthenticated).mockReturnValueOnce(true);
    
    act(() => {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'auth_token',
        newValue: 'new-token',
        oldValue: null,
        storageArea: localStorage,
      }));
    });
    
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle login action successfully', async () => {
    const { result } = renderHook(() => useAuth());
    const mockResponse = { success: true, token: 'mock-token' };
    
    vi.mocked(authService.login).mockResolvedValueOnce(mockResponse);
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(authUtils.loginSuccess).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle login action failure', async () => {
    const { result } = renderHook(() => useAuth());
    const mockError = new Error('Login failed');
    
    vi.mocked(authService.login).mockRejectedValueOnce(mockError);
    
    await expect(
      act(async () => {
        await result.current.login('test@example.com', 'password');
      })
    ).rejects.toThrow('Login failed');
    
    expect(authUtils.loginSuccess).not.toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should handle logout action', () => {
    const { result } = renderHook(() => useAuth());
    
    act(() => {
      result.current.logout();
    });
    
    expect(authUtils.logout).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should perform regular auth checks', () => {
    vi.useFakeTimers();
    renderHook(() => useAuth());
    
    // Initial check
    expect(authUtils.isAuthenticated).toHaveBeenCalledTimes(1);
    
    // Advance time by 5 minutes
    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000);
    });
    
    // Should have performed another check
    expect(authUtils.isAuthenticated).toHaveBeenCalledTimes(2);
  });

  it('should clean up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useAuth());
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith(AUTH_EVENTS.LOGIN, expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith(AUTH_EVENTS.LOGOUT, expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));
  });
}); 
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { authService } from "../services/authService";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const utils = {
  // ... any existing utilities
}

// Custom event for auth state changes
export const AUTH_EVENTS = {
  LOGOUT: 'auth:logout',
  LOGIN: 'auth:login'
};

// Authentication utilities
export const authUtils = {
  logout: async (): Promise<void> => {
    // Use auth service to handle logout
    await authService.logout();
    
    // Dispatch custom event for logout
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
  },
  
  // Async version for more secure verification
  isAuthenticated: async (): Promise<boolean> => {
    return await authService.isAuthenticated();
  },
  
  // Sync version for quick UI checks (less secure)
  isAuthenticatedSync: (): boolean => {
    return authService.isAuthenticated();
  }
}; 
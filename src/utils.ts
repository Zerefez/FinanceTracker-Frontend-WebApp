import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  logout: () => {
    localStorage.removeItem('authToken');
    
    // Dispatch custom event for logout
    window.dispatchEvent(new Event(AUTH_EVENTS.LOGOUT));
    
    // Redirect to login page
    window.location.href = '/login';
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  }
}; 
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
  logout: (): void => {
    authService.logout();
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGOUT));
  },
  
  loginSuccess: (): void => {
    window.dispatchEvent(new CustomEvent(AUTH_EVENTS.LOGIN));
  },
  
  isAuthenticated: (): boolean => {
    const isAuth = authService.isAuthenticated();
    console.log('isAuthenticated check from authUtils:', isAuth);
    return isAuth;
  }
}; 
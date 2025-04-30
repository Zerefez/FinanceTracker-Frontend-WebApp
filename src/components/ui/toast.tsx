import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

// Store for toasts
let toasts: Toast[] = [];
let listeners: ((toasts: Toast[]) => void)[] = [];

// Notify all listeners when toasts change
const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toasts]));
};

// Toast service
export const toastService = {
  // Show a toast notification
  show: (message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    toasts = [...toasts, { id, message, type }];
    notifyListeners();
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      toastService.remove(id);
    }, 5000);
    
    return id;
  },
  
  // Show success toast
  success: (message: string) => toastService.show(message, "success"),
  
  // Show error toast
  error: (message: string) => toastService.show(message, "error"),
  
  // Show info toast
  info: (message: string) => toastService.show(message, "info"),
  
  // Remove a toast by id
  remove: (id: string) => {
    toasts = toasts.filter(toast => toast.id !== id);
    notifyListeners();
  },
  
  // Subscribe to changes
  subscribe: (listener: (toasts: Toast[]) => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  }
};

// Toast container component
export function ToastContainer() {
  const [visibleToasts, setVisibleToasts] = useState<Toast[]>([]);
  
  useEffect(() => {
    // Subscribe to toast changes
    const unsubscribe = toastService.subscribe(setVisibleToasts);
    return unsubscribe;
  }, []);
  
  if (visibleToasts.length === 0) return null;
  
  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {visibleToasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-md px-4 py-3 shadow-lg flex items-center justify-between transform transition-all duration-300 ease-in-out ${
            toast.type === "success" 
              ? "bg-green-500 text-white" 
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => toastService.remove(toast.id)}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
} 
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";

export interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  type?: "warning" | "danger" | "info";
}

export function ConfirmationDialog({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isOpen,
  type = "warning"
}: ConfirmationDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onCancel]);

  if (!mounted || !isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return "bg-red-50 border-red-500";
      case "warning":
        return "bg-amber-50 border-amber-500";
      case "info":
      default:
        return "bg-blue-50 border-blue-500";
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700";
      case "info":
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
        <div className={`p-4 mb-4 border-l-4 rounded ${getTypeStyles()}`}>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="mt-2 text-sm">{message}</p>
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
          <Button
            className={getButtonStyles()}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// Store for sharing dialog state
type ConfirmOptions = Omit<ConfirmationDialogProps, "isOpen" | "onConfirm" | "onCancel">;
type ConfirmationCallback = (confirmed: boolean) => void;

let currentConfirmation: { 
  options: ConfirmOptions; 
  callback: ConfirmationCallback;
} | null = null;
let setDialogStateCallback: ((state: { isOpen: boolean; options: ConfirmOptions }) => void) | null = null;

// Dialog service
export const confirmationDialogService = {
  confirm: (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const callback = (confirmed: boolean) => resolve(confirmed);
      
      currentConfirmation = { 
        options, 
        callback 
      };
      
      if (setDialogStateCallback) {
        setDialogStateCallback({
          isOpen: true,
          options
        });
      }
    });
  },
  
  handleConfirm: () => {
    if (currentConfirmation) {
      currentConfirmation.callback(true);
      currentConfirmation = null;
    }
    
    if (setDialogStateCallback) {
      setDialogStateCallback({
        isOpen: false,
        options: {
          title: "",
          message: ""
        }
      });
    }
  },
  
  handleCancel: () => {
    if (currentConfirmation) {
      currentConfirmation.callback(false);
      currentConfirmation = null;
    }
    
    if (setDialogStateCallback) {
      setDialogStateCallback({
        isOpen: false,
        options: {
          title: "",
          message: ""
        }
      });
    }
  },
  
  setDialogState: (callback: typeof setDialogStateCallback) => {
    setDialogStateCallback = callback;
  }
};

// Container component to use in App
export function ConfirmationDialogContainer() {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
  }>({
    isOpen: false,
    options: {
      title: "",
      message: ""
    }
  });
  
  useEffect(() => {
    confirmationDialogService.setDialogState(setDialogState);
    return () => confirmationDialogService.setDialogState(null);
  }, []);
  
  return (
    <ConfirmationDialog
      {...dialogState.options}
      isOpen={dialogState.isOpen}
      onConfirm={confirmationDialogService.handleConfirm}
      onCancel={confirmationDialogService.handleCancel}
    />
  );
} 
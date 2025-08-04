import { useCallback, useState } from "react";
import { ToastProps } from "./toast";

export const useToast = () => {
  const [toast, setToast] = useState<ToastProps | null>(null);

  const showToast = useCallback((props: ToastProps) => {
    setToast(props);
    
    // Automatically dismiss after 3 seconds
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  const dismiss = useCallback(() => {
    setToast(null);
  }, []);

  return {
    toast,
    showToast,
    dismiss
  };
};

export const toast = {
  success: (description: string) => console.log('Success:', description),
  error: (description: string) => console.error('Error:', description)
};
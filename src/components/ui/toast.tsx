import * as React from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
}

const toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = "default",
}) => {
  const variantClasses = {
    default: "bg-white text-black",
    success: "bg-green-500 text-white",
    destructive: "bg-red-500 text-white",
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 min-w-[300px]",
        variantClasses[variant]
      )}
    >
      {title && <div className="font-bold">{title}</div>}
      {description && <div className="text-sm">{description}</div>}
    </div>
  );
};

export { toast };

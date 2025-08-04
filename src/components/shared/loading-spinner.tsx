import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  message?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "minimal" | "card";
  fullPage?: boolean;
}

export function LoadingSpinner({ 
  className, 
  message, 
  size = "md",
  variant = "default",
  fullPage = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  const messageSizeClasses = {
    xs: "text-xs",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  const containerClass = cn(
    "flex items-center justify-center",
    variant === "default" && "flex-col space-y-3",
    variant === "minimal" && "flex-row space-x-2",
    variant === "card" && "flex-col space-y-4 p-8 rounded-lg border border-border/10 bg-card",
    fullPage && "min-h-screen",
    !fullPage && variant === "default" && "py-8"
  );

  const spinnerClass = cn(
    "animate-spin text-primary transition-all duration-200",
    sizeClasses[size],
    className
  );

  const messageClass = cn(
    "text-muted-foreground font-medium",
    messageSizeClasses[size],
    variant === "minimal" && "ml-2"
  );

  if (variant === "minimal") {
    return (
      <div className={containerClass}>
        <Loader2 className={spinnerClass} />
        {message && <span className={messageClass}>{message}</span>}
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="relative">
        <Loader2 className={spinnerClass} />
        {variant === "card" && (
          <div className="absolute inset-0 animate-pulse">
            <div className="h-full w-full rounded-full bg-primary/10" />
          </div>
        )}
      </div>
      
      {message && (
        <div className="text-center">
          <p className={messageClass}>{message}</p>
          {variant === "card" && (
            <p className="text-xs text-muted-foreground/70 mt-1">
              Please wait while we load your data
            </p>
          )}
        </div>
      )}
      
      {variant === "card" && (
        <div className="flex space-x-1">
          <div className="h-2 w-2 rounded-full bg-primary/30 animate-bounce" />
          <div className="h-2 w-2 rounded-full bg-primary/30 animate-bounce delay-75" />
          <div className="h-2 w-2 rounded-full bg-primary/30 animate-bounce delay-150" />
        </div>
      )}
    </div>
  );
}

// Skeleton Loading Component for table rows
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 p-4">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="flex-1">
          <div className="h-4 bg-muted rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// Card Loading Skeleton
export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-border/10 p-6 space-y-4">
      <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded animate-pulse" />
        <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
      </div>
    </div>
  );
}
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Plus, 
  FileText, 
  Users, 
  Store, 
  ShoppingCart,
  AlertCircle,
  RefreshCw 
} from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  variant?: "default" | "card" | "minimal";
  size?: "sm" | "md" | "lg";
}

// Pre-defined empty state configurations
export const EmptyStatePresets = {
  noData: {
    icon: <FileText className="h-12 w-12 text-muted-foreground/50" />,
    title: "No data available",
    description: "There's no data to display at the moment. Try refreshing or adding some content.",
  },
  noUsers: {
    icon: <Users className="h-12 w-12 text-muted-foreground/50" />,
    title: "No users found",
    description: "No users match your current filters. Try adjusting your search criteria or add a new user.",
    actionLabel: "Add User",
  },
  noStores: {
    icon: <Store className="h-12 w-12 text-muted-foreground/50" />,
    title: "No stores found",
    description: "There are no pharmacy stores in the system yet. Get started by adding your first store.",
    actionLabel: "Add Store",
  },
  noOrders: {
    icon: <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />,
    title: "No orders found",
    description: "No orders match your current criteria. Try adjusting your filters or date range.",
  },
  searchEmpty: {
    icon: <Search className="h-12 w-12 text-muted-foreground/50" />,
    title: "No results found",
    description: "We couldn't find anything matching your search. Try different keywords or clear your filters.",
    secondaryActionLabel: "Clear Filters",
  },
  error: {
    icon: <AlertCircle className="h-12 w-12 text-destructive/50" />,
    title: "Something went wrong",
    description: "We encountered an error while loading your data. Please try again.",
    actionLabel: "Try Again",
  },
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
  variant = "default",
  size = "md"
}: EmptyStateProps) {
  const sizeClasses = {
    sm: "p-6 space-y-3",
    md: "p-8 space-y-4",
    lg: "p-12 space-y-6"
  };

  const titleSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  const iconSizeClasses = {
    sm: "mb-3",
    md: "mb-4", 
    lg: "mb-6"
  };

  const content = (
    <div className={cn("flex flex-col items-center justify-center text-center", sizeClasses[size])}>
      {icon && (
        <div className={cn("flex items-center justify-center", iconSizeClasses[size])}>
          <div className="rounded-full bg-muted/30 p-4">
            {icon}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className={cn("font-semibold text-foreground", titleSizeClasses[size])}>
          {title}
        </h3>
        
        {description && (
          <p className="text-muted-foreground text-sm max-w-md leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {actionLabel && onAction && (
            <Button onClick={onAction} size={size === "sm" ? "sm" : "default"}>
              <Plus className="mr-2 h-4 w-4" />
              {actionLabel}
            </Button>
          )}
          
          {secondaryActionLabel && onSecondaryAction && (
            <Button 
              variant="outline" 
              onClick={onSecondaryAction}
              size={size === "sm" ? "sm" : "default"}
            >
              {secondaryActionLabel.includes("Refresh") ? (
                <RefreshCw className="mr-2 h-4 w-4" />
              ) : null}
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  if (variant === "card") {
    return (
      <Card className={cn("border-dashed border-2 border-border/50", className)}>
        {content}
      </Card>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("py-4", className)}>
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          {icon && <div className="mb-2">{icon}</div>}
          <p className="text-sm text-muted-foreground">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground/70">{description}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-[400px] flex items-center justify-center", className)}>
      {content}
    </div>
  );
}

// Convenience components for common use cases
export function NoUsersEmpty({ onAddUser }: { onAddUser?: () => void }) {
  return (
    <EmptyState
      {...EmptyStatePresets.noUsers}
      onAction={onAddUser}
      actionLabel={onAddUser ? "Add User" : undefined}
    />
  );
}

export function NoStoresEmpty({ onAddStore }: { onAddStore?: () => void }) {
  return (
    <EmptyState
      {...EmptyStatePresets.noStores}
      onAction={onAddStore}
      actionLabel={onAddStore ? "Add Store" : undefined}
    />
  );
}

export function SearchEmpty({ onClearFilters }: { onClearFilters?: () => void }) {
  return (
    <EmptyState
      {...EmptyStatePresets.searchEmpty}
      onSecondaryAction={onClearFilters}
      variant="minimal"
      size="sm"
    />
  );
}
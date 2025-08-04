import React from "react";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  showBackButton?: boolean;
  onBack?: () => void;
  size?: "sm" | "md" | "lg";
}

export function PageHeader({ 
  title, 
  description, 
  className, 
  actions,
  breadcrumbs,
  showBackButton = false,
  onBack,
  size = "md"
}: PageHeaderProps) {
  const sizeClasses = {
    sm: {
      title: "text-xl",
      description: "text-sm",
      spacing: "mb-4"
    },
    md: {
      title: "text-2xl",
      description: "text-sm",
      spacing: "mb-6"
    },
    lg: {
      title: "text-3xl",
      description: "text-base",
      spacing: "mb-8"
    }
  };

  return (
    <div className={cn("space-y-4", sizeClasses[size].spacing, className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage className="font-medium">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink 
                      href={crumb.href} 
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Header Content */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <button
                onClick={onBack}
                className="flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-accent transition-colors"
                aria-label="Go back"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </button>
            )}
            
            <h1 className={cn(
              "font-bold tracking-tight text-foreground",
              sizeClasses[size].title
            )}>
              {title}
            </h1>
          </div>
          
          {description && (
            <p className={cn(
              "text-muted-foreground leading-relaxed max-w-2xl",
              sizeClasses[size].description
            )}>
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

// Convenience wrapper for common page patterns
export function DashboardPageHeader({
  title,
  description,
  children,
  ...props
}: Omit<PageHeaderProps, 'actions'> & { children?: React.ReactNode }) {
  return (
    <PageHeader
      title={title}
      description={description}
      actions={children}
      {...props}
    />
  );
}

// For detail pages that commonly have back navigation
export function DetailPageHeader({
  title,
  description,
  parentLabel,
  parentHref,
  onBack,
  children,
  ...props
}: Omit<PageHeaderProps, 'breadcrumbs' | 'showBackButton' | 'actions'> & {
  parentLabel?: string;
  parentHref?: string;
  children?: React.ReactNode;
}) {
  const breadcrumbs: BreadcrumbItem[] = [];
  
  if (parentLabel) {
    breadcrumbs.push({
      label: parentLabel,
      href: parentHref
    });
  }
  
  breadcrumbs.push({ label: title });

  return (
    <PageHeader
      title={title}
      description={description}
      breadcrumbs={breadcrumbs}
      showBackButton={!!onBack}
      onBack={onBack}
      actions={children}
      {...props}
    />
  );
}
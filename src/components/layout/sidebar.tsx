"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Truck,
  RefreshCw,
  BarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthUser } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface MenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  description?: string;
}

const SUPERADMIN_MENU_ITEMS: MenuItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    href: "/users",
    label: "Users",
    icon: Users,
    description: "Manage user accounts",
  },
  // {
  //   href: "/stores",
  //   label: "Stores",
  //   icon: Store,
  //   badge: "12",
  //   description: "Pharmacy store management",
  // },
  {
    href: "/orders",
    label: "Orders",
    icon: ShoppingCart,
    description: "Order processing",
  },
  {
    href: "/delivery",
    label: "Delivery",
    icon: Truck,
    description: "Delivery management",
  },
  {
    href: "/refunds",
    label: "Refunds",
    icon: RefreshCw,
    description: "Refund processing",
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart,
    description: "Reports and insights",
  },
];

const STORE_VENDOR_MENU_ITEMS: MenuItem[] = [
  {
    href: "/orders",
    label: "Orders",
    icon: ShoppingCart,
    description: "Your store orders",
  },
  {
    href: "/delivery",
    label: "Delivery Personnel",
    icon: Truck,
    description: "Manage your store's delivery team",
  },
  // Temporarily hidden
  // {
  //   href: "/stores",
  //   label: "My Store",
  //   icon: Store,
  //   description: "Store settings",
  // },
];

const DELIVERY_PERSONNEL_MENU_ITEMS: MenuItem[] = [
  {
    href: "/delivery",
    label: "Deliveries",
    icon: Truck,
    description: "Your delivery tasks",
  },
  {
    href: "/orders",
    label: "Orders",
    icon: ShoppingCart,
    description: "Order details",
  },
];

interface SidebarProps {
  user: AuthUser | null;
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({
  user,
  isCollapsed = false,
  onCollapse,
}: SidebarProps) {
  const pathname = usePathname();

  const getMenuItems = (): MenuItem[] => {
    switch (user?.role) {
      case "SUPERADMIN":
        return SUPERADMIN_MENU_ITEMS;
      case "STORE_VENDOR":
        return STORE_VENDOR_MENU_ITEMS;
      case "DELIVERY_PERSONNEL":
        return DELIVERY_PERSONNEL_MENU_ITEMS;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const toggleCollapse = () => {
    onCollapse?.(!isCollapsed);
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-background border-r border-border transition-all duration-300 ease-in-out h-full",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/10">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                M
              </span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">Mplus Admin</h1>
              <p className="text-xs text-muted-foreground">Pharmacy Portal</p>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary mx-auto">
            <span className="text-sm font-bold text-primary-foreground">
              M+
            </span>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="ml-auto p-1.5"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* User Role Badge */}
      {!isCollapsed && user && (
        <div className="px-4 py-2">
          <Badge variant="secondary" className="text-xs">
            {user.role.replace("_", " ").toLowerCase()}
          </Badge>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring",
                isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn("h-4 w-4 shrink-0", isActive && "text-primary")}
              />

              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-2 text-xs px-1.5 py-0.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t border-border/10 p-4">
          <div className="text-xs text-muted-foreground text-center">
            <p>© 2024 M+ Pharmacy</p>
            <p className="mt-1">Admin Portal v1.0</p>
          </div>
        </div>
      )}
    </aside>
  );
}

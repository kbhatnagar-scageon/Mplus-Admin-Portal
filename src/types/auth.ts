export type UserRole = 
  | "SUPERADMIN" 
  | "STORE_VENDOR" 
  | "DELIVERY_PERSONNEL";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  token: string;
  lastLogin?: string;
  storeId?: string; // For STORE_VENDOR users
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPERADMIN: [
    "users:read", "users:write", 
    "stores:read", "stores:write", 
    "orders:read", "orders:write",
    "delivery:read", "delivery:write",
    "refunds:read", "refunds:write",
    "analytics:read"
  ],
  STORE_VENDOR: [
    "orders:read", "orders:write",
    "stores:read", 
    "delivery:read", "delivery:write"
  ],
  DELIVERY_PERSONNEL: [
    "delivery:read", 
    "delivery:write", 
    "orders:read"
  ]
};
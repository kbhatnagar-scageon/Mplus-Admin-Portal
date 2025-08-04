export type UserRole = "STORE_VENDOR" | "DELIVERY_PERSONNEL";
export type UserStatus = "ACTIVE" | "INACTIVE";
export type VehicleType = "BIKE" | "CYCLE" | "CAR";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string; // +91 format
  role: UserRole;
  storeId?: string; // for vendors
  vehicleType?: VehicleType; // for delivery
  vehicleNumber?: string;
  coverageAreas?: string[]; // for delivery
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
import { Address } from "@/features/orders/types";
import {
  USER_ROLES,
  USER_STATUS,
  STORE_TYPES,
  STORE_STATUS,
  VEHICLE_TYPES,
} from "@/lib/constants";

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: keyof typeof USER_ROLES;
  status: keyof typeof USER_STATUS;
  storeId?: string;
  vehicleType?: keyof typeof VEHICLE_TYPES;
  vehicleNumber?: string;
  coverageAreas?: string[];
  createdAt: string;
  updatedAt: string;
}

// Store Interface
export interface Store {
  id: string;
  name: string;
  ownerName: string;
  contactNumber: string;
  email: string;
  address: Address;
  drugLicense: string;
  gstin: string;
  foodLicense?: string;
  storeType: keyof typeof STORE_TYPES;
  status: keyof typeof STORE_STATUS;
  operatingHours: {
    open: string;
    close: string;
  };
  serviceAreas: string[];
  evitalRxId?: string;
  createdAt: string;
  approvedAt?: string;
}

// Order Item Interface

// Delivery Personnel Interface
export interface DeliveryPersonnel extends User {
  role: "DELIVERY_PERSONNEL";
  vehicleType: keyof typeof VEHICLE_TYPES;
  vehicleNumber: string;
  coverageAreas: string[];
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  activeOrderId?: string;
}

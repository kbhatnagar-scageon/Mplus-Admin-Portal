import { INDIAN_STATES } from "@/lib/constants";

export type VehicleType = "bicycle" | "motorcycle" | "van" | "car";

export type DeliveryStatus = "available" | "busy" | "offline" | "on_break";

export interface DeliveryPersonnel {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  storeId?: string; // Store association for store-specific personnel
  vehicleType: VehicleType;
  vehicleNumber: string;
  licenseNumber?: string;
  status: DeliveryStatus;
  isActive: boolean;
  coverageAreas: string[]; // Array of area names/pincodes
  currentLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  ratings: {
    average: number;
    total: number;
  };
  deliveryStats: {
    totalDeliveries: number;
    successfulDeliveries: number;
    onTimeDeliveries: number;
    avgDeliveryTime: number; // in minutes
  };
  workingHours: {
    start: string; // "09:00"
    end: string;   // "18:00"
  };
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  joinedAt: string;
  lastActive?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DeliveryAssignment {
  id: string;
  orderId: string;
  deliveryPersonnelId: string;
  assignedAt: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  status: "assigned" | "picked_up" | "in_transit" | "delivered" | "failed";
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  deliveryLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  distance: number; // in km
  notes?: string;
  proofOfDelivery?: {
    type: "photo" | "signature" | "otp";
    data: string;
    timestamp: string;
  };
}

export interface DeliveryFilters {
  status?: DeliveryStatus;
  vehicleType?: VehicleType;
  coverageArea?: string;
  isActive?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}
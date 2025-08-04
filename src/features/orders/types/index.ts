import { INDIAN_STATES } from "@/lib/constants";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  prescriptionRequired: boolean;
}

export interface Address {
  street: string;
  city: string;
  district: string;
  state: keyof typeof INDIAN_STATES;
  pincode: string;
  landmark?: string;
}

export type OrderStatus = 
  | "pending"
  | "confirmed" 
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

// OrderType removed - now determined dynamically based on items and prescriptions

export interface Order {
  id: string;
  storeId: string;
  storeName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  prescriptionUrl?: string;
  prescriptionUrls?: string[];
  deliveryAddress: Address;
  status: OrderStatus;
  needsApproval: boolean;
  isApproved?: boolean;
  approvedAt?: string;
  approvedBy?: string;
  deliveryPersonnelId?: string;
  assignedAt?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  totalAmount: number;
  gstAmount: number;
  deliveryCharges: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  createdAt: string;
}

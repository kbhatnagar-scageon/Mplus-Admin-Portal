// User Role Constants
export const USER_ROLES = {
  SUPERADMIN: 'SUPERADMIN',
  STORE_VENDOR: 'STORE_VENDOR',
  DELIVERY_PERSONNEL: 'DELIVERY_PERSONNEL'
} as const

// User Status Constants
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING'
} as const

// Store Type Constants
export const STORE_TYPES = {
  RETAIL: 'RETAIL',
  CHAIN: 'CHAIN'
} as const

// Store Status Constants
export const STORE_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING_APPROVAL: 'PENDING_APPROVAL'
} as const

// Indian States List
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
] as const

// Pharmacy Categories
export const PHARMACY_CATEGORIES = [
  'Allopathic', 'Ayurvedic', 'Homeopathic', 'Unani', 'Siddha',
  'Generic Medicines', 'Prescription Drugs', 'Over-the-Counter',
  'Wellness Products', 'Nutritional Supplements'
] as const

// Vehicle Types for Delivery Personnel
export const VEHICLE_TYPES = {
  BIKE: 'BIKE',
  CYCLE: 'CYCLE',
  CAR: 'CAR'
} as const

// Order Status Constants
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
} as const

// Payment Status Constants
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED'
} as const

// Default Configuration
export const DEFAULT_CONFIG = {
  PAGE_SIZE: 10,
  MAX_FILE_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  CURRENCY_CODE: 'INR',
  TIMEZONE: 'Asia/Kolkata'
} as const
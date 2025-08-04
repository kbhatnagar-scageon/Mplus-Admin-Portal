import * as z from 'zod';
import { INDIAN_STATES } from '@/lib/constants';

// GSTIN validation regex (basic format validation)
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}$/;

// Drug license validation regex (example format: DL-KA-2024-12345)
const DRUG_LICENSE_REGEX = /^DL-[A-Z]{2}-\d{4}-\d{5}$/;

export const addressSchema = z.object({
  street: z.string().min(3, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.enum(INDIAN_STATES, { message: 'Please select a valid state' }),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits')
});

export const storeSchema = z.object({
  name: z.string().min(2, 'Store name is required'),
  ownerName: z.string().min(2, 'Owner name is required'),
  contactNumber: z.string().regex(/^\+91\d{10}$/, 'Invalid Indian phone number'),
  email: z.string().email('Invalid email address'),
  address: addressSchema,
  drugLicense: z.string().regex(DRUG_LICENSE_REGEX, 'Invalid drug license format'),
  gstin: z.string().regex(GSTIN_REGEX, 'Invalid GSTIN format'),
  foodLicense: z.string().optional(),
  storeType: z.enum(['RETAIL', 'CHAIN'], { message: 'Invalid store type' }),
  operatingHours: z.object({
    open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
    close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)')
  }),
  serviceAreas: z.array(z.string()).min(1, 'At least one service area is required'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING_APPROVAL'], { message: 'Invalid store status' }),
  evitalRxId: z.string().optional()
});

export type StoreFormData = z.infer<typeof storeSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
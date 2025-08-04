import * as z from 'zod'

// Regex patterns
export const INDIAN_PHONE_REGEX = /^\+91[6-9]\d{9}$/
export const VEHICLE_NUMBER_REGEX = /^[A-Z]{2}\s\d{2}\s[A-Z]\s\d{4}$/
export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}$/

// Validation schemas
export const IndianPhoneSchema = z.string()
  .regex(INDIAN_PHONE_REGEX, 'Invalid Indian phone number')

export const EmailSchema = z.string()
  .email('Invalid email address')
  .refine(
    (email) => {
      const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
      return allowedDomains.some(domain => email.endsWith(domain))
    },
    { message: 'Email must use a valid domain' }
  )

export const UserBaseSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'),
  email: EmailSchema,
  phone: IndianPhoneSchema,
  status: z.enum(['ACTIVE', 'INACTIVE']),
})

export const StoreVendorSchema = UserBaseSchema.extend({
  role: z.literal('STORE_VENDOR'),
  storeId: z.string().optional(),
})

export const DeliveryPersonnelSchema = UserBaseSchema.extend({
  role: z.literal('DELIVERY_PERSONNEL'),
  vehicleType: z.enum(['BIKE', 'CYCLE', 'CAR']),
  vehicleNumber: z.string()
    .regex(VEHICLE_NUMBER_REGEX, 'Invalid vehicle number format'),
  coverageAreas: z.array(z.string()).optional(),
})

export const UserSchema = z.discriminatedUnion('role', [
  StoreVendorSchema,
  DeliveryPersonnelSchema
])

// Validation functions
export function validateUser(data: unknown) {
  return UserSchema.parse(data)
}

export function validatePartialUser(data: unknown) {
  return UserSchema.partial().parse(data)
}

// Custom validation helpers
export function validateIndianPhoneNumber(phone: string): boolean {
  return INDIAN_PHONE_REGEX.test(phone)
}

export function validateVehicleNumber(vehicleNumber: string): boolean {
  return VEHICLE_NUMBER_REGEX.test(vehicleNumber)
}
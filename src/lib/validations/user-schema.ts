import * as z from "zod"

// Indian phone number validation (10 digits, starts with 6-9)
const phoneRegex = /^[6-9]\d{9}$/

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Invalid Indian mobile number"),
  role: z.enum(["STORE_VENDOR", "DELIVERY_PERSONNEL"]),
  storeId: z.string().optional(),
  vehicleType: z.enum(["BIKE", "CYCLE", "CAR"]).optional(),
  vehicleNumber: z.string().optional(),
  coverageAreas: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE")
})
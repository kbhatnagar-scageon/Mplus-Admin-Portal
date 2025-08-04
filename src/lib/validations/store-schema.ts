import * as z from "zod"

// Indian states list (comprehensive)
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli", 
  "Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", 
  "Puducherry"
] as const

// GSTIN validation regex (15-digit format)
const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

export const storeSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  contactNumber: z.string().regex(/^[6-9]\d{9}/, "Invalid Indian mobile number"),
  email: z.string().email("Invalid email address"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.enum(INDIAN_STATES, { 
      errorMap: () => ({ message: "Invalid Indian state" }) 
    }),
    pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits")
  }),
  drugLicense: z.string().min(1, "Drug license is required"),
  gstin: z.string().regex(gstinRegex, "Invalid GSTIN format"),
  foodLicense: z.string().optional(),
  storeType: z.enum(["RETAIL", "CHAIN"]),
  operatingHours: z.object({
    open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
    close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)")
  }),
  serviceAreas: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING_APPROVAL"]).default("PENDING_APPROVAL"),
  evitalRxId: z.string().optional()
})
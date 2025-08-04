// Zod is used via imported types
import {
  UserSchema,
  validateIndianPhoneNumber,
  validateVehicleNumber,
  // Regex constants
} from '../utils/validation'

describe('User Validation', () => {
  describe('Phone Number Validation', () => {
    const validPhoneNumbers = [
      '+919876543210',
      '+917654321098',
      '+916543210987'
    ]

    const invalidPhoneNumbers = [
      '9876543210',         // Missing +91
      '+911234567890',      // Starts with 1
      '+91123456789',       // Too short
      '+918765432109876'    // Too long
    ]

    test.each(validPhoneNumbers)('validates correct phone number %s', (phone) => {
      expect(validateIndianPhoneNumber(phone)).toBe(true)
    })

    test.each(invalidPhoneNumbers)('rejects invalid phone number %s', (phone) => {
      expect(validateIndianPhoneNumber(phone)).toBe(false)
    })
  })

  describe('Vehicle Number Validation', () => {
    const validVehicleNumbers = [
      'KA 12 A 1234',
      'MH 34 B 5678',
      'DL 56 C 9012'
    ]

    const invalidVehicleNumbers = [
      'K 12 A 1234',        // Invalid state code
      'KA 1 A 1234',        // Wrong number format
      'KA 12 1 1234',       // Wrong letter placement
      'KA 12 A 123'         // Too short
    ]

    test.each(validVehicleNumbers)('validates correct vehicle number %s', (number) => {
      expect(validateVehicleNumber(number)).toBe(true)
    })

    test.each(invalidVehicleNumbers)('rejects invalid vehicle number %s', (number) => {
      expect(validateVehicleNumber(number)).toBe(false)
    })
  })

  describe('User Schema Validation', () => {
    const validStoreVendor = {
      name: 'John Doe',
      email: 'john@gmail.com',
      phone: '+919876543210',
      role: 'STORE_VENDOR',
      status: 'ACTIVE'
    }

    const validDeliveryPersonnel = {
      name: 'Jane Smith',
      email: 'jane@yahoo.com',
      phone: '+917654321098',
      role: 'DELIVERY_PERSONNEL',
      status: 'ACTIVE',
      vehicleType: 'BIKE',
      vehicleNumber: 'KA 12 A 1234'
    }

    test('validates store vendor', () => {
      expect(() => UserSchema.parse(validStoreVendor)).not.toThrow()
    })

    test('validates delivery personnel', () => {
      expect(() => UserSchema.parse(validDeliveryPersonnel)).not.toThrow()
    })

    test('requires vehicle details for delivery personnel', () => {
      const invalidDeliveryPersonnel = { ...validDeliveryPersonnel }
      delete invalidDeliveryPersonnel.vehicleType

      expect(() => UserSchema.parse(invalidDeliveryPersonnel)).toThrow()
    })

    test('rejects invalid email domains', () => {
      const invalidEmailUser = {
        ...validStoreVendor,
        email: 'john@invalidomain.com'
      }

      expect(() => UserSchema.parse(invalidEmailUser)).toThrow()
    })
  })
})
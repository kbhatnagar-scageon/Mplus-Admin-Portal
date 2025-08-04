import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Indian Rupee currency formatter
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Indian date formatter with regional preferences
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: format === 'short' ? 'short' : 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  }).format(dateObj)
}

// Validate Indian mobile number
export function isValidIndianMobileNumber(phone: string): boolean {
  // Regex for Indian mobile numbers: starts with +91 or 91, followed by 10 digits
  const indianMobileRegex = /^(\+?91|0)?[6-9]\d{9}$/
  return indianMobileRegex.test(phone.replace(/\s+/g, ''))
}

// Format Indian mobile number to standard format
export function formatIndianMobileNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // If it starts with 91 or +91, remove those
  const cleanNumber = digits.replace(/^(91|\+91)/, '')
  
  // Return with +91 prefix
  return `+91 ${cleanNumber.slice(0, 5)} ${cleanNumber.slice(5)}`
}

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { UserForm } from '../components/user-form'
import { User } from '../types'

describe('UserForm Component', () => {
  const mockOnSubmit = jest.fn()

  const defaultProps = {
    onSubmit: mockOnSubmit,
    mode: 'create' as const
  }

  const validStoreVendorData: Partial<User> = {
    name: 'John Doe',
    email: 'john@gmail.com',
    phone: '+919876543210',
    role: 'STORE_VENDOR',
    status: 'ACTIVE'
  }

  const validDeliveryPersonnelData: Partial<User> = {
    name: 'Jane Smith',
    email: 'jane@yahoo.com',
    phone: '+917654321098',
    role: 'DELIVERY_PERSONNEL',
    status: 'ACTIVE',
    vehicleType: 'BIKE',
    vehicleNumber: 'KA 12 A 1234'
  }

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  test('renders form with basic fields', () => {
    render(<UserForm {...defaultProps} />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument()
  })

  test('validates and submits store vendor form', async () => {
    render(<UserForm {...defaultProps} />)
    
    // Fill out form
    fireEvent.change(screen.getByLabelText(/name/i), { 
      target: { value: validStoreVendorData.name } 
    })
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: validStoreVendorData.email } 
    })
    fireEvent.change(screen.getByLabelText(/phone number/i), { 
      target: { value: validStoreVendorData.phone } 
    })
    
    // Select role and status
    fireEvent.mouseDown(screen.getByText(/select role/i))
    fireEvent.click(screen.getByText(/store vendor/i))
    
    fireEvent.mouseDown(screen.getByText(/select status/i))
    fireEvent.click(screen.getByText(/active/i))

    // Submit form
    fireEvent.click(screen.getByText(/save user/i))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: validStoreVendorData.name,
        email: validStoreVendorData.email,
        phone: validStoreVendorData.phone,
        role: 'STORE_VENDOR',
        status: 'ACTIVE'
      }))
    })
  })

  test('validates and submits delivery personnel form', async () => {
    render(<UserForm {...defaultProps} />)
    
    // Fill out form
    fireEvent.change(screen.getByLabelText(/name/i), { 
      target: { value: validDeliveryPersonnelData.name } 
    })
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: validDeliveryPersonnelData.email } 
    })
    fireEvent.change(screen.getByLabelText(/phone number/i), { 
      target: { value: validDeliveryPersonnelData.phone } 
    })
    
    // Select role and status
    fireEvent.mouseDown(screen.getByText(/select role/i))
    fireEvent.click(screen.getByText(/delivery personnel/i))
    
    fireEvent.mouseDown(screen.getByText(/select status/i))
    fireEvent.click(screen.getByText(/active/i))

    // Select vehicle type
    fireEvent.mouseDown(screen.getByText(/select vehicle type/i))
    fireEvent.click(screen.getByText(/bike/i))

    // Enter vehicle number
    fireEvent.change(screen.getByLabelText(/vehicle number/i), { 
      target: { value: validDeliveryPersonnelData.vehicleNumber } 
    })

    // Submit form
    fireEvent.click(screen.getByText(/save user/i))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        name: validDeliveryPersonnelData.name,
        email: validDeliveryPersonnelData.email,
        phone: validDeliveryPersonnelData.phone,
        role: 'DELIVERY_PERSONNEL',
        status: 'ACTIVE',
        vehicleType: 'BIKE',
        vehicleNumber: 'KA 12 A 1234'
      }))
    })
  })

  test('shows validation errors for invalid inputs', async () => {
    render(<UserForm {...defaultProps} />)
    
    // Submit empty form
    fireEvent.click(screen.getByText(/save user/i))

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/invalid indian phone number/i)).toBeInTheDocument()
    })
  })

  test('handles edit mode with initial data', () => {
    const initialData: Partial<User> = {
      ...validStoreVendorData,
      id: '123'
    }

    render(
      <UserForm 
        initialData={initialData} 
        onSubmit={mockOnSubmit}
        mode="edit"
      />
    )

    // Check if initial data is populated
    expect(screen.getByLabelText(/name/i)).toHaveValue(initialData.name)
    expect(screen.getByLabelText(/email/i)).toHaveValue(initialData.email)
    expect(screen.getByLabelText(/phone number/i)).toHaveValue(initialData.phone)
  })
})
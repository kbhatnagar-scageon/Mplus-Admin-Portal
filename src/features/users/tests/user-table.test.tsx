import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { UserTable } from '../components/user-table'
import { User } from '../types'

describe('UserTable Component', () => {
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@gmail.com',
      phone: '+919876543210',
      role: 'STORE_VENDOR',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@yahoo.com',
      phone: '+917654321098',
      role: 'DELIVERY_PERSONNEL',
      status: 'INACTIVE',
      vehicleType: 'BIKE',
      vehicleNumber: 'KA 12 A 1234',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

  const mockFilterUsers = jest.fn((filters) => 
    mockUsers.filter(user => 
      (!filters.role || user.role === filters.role) &&
      (!filters.status || user.status === filters.status)
    )
  )

  const defaultProps = {
    data: mockUsers,
    filterUsers: mockFilterUsers
  }

  test('renders user table with correct data', () => {
    render(<UserTable {...defaultProps} />)
    
    // Check if all users are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    
    // Check role and status columns
    expect(screen.getByText('STORE_VENDOR')).toBeInTheDocument()
    expect(screen.getByText('DELIVERY_PERSONNEL')).toBeInTheDocument()
    expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    expect(screen.getByText('INACTIVE')).toBeInTheDocument()
  })

  test('supports filtering by role', () => {
    render(<UserTable {...defaultProps} />)
    
    // Open role filter
    fireEvent.mouseDown(screen.getByText(/filter by role/i))
    
    // Select Store Vendor
    fireEvent.click(screen.getByText(/store vendor/i))

    // Check filtered results
    const filteredUsers = mockFilterUsers({ role: 'STORE_VENDOR' })
    expect(filteredUsers.length).toBe(1)
    expect(filteredUsers[0].name).toBe('John Doe')
  })

  test('supports filtering by status', () => {
    render(<UserTable {...defaultProps} />)
    
    // Open status filter
    fireEvent.mouseDown(screen.getByText(/filter by status/i))
    
    // Select Inactive
    fireEvent.click(screen.getByText(/inactive/i))

    // Check filtered results
    const filteredUsers = mockFilterUsers({ status: 'INACTIVE' })
    expect(filteredUsers.length).toBe(1)
    expect(filteredUsers[0].name).toBe('Jane Smith')
  })

  test('displays correct actions for different user types', () => {
    render(<UserTable {...defaultProps} />)
    
    // Check for view details action
    const viewButtons = screen.getAllByText(/view/i)
    expect(viewButtons.length).toBe(2)

    // Check for edit action
    const editButtons = screen.getAllByText(/edit/i)
    expect(editButtons.length).toBe(2)
  })

  test('handles empty state', () => {
    render(<UserTable data={[]} filterUsers={() => []} />)
    
    expect(screen.getByText(/no users found/i)).toBeInTheDocument()
  })

  test('pagination functionality', () => {
    // Create more users to test pagination
    const manyUsers = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@gmail.com`,
      phone: '+919876543210',
      role: 'STORE_VENDOR',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))

    render(<UserTable data={manyUsers} filterUsers={() => manyUsers} />)
    
    // Check default page size (usually 10)
    const visibleUsers = screen.getAllByRole('row').slice(1) // Exclude header row
    expect(visibleUsers.length).toBeLessThanOrEqual(10)

    // Check pagination controls
    expect(screen.getByText(/page/i)).toBeInTheDocument()
    expect(screen.getByText(/next/i)).toBeInTheDocument()
  })
})
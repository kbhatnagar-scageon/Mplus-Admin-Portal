import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-dom/test-utils'
import { useUsers } from '../hooks/use-users'
import { usersApi } from '../services/users-api'

// Mock the users API
jest.mock('../services/users-api', () => ({
  usersApi: {
    getUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getUserById: jest.fn()
  }
}))

describe('useUsers Hook', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@gmail.com',
    phone: '+919876543210',
    role: 'STORE_VENDOR',
    status: 'ACTIVE'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('fetches users with pagination', async () => {
    const mockResponse = {
      users: [mockUser],
      total: 1,
      page: 1,
      pageSize: 10
    }

    ;(usersApi.getUsers as jest.Mock).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useUsers())

    act(() => {
      result.current.fetchUsers()
    })

    // State update complete

    expect(result.current.users).toEqual([mockUser])
    expect(result.current.pagination.total).toBe(1)
  })

  it('creates a new user', async () => {
    ;(usersApi.createUser as jest.Mock).mockResolvedValue(mockUser)

    const { result } = renderHook(() => useUsers())

    await act(async () => {
      await result.current.createUser(mockUser)
    })

    expect(result.current.users).toContainEqual(mockUser)
  })

  it('updates an existing user', async () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' }
    
    ;(usersApi.updateUser as jest.Mock).mockResolvedValue(updatedUser)

    const { result } = renderHook(() => useUsers())

    // First, add the initial user
    await act(async () => {
      await result.current.createUser(mockUser)
    })

    await act(async () => {
      await result.current.updateUser('1', { name: 'Updated Name' })
    })

    expect(result.current.users).toContainEqual(updatedUser)
  })

  it('deletes a user', async () => {
    ;(usersApi.deleteUser as jest.Mock).mockResolvedValue({})

    const { result } = renderHook(() => useUsers())

    // First, add the initial user
    await act(async () => {
      await result.current.createUser(mockUser)
    })

    await act(async () => {
      await result.current.deleteUser('1')
    })

    expect(result.current.users).toHaveLength(0)
  })

  it('handles loading and error states', async () => {
    ;(usersApi.getUsers as jest.Mock).mockRejectedValue(new Error('Fetch failed'))

    const { result } = renderHook(() => useUsers())

    act(() => {
      result.current.fetchUsers()
    })

    // State update complete

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('Failed to fetch users')
  })

  it('supports pagination and filtering', async () => {
    const mockResponse = {
      users: [mockUser],
      total: 1,
      page: 2,
      pageSize: 5
    }

    ;(usersApi.getUsers as jest.Mock).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useUsers())

    await act(async () => {
      await result.current.fetchUsers({
        page: 2,
        pageSize: 5,
        role: 'STORE_VENDOR',
        status: 'ACTIVE'
      })
    })

    expect(result.current.users).toEqual([mockUser])
    expect(result.current.pagination.page).toBe(2)
    expect(result.current.pagination.pageSize).toBe(5)
  })
})
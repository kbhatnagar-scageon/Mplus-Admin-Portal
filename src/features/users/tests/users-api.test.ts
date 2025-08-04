import { UsersApi } from '../services/users-api'
import { handleError } from '@/lib/utils/error-handler'

// Mock fetch and error handler
global.fetch = jest.fn()
jest.mock('@/lib/utils/error-handler', () => ({
  handleError: jest.fn()
}))

describe('Users API Service', () => {
  let usersApi: UsersApi

  beforeEach(() => {
    usersApi = new UsersApi()
    jest.clearAllMocks()
  })

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@gmail.com',
    phone: '+919876543210',
    role: 'STORE_VENDOR',
    status: 'ACTIVE'
  }

  describe('getUsers', () => {
    it('fetches users with pagination', async () => {
      const mockResponse = {
        users: [mockUser],
        total: 1,
        page: 1,
        pageSize: 10
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await usersApi.getUsers()
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Object)
        })
      )
      expect(result?.users).toEqual([mockUser])
    })

    it('handles fetch errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      await usersApi.getUsers()
      
      expect(handleError).toHaveBeenCalled()
    })
  })

  describe('createUser', () => {
    it('creates a new user', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser)
      })

      const result = await usersApi.createUser(mockUser)
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String)
        })
      )
      expect(result).toEqual(mockUser)
    })

    it('validates user data before creation', async () => {
      const invalidUser = { ...mockUser, email: 'invalid' }
      
      await expect(usersApi.createUser(invalidUser)).rejects.toThrow()
    })
  })

  describe('updateUser', () => {
    it('updates an existing user', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' }
      
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedUser)
      })

      const result = await usersApi.updateUser('1', { name: 'Updated Name' })
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1'),
        expect.objectContaining({
          method: 'POST',
          body: expect.any(String)
        })
      )
      expect(result?.name).toBe('Updated Name')
    })
  })

  describe('deleteUser', () => {
    it('deletes a user', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      })

      await usersApi.deleteUser('1')
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/1/delete'),
        expect.objectContaining({
          method: 'POST'
        })
      )
    })
  })
})
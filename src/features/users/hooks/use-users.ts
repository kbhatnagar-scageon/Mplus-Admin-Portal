import { useState, useCallback } from 'react'
import { User } from '@/types/common'
import { mockUsers } from '@/lib/mock-data/users'

export function useUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newUser: User = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      setUsers(prev => [...prev, newUser])
      
      // Update the mock data array too for persistence
      mockUsers.push(newUser)
      
      return newUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (id: string, userData: Partial<User>) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const existingUser = mockUsers.find(user => user.id === id)
      if (!existingUser) {
        throw new Error('User not found')
      }

      const updatedUser = { 
        ...existingUser, 
        ...userData, 
        updatedAt: new Date().toISOString() 
      }
      
      setUsers(prev => 
        prev.map(user => user.id === id ? updatedUser : user)
      )
      
      // Update the mock data array too for persistence
      const index = mockUsers.findIndex(user => user.id === id)
      if (index !== -1) {
        mockUsers[index] = updatedUser
      }
      
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUsers(prev => prev.filter(user => user.id !== id))
      
      // Update the mock data array too
      const index = mockUsers.findIndex(user => user.id === id)
      if (index !== -1) {
        mockUsers.splice(index, 1)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const bulkUpdateStatus = useCallback(async (userIds: string[], status: User["status"]) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUsers(prev => 
        prev.map(user => 
          userIds.includes(user.id) 
            ? { ...user, status, updatedAt: new Date().toISOString() }
            : user
        )
      )
      
      // Update the mock data array too
      userIds.forEach(id => {
        const index = mockUsers.findIndex(user => user.id === id)
        if (index !== -1) {
          mockUsers[index] = { 
            ...mockUsers[index], 
            status, 
            updatedAt: new Date().toISOString() 
          }
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update users')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getUserById = useCallback((id: string): User | null => {
    return mockUsers.find(user => user.id === id) || null
  }, [])

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    bulkUpdateStatus,
    getUserById
  }
}
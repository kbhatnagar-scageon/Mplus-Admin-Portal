import { handleError, AppError, safeAsync } from '@/lib/utils/error-handler'
import { toast } from '@/components/ui/use-toast'
import { ZodError } from 'zod'

// Mock toast
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn()
}))

describe('Error Handling Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('handleError', () => {
    test('handles Zod validation errors', () => {
      const zodError = new ZodError([
        { path: ['name'], message: 'Name is required' },
        { path: ['email'], message: 'Invalid email format' }
      ])

      handleError(zodError)

      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Validation Error',
        description: expect.stringContaining('name: Name is required'),
        variant: 'destructive'
      }))
    })

    test('handles custom AppError', () => {
      const customError = new AppError('Custom error message', 'USER_ERROR')

      handleError(customError)

      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Application Error',
        description: 'Custom error message',
        variant: 'destructive'
      }))
    })

    test('handles generic Error', () => {
      const genericError = new Error('Something went wrong')

      handleError(genericError)

      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Unexpected Error',
        description: 'Something went wrong',
        variant: 'destructive'
      }))
    })

    test('handles unknown error type', () => {
      const unknownError = 'Just a string error'

      handleError(unknownError)

      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Unknown Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      }))
    })
  })

  describe('safeAsync', () => {
    test('executes successful async function', async () => {
      const successFn = async () => 'Success'
      const result = await safeAsync(successFn)
      
      expect(result).toBe('Success')
    })

    test('handles async function throwing error', async () => {
      const errorFn = async () => {
        throw new Error('Async error')
      }
      
      const mockErrorHandler = jest.fn()
      const result = await safeAsync(errorFn, mockErrorHandler)
      
      expect(result).toBeNull()
      expect(mockErrorHandler).toHaveBeenCalledWith(expect.any(Error))
    })

    test('uses default error handler when not provided', async () => {
      const errorFn = async () => {
        throw new Error('Async error')
      }
      
      const result = await safeAsync(errorFn)
      
      expect(result).toBeNull()
      expect(toast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Unexpected Error',
        variant: 'destructive'
      }))
    })
  })
})
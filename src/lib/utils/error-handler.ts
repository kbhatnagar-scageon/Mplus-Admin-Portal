import { ZodError } from "zod"

// Simple toast implementation - can be replaced with proper toast later
const toast = (props: { title: string; description: string; variant?: string }) => {
  console.error(`${props.title}: ${props.description}`);
};

export class AppError extends Error {
  constructor(
    public message: string, 
    public code?: string, 
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    // Zod validation errors
    const errorMessages = error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    ).join('; ')
    
    toast({
      title: "Validation Error",
      description: errorMessages,
      variant: "destructive"
    })
    return
  }

  if (error instanceof AppError) {
    // Custom application errors
    toast({
      title: "Application Error",
      description: error.message,
      variant: "destructive"
    })
    return
  }

  if (error instanceof Error) {
    // Generic JavaScript errors
    toast({
      title: "Unexpected Error",
      description: error.message,
      variant: "destructive"
    })
    return
  }

  // Fallback for unhandled errors
  toast({
    title: "Unknown Error",
    description: "An unexpected error occurred",
    variant: "destructive"
  })
}

// Async error wrapper
export async function safeAsync<T>(
  fn: () => Promise<T>, 
  errorHandler = handleError
): Promise<T | null> {
  try {
    return await fn()
  } catch (error) {
    errorHandler(error)
    return null
  }
}
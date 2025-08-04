import { z } from 'zod'
import { handleError, safeAsync } from '../utils/error-handler'

export interface ApiConfig {
  baseUrl: string
  headers?: Record<string, string>
}

export class BaseApi {
  private config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...this.config.headers
    }
  }

  async get<T extends z.ZodTypeAny>(
    endpoint: string, 
    schema: T, 
    params?: Record<string, string>
  ): Promise<z.infer<T> | null> {
    const url = new URL(`${this.config.baseUrl}${endpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    return safeAsync(async () => {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return schema.parse(data)
    }, handleError)
  }

  async post<T extends z.ZodTypeAny, R extends z.ZodTypeAny>(
    endpoint: string, 
    data: unknown, 
    inputSchema: T,
    responseSchema: R
  ): Promise<z.infer<R> | null> {
    return safeAsync(async () => {
      // Validate input against schema
      const validatedData = inputSchema.parse(data)

      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(validatedData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      return responseSchema.parse(responseData)
    }, handleError)
  }

  // Similar methods for PUT, PATCH, DELETE
}
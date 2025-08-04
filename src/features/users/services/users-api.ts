import { z } from 'zod'
import { BaseApi } from '@/lib/api/base-api'
import { UserSchema, UserBaseSchema } from '../utils/validation'

export class UsersApi extends BaseApi {
  constructor() {
    super({
      baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
      headers: {
        // Add any auth headers if needed
      }
    })
  }

  // Pagination schema
  private PaginatedUsersSchema = z.object({
    users: z.array(UserSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number()
  })

  async getUsers(params: {
    page?: number
    pageSize?: number
    search?: string
    role?: string
    status?: string
  } = {}) {
    return this.get('/users', this.PaginatedUsersSchema, params as Record<string, string>)
  }

  async getUserById(id: string) {
    return this.get(`/users/${id}`, UserSchema)
  }

  async createUser(userData: unknown) {
    return this.post(
      '/users', 
      userData, 
      UserBaseSchema, 
      UserSchema
    )
  }

  async updateUser(id: string, userData: unknown) {
    return this.post(
      `/users/${id}`, 
      userData, 
      UserBaseSchema.partial(), 
      UserSchema
    )
  }

  async deleteUser(id: string) {
    return this.post(`/users/${id}/delete`, {}, z.object({}), z.object({}))
  }
}

// Singleton instance
export const usersApi = new UsersApi()
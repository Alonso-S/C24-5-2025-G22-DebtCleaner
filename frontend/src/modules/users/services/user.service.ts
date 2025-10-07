import { api } from '../../../core/api/apiClient'
import type { Role, User } from '../../../shared/types'
import type { ApiResponse } from '../../../core/api/api.types'

export const userService = {
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await api.get<ApiResponse<User[]>>('/users')
      return response.data
    } catch (error) {
      console.error('Error fetching users:', error)
      return {
        success: false,
        message: 'Error al cargar los usuarios',
      }
    }
  },

  updateUserRole: async (userId: string, newRole: Role): Promise<ApiResponse<User>> => {
    try {
      const response = await api.patch<ApiResponse<User>>(`/users/${userId}/role`, {
        role: newRole,
      })
      return response.data
    } catch (error) {
      console.error(`Error updating role for user ${userId}:`, error)
      return {
        success: false,
        message: 'Error al actualizar el rol del usuario',
      }
    }
  },
}

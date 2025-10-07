export interface ApiResponse<T = undefined> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]> | string[] | string
}

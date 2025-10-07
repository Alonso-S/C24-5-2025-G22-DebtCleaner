import { Role, User } from '../../../shared/types'

export interface LoginCodeRequest {
  email: string
  name?: string
}

export interface LoginCodeResponse {
  message: string
  userExists: boolean
}

export interface VerifyCodeRequest {
  email: string
  code: string
}

export interface VerifyCodeResponse {
  accessToken: string
  user: {
    id: string
    email: string
    name: string
    role: Role
  }
}

export interface AuthContextType {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (token: string, userData: User) => void
  logout: () => void
  refreshAccessToken: () => Promise<boolean>
}

export interface RefreshTokenResponse {
  accessToken: string
}

export interface JwtPayload {
  id: string
  name: string
  email: string
  role: Role
  iat: number
  exp: number
}

export interface AuthError {
  message: string
  statusCode?: number
}

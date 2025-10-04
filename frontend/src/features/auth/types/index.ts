export interface User {
  id: string
  email: string
  name: string
  role: string
}

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
    role: string
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
  role: string
  iat: number
  exp: number
}

// Constantes para la autenticación
export const AUTH_CONSTANTS = {
  VERIFICATION_CODE_DURATION: 300, // Duración del código de verificación en segundos (5 minutos)
  VERIFICATION_CODE_LENGTH: 6,     // Longitud del código de verificación
  WARNING_TIME_THRESHOLD: 30       // Umbral de tiempo para mostrar advertencia (en segundos)
}

export interface AuthError {
  message: string
  statusCode?: number
}

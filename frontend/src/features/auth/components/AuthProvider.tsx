import { useState, useEffect, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import type { ReactNode } from 'react'

import { authService } from '../../../services/auth.service'
import type { JwtPayload, User } from '../types'
import { AuthContext } from '../context/AuthContext'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Función para iniciar sesión
  const login = (token: string, userData: User) => {
    setAccessToken(token)
    setUser(userData)
    setIsAuthenticated(true)
  }

  // Función para cerrar sesión
  const logout = async () => {
    await authService.logout()
    setAccessToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  // Función para refrescar el token (memorizada)
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    try {
      const response = await authService.refreshToken()
      const accesToken = response.data.accessToken
      const decoded = jwtDecode<JwtPayload>(accesToken)
      const userData: User = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      }
      login(accesToken, userData)
      return true
    } catch (error) {
      console.error('Error refreshing token:', error)

      logout()
      return false
    }
  }, [])

  // Efecto para intentar refrescar el token al cargar la aplicación
  useEffect(() => {
    const tryRefreshToken = async () => {
      await refreshAccessToken()
    }

    if (!isAuthenticated) {
      tryRefreshToken()
    }
  }, [isAuthenticated, refreshAccessToken])

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated,
        login,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

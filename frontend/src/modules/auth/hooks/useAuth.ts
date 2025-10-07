import { useContext } from 'react'
import type { AuthContextType } from '../types'
import { AuthContext } from '../../auth/context/AuthContext'

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }

  return context
}

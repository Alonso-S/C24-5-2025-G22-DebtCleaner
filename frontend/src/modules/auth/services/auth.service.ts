import type {
  LoginCodeRequest,
  LoginCodeResponse,
  RefreshTokenResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
} from '../types'

import type { AxiosResponse } from 'axios'
import { api } from '../../../core/api/apiClient'

export const authService = {
  /**
   * Solicita un código de verificación para iniciar sesión o registrarse
   * @param data Datos para solicitar el código
   * @returns Respuesta del servidor
   */
  requestLoginCode: async (data: LoginCodeRequest): Promise<AxiosResponse<LoginCodeResponse>> => {
    return api.post<LoginCodeResponse>('/auth/login/code', data)
  },

  /**
   * Verifica el código de verificación para completar el inicio de sesión
   * @param data Datos para verificar el código
   * @returns Respuesta del servidor con el token de acceso
   */
  verifyLoginCode: async (data: VerifyCodeRequest): Promise<AxiosResponse<VerifyCodeResponse>> => {
    return api.post<VerifyCodeResponse>('/auth/login/verify', data)
  },

  /**
   * Refresca el token de acceso usando el refresh token (almacenado en cookie)
   * @returns Nuevo token de acceso
   */
  refreshToken: async (): Promise<AxiosResponse<RefreshTokenResponse>> => {
    return api.post<RefreshTokenResponse>('/auth/refresh-token', {})
  },
  /**
   * Cierra la sesión eliminando el refresh token de la cookie
   */
  logout: async (): Promise<void> => {
    api.post('/auth/logout')
  },
}

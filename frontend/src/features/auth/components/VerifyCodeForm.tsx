import { useState, useEffect, useCallback } from 'react'
import type { FormEvent } from 'react'

import { authService } from '../../../services/auth.service'
import type { JwtPayload, User } from '../types'
import { jwtDecode } from 'jwt-decode'
import type { AuthError } from '../types'
import { AUTH_CONSTANTS } from '../types'

interface VerifyCodeFormProps {
  email: string
  onVerificationSuccess: (accessToken: string, user: User) => void
  onBack: () => void
}

export const VerifyCodeForm = ({ email, onVerificationSuccess, onBack }: VerifyCodeFormProps) => {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(AUTH_CONSTANTS.VERIFICATION_CODE_DURATION)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  // Manejar el envío del formulario
  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (code.length !== AUTH_CONSTANTS.VERIFICATION_CODE_LENGTH) {
      setError(`El código debe tener ${AUTH_CONSTANTS.VERIFICATION_CODE_LENGTH} dígitos`)
      return
    }

    try {
      setLoading(true)
      const response = await authService.verifyLoginCode({ email, code })
      const accesToken = response.data.accessToken

      const decoded = jwtDecode<JwtPayload>(accesToken)
      const userData: User = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      }
      onVerificationSuccess(accesToken, userData)
    } catch (err: unknown) {
      const error = err as AuthError
      setError(error.message || 'Código inválido o expirado')
    } finally {
      setLoading(false)
    }
  }, [code, email, onVerificationSuccess])

  // Manejar el reenvío del código
  const handleResendCode = useCallback(async () => {
    try {
      setResending(true)
      setError(null)
      await authService.requestLoginCode({ email })
      setTimeLeft(AUTH_CONSTANTS.VERIFICATION_CODE_DURATION)
      setCode('')
    } catch (err: unknown) {
      const error = err as AuthError
      setError(error.message || 'Error al reenviar el código')
    } finally {
      setResending(false)
    }
  }, [email])

  // Formatear el tiempo restante
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }, [])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--dark-rgb))] to-[rgba(var(--dark-rgb),0.8)]">
          Verificar Código
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Hemos enviado un código de verificación a{' '}
          <span className="font-medium text-[rgb(var(--primary-rgb))]">{email}</span>
        </p>
      </div>

      <div className="relative">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[rgba(var(--primary-rgb),0.1)] to-[rgba(var(--primary-rgb),0.05)] rounded-full blur-xl"></div>
        <div className="relative bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500">Tiempo restante</span>
            <span
              className={`text-xs font-medium ${timeLeft < AUTH_CONSTANTS.WARNING_TIME_THRESHOLD ? 'text-red-500 animate-pulse-subtle' : 'text-[rgb(var(--primary-rgb))]'}`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[rgb(var(--primary-rgb))] to-[rgb(var(--primary-dark))] transition-all duration-1000 ease-linear"
              style={{ width: `${(timeLeft / AUTH_CONSTANTS.VERIFICATION_CODE_DURATION) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="code" className="block text-sm font-medium text-gray-700">
            Código de Verificación
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, AUTH_CONSTANTS.VERIFICATION_CODE_LENGTH))}
              placeholder={`Ingresa el código de ${AUTH_CONSTANTS.VERIFICATION_CODE_LENGTH} dígitos`}
              maxLength={AUTH_CONSTANTS.VERIFICATION_CODE_LENGTH}
              required
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)] focus:border-[rgb(var(--primary-rgb))] transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed tracking-widest font-mono text-center"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 animate-fade">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={loading || resending}
            className="py-2.5 px-4 text-gray-700 font-medium rounded-xl bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={loading || resending}
            className="py-2.5 px-4 text-white font-medium rounded-xl bg-gradient-to-r from-[rgb(var(--primary-rgb))] to-[var(--primary-dark)] hover:shadow-lg hover:shadow-[rgba(var(--primary-rgb),0.3)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex-1"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verificando...
              </div>
            ) : (
              <span>Verificar Código</span>
            )}
          </button>
        </div>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          ¿No recibiste el código?
          <button
            type="button"
            onClick={handleResendCode}
            className="ml-1 text-[rgb(var(--primary-rgb))] hover:underline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            disabled={timeLeft > 0 || resending}
          >
            {resending ? (
              <span className="inline-flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-1 h-3 w-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Reenviando...
              </span>
            ) : (
              'Reenviar'
            )}
          </button>
        </p>
      </div>
    </div>
  )
}

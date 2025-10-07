import { useState } from 'react'
import type { FormEvent } from 'react'
import type { AuthError } from '../types'
import axios from 'axios'
import { authService } from '../services/auth.service'

interface LoginCodeFormProps {
  onCodeSent: (email: string) => void
}

export const LoginCodeForm = ({ onCodeSent }: LoginCodeFormProps) => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [needsRegistration, setNeedsRegistration] = useState(false)

  const validateEmail = (email: string): boolean => {
    // Validar que el correo tenga el dominio @tecsup.edu.pe
    return /^[a-zA-Z0-9._%+-]+@tecsup\.edu\.pe$/.test(email)
  }

  const handleBackToLogin = () => {
    setNeedsRegistration(false)
    setError(null)
    setName('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateEmail(email)) {
      setError('El correo debe tener el dominio @tecsup.edu.pe')
      return
    }

    try {
      setLoading(true)
      const data = needsRegistration ? { email, name } : { email }

      await authService.requestLoginCode(data)

      // Si todo va bien, notificamos que el código fue enviado
      onCodeSent(email)
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        // Si el usuario no existe y no estamos en modo registro
        setNeedsRegistration(true)
        setError('Usuario no encontrado. Por favor, ingresa tu nombre para registrarte.')
        setLoading(false)
        return
      }

      const error = err as AuthError
      setError(error.message || 'Ha ocurrido un error al solicitar el código')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--dark-rgb))] to-[rgba(var(--dark-rgb),0.8)]">
          {needsRegistration ? 'Crear cuenta' : 'Iniciar Sesión'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {needsRegistration
            ? 'Regístrate para gestionar tus deudas'
            : 'Ingresa con tu correo institucional'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Institucional
            </label>
            <span className="text-xs text-[rgb(var(--primary-rgb))]">@tecsup.edu.pe</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@tecsup.edu.pe"
              required
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)] focus:border-[rgb(var(--primary-rgb))] transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {needsRegistration && (
          <div className="space-y-2 animate-fade">
            <label htmlFor="name" className="text-left block text-sm font-medium text-gray-700">
              Nombre Completo
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
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa tu nombre completo"
                required
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)] focus:border-[rgb(var(--primary-rgb))] transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        )}

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

        <div className={`flex ${needsRegistration ? 'flex-col sm:flex-row gap-3' : ''}`}>
          {needsRegistration && (
            <button
              type="button"
              onClick={handleBackToLogin}
              disabled={loading}
              className="py-2.5 px-4 text-gray-700 font-medium rounded-xl bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Volver
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`py-2.5 px-4 text-white font-medium rounded-xl bg-gradient-to-r from-[rgb(var(--primary-rgb))] to-[var(--primary-dark)] hover:shadow-lg hover:shadow-[rgba(var(--primary-rgb),0.3)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--primary-rgb),0.5)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${needsRegistration ? 'flex-1' : 'w-full'}`}
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
                Enviando...
              </div>
            ) : (
              <span>{needsRegistration ? 'Registrarme' : 'Solicitar Código'}</span>
            )}
          </button>
        </div>
      </form>

      <div className="text-center text-xs text-gray-500">
        <p>
          Al continuar, aceptas nuestros{' '}
          <a href="#" className="text-[rgb(var(--primary-rgb))] hover:underline">
            Términos de servicio
          </a>{' '}
          y{' '}
          <a href="#" className="text-[rgb(var(--primary-rgb))] hover:underline">
            Política de privacidad
          </a>
        </p>
      </div>
    </div>
  )
}

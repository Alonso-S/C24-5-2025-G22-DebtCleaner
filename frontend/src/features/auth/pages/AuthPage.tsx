import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginCodeForm } from '../components/LoginCodeForm'
import { VerifyCodeForm } from '../components/VerifyCodeForm'
import { useAuth } from '../hooks/useAuth'
import type { User } from '../types'

export const AuthPage = () => {
  const [step, setStep] = useState<'request-code' | 'verify-code'>('request-code')
  const [email, setEmail] = useState('')
  const [animateTransition, setAnimateTransition] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Activar animación al cargar la página
    setAnimateTransition(true)
  }, [])

  const handleCodeSent = (userEmail: string) => {
    setEmail(userEmail)
    setAnimateTransition(false)
    // Pequeño retraso para la animación de transición
    setTimeout(() => {
      setStep('verify-code')
      setAnimateTransition(true)
    }, 300)
  }

  const handleVerificationSuccess = (accessToken: string, user: User) => {
    login(accessToken, user)
    navigate('/dashboard') // Redirigir al dashboard después del login exitoso
  }

  const handleBack = () => {
    setAnimateTransition(false)
    // Pequeño retraso para la animación de transición
    setTimeout(() => {
      setStep('request-code')
      setAnimateTransition(true)
    }, 300)
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-5 sm:p-6">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-[rgba(var(--primary-rgb),0.03)] to-[rgba(var(--primary-rgb),0.08)] blur-3xl"></div>
          <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-r from-[rgba(var(--accent-rgb),0.03)] to-[rgba(var(--accent-rgb),0.06)] blur-3xl"></div>
        </div>
      </div>

      {/* Logo y título */}
      <div className="mb-8 text-center animate-fade">
        <h1 className="text-3xl font-bold text-shadow-sm bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--dark-rgb))] to-[rgba(var(--dark-rgb),0.8)]">
          DebtCleaner
        </h1>
      </div>

      {/* Contenedor del formulario con efecto de cristal */}
      <div
        className={`w-full max-w-md relative overflow-hidden backdrop-blur-sm bg-white/70 rounded-2xl shadow-xl border border-white/20 p-6 transition-all duration-500 ${animateTransition ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[rgba(var(--primary-rgb),0.7)] via-[rgba(var(--primary-rgb),1)] to-[rgba(var(--accent-rgb),0.7)]"></div>

        {step === 'request-code' ? (
          <LoginCodeForm onCodeSent={handleCodeSent} />
        ) : (
          <VerifyCodeForm
            email={email}
            onVerificationSuccess={handleVerificationSuccess}
            onBack={handleBack}
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-500 text-center animate-fade">
        <p>© {new Date().getFullYear()} DebtCleaner. Todos los derechos reservados.</p>
      </div>
    </div>
  )
}

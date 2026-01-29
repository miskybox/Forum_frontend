import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import authService from '../services/authService'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Por favor ingresa tu correo electrónico')
      return
    }

    setIsLoading(true)
    try {
      await authService.forgotPassword(email)
      setEmailSent(true)
      toast.success('Si el correo existe, recibirás instrucciones para restablecer tu contraseña')
    } catch (error) {
      // Por seguridad, mostramos el mismo mensaje aunque falle
      // para no revelar si el email existe o no
      setEmailSent(true)
      toast.success('Si el correo existe, recibirás instrucciones para restablecer tu contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen py-12 sm:py-16 lg:py-24 relative overflow-hidden">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
          <div className="max-w-md mx-auto">
            <div className="card border-ocean-600 animate-slide-in">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-text-darkest mb-4">
                  Revisa tu correo
                </h2>
                <p className="text-text-dark mb-6">
                  Si el correo <span className="font-semibold text-ocean-400">{email}</span> está registrado,
                  recibirás un enlace para restablecer tu contraseña.
                </p>
                <p className="text-sm text-text-muted mb-6">
                  El enlace expirará en 1 hora. Si no ves el correo, revisa tu carpeta de spam.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setEmailSent(false)
                      setEmail('')
                    }}
                    className="btn btn-outline w-full"
                  >
                    Intentar con otro correo
                  </button>
                  <Link
                    to="/login"
                    className="btn btn-primary w-full inline-block text-center"
                  >
                    Volver al inicio de sesión
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-golden rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-darkest tracking-normal mb-2">
                Recuperar contraseña
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-accent-dark to-transparent mb-4"></div>
              <p className="text-sm font-bold text-text-dark uppercase tracking-normal">
                Te enviaremos instrucciones
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="card border-ocean-600 animate-slide-in relative z-50">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text-dark mb-2"
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 bg-midnight border border-ocean-700 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full py-3 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>Enviar instrucciones</span>
                )}
              </button>
            </form>
          </div>

          {/* Link para volver */}
          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="text-sm font-bold text-text-dark hover:text-accent-dark transition-colors inline-flex items-center space-x-2"
            >
              <span>←</span>
              <span>Volver al inicio de sesión</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage

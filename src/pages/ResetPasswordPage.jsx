import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import authService from '../services/authService'
import toast from 'react-hot-toast'

const ResetPasswordPage = () => {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Validar token al cargar la página
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false)
        setIsValidToken(false)
        return
      }

      try {
        await authService.validateResetToken(token)
        setIsValidToken(true)
      } catch (error) {
        setIsValidToken(false)
        toast.error('El enlace ha expirado o no es válido')
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token])

  const validatePassword = (password) => {
    const errors = []
    if (password.length < 8) {
      errors.push('Mínimo 8 caracteres')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Al menos una mayúscula')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Al menos una minúscula')
    }
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      errors.push('Al menos un carácter especial')
    }
    return errors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar contraseña
    const passwordErrors = validatePassword(newPassword)
    if (passwordErrors.length > 0) {
      toast.error(`La contraseña debe tener: ${passwordErrors.join(', ')}`)
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    setIsLoading(true)
    try {
      await authService.resetPassword(token, newPassword)
      setResetSuccess(true)
      toast.success('Contraseña actualizada exitosamente')
    } catch (error) {
      const message = error.response?.data?.message || 'Error al restablecer la contraseña'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Pantalla de carga mientras valida
  if (isValidating) {
    return (
      <div className="min-h-screen py-12 sm:py-16 lg:py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-ocean-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-dark">Validando enlace...</p>
        </div>
      </div>
    )
  }

  // Token inválido o no proporcionado
  if (!isValidToken) {
    return (
      <div className="min-h-screen py-12 sm:py-16 lg:py-24 relative overflow-hidden">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
          <div className="max-w-md mx-auto">
            <div className="card border-red-500 animate-slide-in">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-text-darkest mb-4">
                  Enlace inválido
                </h2>
                <p className="text-text-dark mb-6">
                  {!token
                    ? 'No se proporcionó un token de restablecimiento.'
                    : 'El enlace ha expirado o ya fue utilizado.'}
                </p>
                <div className="space-y-3">
                  <Link
                    to="/forgot-password"
                    className="btn btn-primary w-full inline-block text-center"
                  >
                    Solicitar nuevo enlace
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline w-full inline-block text-center"
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

  // Restablecimiento exitoso
  if (resetSuccess) {
    return (
      <div className="min-h-screen py-12 sm:py-16 lg:py-24 relative overflow-hidden">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
          <div className="max-w-md mx-auto">
            <div className="card border-emerald-500 animate-slide-in">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-text-darkest mb-4">
                  Contraseña actualizada
                </h2>
                <p className="text-text-dark mb-6">
                  Tu contraseña ha sido restablecida exitosamente.
                  Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
                <Link
                  to="/login"
                  className="btn btn-primary w-full inline-block text-center"
                >
                  Iniciar sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Formulario de nueva contraseña
  return (
    <div className="min-h-screen py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-golden rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-darkest tracking-normal mb-2">
                Nueva contraseña
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-accent-dark to-transparent mb-4"></div>
              <p className="text-sm font-bold text-text-dark uppercase tracking-normal">
                Ingresa tu nueva contraseña
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="card border-ocean-600 animate-slide-in relative z-50">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Nueva contraseña */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-text-dark mb-2"
                >
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 bg-midnight border border-ocean-700 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 transition-colors"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-light transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-text-muted">
                  Mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial
                </p>
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-text-dark mb-2"
                >
                  Confirmar contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-midnight border border-ocean-700 rounded-lg text-text-light placeholder-text-muted focus:outline-none focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 transition-colors"
                  required
                  disabled={isLoading}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-2 text-xs text-red-400">
                    Las contraseñas no coinciden
                  </p>
                )}
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
                    <span>Actualizando...</span>
                  </>
                ) : (
                  <span>Restablecer contraseña</span>
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

export default ResetPasswordPage

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * LoginForm con estilo Adventure Explorer Retro
 * Utiliza traducciones i18n para todos los mensajes de error
 */
const LoginForm = () => {
  const location = useLocation()
  const [formData, setFormData] = useState({
    username: location.state?.username || '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()

  // Mostrar mensaje de registro exitoso si viene desde el registro
    useEffect(() => {
      if (location.state?.message) {
        toast.success(location.state.message, { duration: 5000 })
        // Limpiar el state para que no se muestre de nuevo al recargar
        globalThis.history.replaceState({}, document.title)
      }
    }, [location.state])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar username
    if (!formData.username.trim()) {
      newErrors.username = t('auth.errors.usernameRequired')
    } else if (formData.username.length < 3) {
      newErrors.username = t('auth.errors.usernameMinLength')
    } else if (/[^a-zA-Z0-9._-]/.test(formData.username)) {
      newErrors.username = t('auth.errors.usernameInvalidChars')
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired')
    } else if (formData.password.length < 8) {
      newErrors.password = t('auth.errors.passwordMinLength')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Validar formulario
    const isValid = validateForm()
    if (!isValid) {
      toast.error(t('auth.errors.completeAllFields'))
      return
    }

    setIsSubmitting(true)
    setErrors({}) // Limpiar errores anteriores

    try {
      console.log('🔐 Intentando login con:', { username: formData.username })
      await login(formData)
      console.log('✅ Login exitoso')
      toast.success(t('auth.loginSuccess'))
      navigate('/')
    } catch (error) {
      console.error('❌ Error de login:', error)
      console.error('📋 Detalles del error:', {
        message: error.message,
        response: error.response,
        request: error.request,
        data: error.response?.data,
        status: error.response?.status
      })

      let errorData = {}

      // Intentar parsear el error de diferentes formas
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          try {
            errorData = JSON.parse(error.response.data)
          } catch {
            errorData = { message: error.response.data }
          }
        } else {
          errorData = error.response.data
        }
      }

      let message = ''

      if (error.response) {
        // Error del servidor
        const status = error.response.status
        
        if (status === 401) {
          message = t('auth.errors.invalidCredentials')
        } else if (status === 403) {
          message = t('auth.errors.accountSuspended')
        } else if (status === 404) {
          message = t('auth.errors.userNotFound')
        } else if (status === 500) {
          message = t('auth.errors.serverError')
        } else if (status === 0 || !status) {
          message = t('auth.errors.networkError')
        } else {
          message = errorData?.message || t('auth.errors.serverError')
        }
      } else if (error.request) {
        // Error de red - el servidor no respondió
        message = t('auth.errors.networkError')
      } else if (error.message) {
        message = t('auth.errors.genericError')
      } else {
        message = t('auth.errors.genericError')
      }

      setErrors({ auth: message })
      toast.error(message, { 
        duration: 5000,
        style: { background: '#2D2A26', color: '#F6E6CB', border: '2px solid #d6453d' }
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {errors.auth && (
          <div
            className="p-4 border-2 border-error bg-error/10 rounded-lg"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <p className="text-error font-semibold text-sm">
                <span className="sr-only">Error: </span>
                {errors.auth}
              </p>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="username" className="text-sm font-bold text-text-dark uppercase tracking-normal mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
            {t('auth.username')}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            aria-required="true"
            aria-invalid={errors.username ? 'true' : 'false'}
            aria-describedby={errors.username ? 'username-error' : undefined}
            className={`input w-full ${errors.username ? 'border-error' : 'border-text-dark'}`}
            value={formData.username}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder={t('auth.username')}
            autoFocus
          />
          {errors.username && (
            <p id="username-error" className="mt-2 text-sm font-bold text-error" role="alert">
              <span className="sr-only">Error: </span>{errors.username}
            </p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="password" className="text-sm font-bold text-text-dark uppercase tracking-normal mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            {t('auth.password')}
          </label>
          <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                aria-required="true"
                aria-invalid={errors.password ? 'true' : 'false'}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`input w-full pr-12 ${errors.password ? 'border-error' : 'border-text-dark'}`}
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder={t('auth.passwordLoginPlaceholder')}
              />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowPassword(!showPassword)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg hover:scale-125 transition-transform z-10 cursor-pointer"
              aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              aria-pressed={showPassword}
              tabIndex={-1}
            >
              <span aria-hidden="true">
                {showPassword ? (
                  <svg className="w-5 h-5 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </span>
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-2 text-sm font-bold text-error" role="alert">
              <span className="sr-only">Error: </span>{errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full text-lg py-4 relative z-50"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          aria-describedby="login-status"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="animate-spin" aria-hidden="true">⏳</span>
              <span>{t('auth.errors.processing')}</span>
              <span id="login-status" className="sr-only">Iniciando sesión, por favor espera</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              <span>{t('auth.errors.access')}</span>
            </span>
          )}
        </button>
      </form>
    </div>
  )
}

export default LoginForm

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
      newErrors.username = `⚠️ ${t('auth.errors.usernameRequired')}`
    } else if (formData.username.length < 3) {
      newErrors.username = `⚠️ ${t('auth.errors.usernameMinLength')}`
    } else if (/[^a-zA-Z0-9._-]/.test(formData.username)) {
      newErrors.username = `⚠️ ${t('auth.errors.usernameInvalidChars')}`
    }

    // Validar password
    if (!formData.password) {
      newErrors.password = `⚠️ ${t('auth.errors.passwordRequired')}`
    } else if (formData.password.length < 8) {
      newErrors.password = `⚠️ ${t('auth.errors.passwordMinLength')}`
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
              <span className="text-2xl">⚠️</span>
              <p className="text-error font-semibold text-sm">
                <span className="sr-only">Error: </span>
                {errors.auth}
              </p>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-bold text-text-dark uppercase tracking-normal mb-2">
            👤 {t('auth.username')}
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
          <label htmlFor="password" className="block text-sm font-bold text-text-dark uppercase tracking-normal mb-2">
            🔒 {t('auth.password')}
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
              <span aria-hidden="true">{showPassword ? '🙈' : '👁️'}</span>
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
              <span aria-hidden="true">🗺️</span>
              <span>{t('auth.errors.access')}</span>
            </span>
          )}
        </button>
      </form>
    </div>
  )
}

export default LoginForm

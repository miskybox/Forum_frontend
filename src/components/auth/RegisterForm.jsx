import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * RegisterForm con estilo Adventure Explorer Retro
 */
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar nombre de usuario
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio'
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
    } else if (/[^a-zA-Z0-9._-]/.test(formData.username)) {
      newErrors.username = 'Solo se permiten letras, números, punto (.), guión (-) y guión bajo (_)'
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido (ejemplo@correo.com)'
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial'
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos una letra mayúscula'
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos una letra minúscula'
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos un carácter especial (!@#$%^&*...)'
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
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
      toast.error('Por favor, completa todos los campos correctamente')
      return
    }

    setIsSubmitting(true)
    setErrors({}) // Limpiar errores anteriores

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password
    }

    try {
      await register(userData)
      toast.success('Registro exitoso. Por favor inicia sesión')
      navigate('/login')
    } catch (error) {
      // Security: Only log status code in development, not full error data
      if (import.meta.env.DEV) {
        console.error('Registration failed:', error.response?.status || 'Network error')
      }
      
      const status = error.response?.status
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
      
      // El GlobalExceptionHandler devuelve errores de validación como Map<String, String>
      // donde las claves son los nombres de los campos
      const backendErrors = errorData.errors || {}
      
      // Si errorData tiene campos directos (como username, email, password), usarlos
      const directFieldErrors = {}
      if (errorData.username) directFieldErrors.username = errorData.username
      if (errorData.email) directFieldErrors.email = errorData.email
      if (errorData.password) directFieldErrors.password = errorData.password
      
      // Combinar errores de backendErrors y directFieldErrors
      const allBackendErrors = { ...backendErrors, ...directFieldErrors }
      
      let message = 'Error al registrar'
      
      if (error.response) {
        // Error del servidor
        // Si hay un mensaje general, usarlo; si no, construir uno desde los errores de campo
        if (errorData?.message) {
          message = errorData.message
        } else if (Object.keys(allBackendErrors).length > 0) {
          // Si hay errores de campo, usar el primero como mensaje principal
          message = Object.values(allBackendErrors)[0] || 'Error de validación'
        } else {
          message = `Error ${error.response.status}: ${error.response.statusText || 'Error del servidor'}`
        }
      } else if (error.request) {
        // Error de red
        message = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
      } else if (error.message) {
        message = error.message
      }
      
      const formattedErrors = { auth: message }

      // Mapear errores de campos del backend
      if (status === 409 || allBackendErrors.username) {
        formattedErrors.username = allBackendErrors.username || 'Este nombre de usuario ya está registrado'
        // Mensaje global simple esperado por tests
        formattedErrors.auth = 'Ya registrado'
        if (!errorData?.message) message = formattedErrors.username
      }
      if (allBackendErrors.email) {
        formattedErrors.email = allBackendErrors.email || 'Este correo electrónico ya está registrado'
        if (!formattedErrors.username && !errorData?.message) {
          message = formattedErrors.email
        }
      }
      if (allBackendErrors.password) {
        formattedErrors.password = allBackendErrors.password
      }

      setErrors(formattedErrors)

      // Mostrar mensaje principal
      toast.error(message, { duration: 6000 })

      // Mostrar errores específicos de campos adicionales
      if (formattedErrors.username && formattedErrors.username !== message) {
        toast.error(formattedErrors.username, { duration: 5000 })
      }
      if (formattedErrors.email && formattedErrors.email !== message && formattedErrors.email !== formattedErrors.username) {
        toast.error(formattedErrors.email, { duration: 5000 })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {errors.auth && (
          <div 
            className="p-4 border-2 border-error bg-dark-lighter/80 text-error font-bold text-xs uppercase tracking-normal flex items-center gap-2"
            role="alert"
            aria-live="assertive"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span>
              <span className="sr-only">Error de registro: </span>
              {errors.auth}
            </span>
          </div>
        )}

        <div>
          <label htmlFor="username" className="text-sm font-bold text-ocean-400 uppercase tracking-normal mb-2 flex items-center gap-2">
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
            className={`input w-full ${errors.username ? 'border-error' : 'border-ocean-600'}`}
            value={formData.username}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder={t('auth.usernamePlaceholder')}
          />
          {errors.username && (
            <p id="username-error" className="mt-2 text-sm font-bold text-error" role="alert">
              <span className="sr-only">Error: </span>{errors.username}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-bold text-ocean-400 uppercase tracking-normal mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
            {t('auth.email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className={`input w-full ${errors.email ? 'border-error' : 'border-ocean-600'}`}
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder={t('auth.emailPlaceholder')}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm font-bold text-error" role="alert">
              <span className="sr-only">Error: </span>{errors.email}
            </p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-bold text-ocean-400 uppercase tracking-normal mb-2">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              {t('auth.password')}
            </span>
            <span className="mt-1 block text-xs font-normal uppercase tracking-[0.08em] text-ocean-200">
              {t('auth.passwordHint')}
            </span>
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              aria-required="true"
              aria-invalid={errors.password ? 'true' : 'false'}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={`input w-full pr-12 ${errors.password ? 'border-error' : 'border-ocean-600'}`}
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder={t('auth.passwordPlaceholder')}
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
                  <svg className="w-5 h-5 text-ocean-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5 text-ocean-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
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

        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-bold text-ocean-400 uppercase tracking-normal mb-2">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
              {t('auth.confirmPassword')}
            </span>
            <span className="mt-1 block text-xs font-normal uppercase tracking-[0.08em] text-ocean-200">
              {t('auth.confirmPasswordHint')}
            </span>
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              aria-required="true"
              aria-invalid={errors.confirmPassword ? 'true' : 'false'}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              className={`input w-full pr-12 ${errors.confirmPassword ? 'border-error' : 'border-ocean-600'}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder={t('auth.confirmPasswordPlaceholder')}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowConfirmPassword(!showConfirmPassword)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg hover:scale-125 transition-transform z-10 cursor-pointer"
              aria-label={showConfirmPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              aria-pressed={showConfirmPassword}
              tabIndex={-1}
            >
              <span aria-hidden="true">
                {showConfirmPassword ? (
                  <svg className="w-5 h-5 text-ocean-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5 text-ocean-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </span>
            </button>
          </div>
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="mt-2 text-sm font-bold text-error" role="alert">
              <span className="sr-only">Error: </span>{errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full text-lg py-4 rounded-lg"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          aria-describedby="register-status"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" aria-hidden="true" />
              <span>{t('common.registering') || 'Registrando...'}</span>
              <span id="register-status" className="sr-only">Creando tu cuenta, por favor espera</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              <span>Crear cuenta</span>
            </span>
          )}
        </button>
      </form>
    </div>
  )
}

export default RegisterForm

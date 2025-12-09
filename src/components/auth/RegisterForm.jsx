import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * RegisterForm con estilo retro Space/Alien
 */
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
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
      newErrors.username = '⚠️ El nombre de usuario es obligatorio'
    } else if (formData.username.length < 3) {
      newErrors.username = '⚠️ El nombre de usuario debe tener al menos 3 caracteres'
    } else if (/[^a-zA-Z0-9._-]/.test(formData.username)) {
      newErrors.username = '⚠️ Solo se permiten letras, números, punto (.), guión (-) y guión bajo (_)'
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = '⚠️ El correo electrónico es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '⚠️ Ingresa un correo electrónico válido (ejemplo@correo.com)'
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = '⚠️ La contraseña es obligatoria'
    } else {
      const passwordErrors = []
      if (formData.password.length < 8) {
        passwordErrors.push('mínimo 8 caracteres')
      }
      if (!/(?=.*[a-z])/.test(formData.password)) {
        passwordErrors.push('al menos una letra minúscula')
      }
      if (!/(?=.*[A-Z])/.test(formData.password)) {
        passwordErrors.push('al menos una letra mayúscula')
      }
      if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])/.test(formData.password)) {
        passwordErrors.push('al menos un carácter especial (!@#$%^&*)')
      }

      if (passwordErrors.length > 0) {
        newErrors.password = `⚠️ La contraseña debe tener: ${passwordErrors.join(', ')}`
      }
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '⚠️ Debes confirmar tu contraseña'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '⚠️ Las contraseñas no coinciden'
    }

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = '⚠️ El nombre es obligatorio'
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = '⚠️ El nombre debe tener al menos 2 caracteres'
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = '⚠️ El apellido es obligatorio'
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = '⚠️ El apellido debe tener al menos 2 caracteres'
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
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName
    }

    try {
      const registerResponse = await register(userData)
      toast.success('¡Registro exitoso! Redirigiendo a inicio de sesión...')

      // Esperar 1 segundo para que el usuario vea el mensaje
      setTimeout(() => {
        navigate('/login', {
          state: {
            username: formData.username,
            message: 'Registro completado. Por favor, inicia sesión con tus credenciales.'
          }
        })
      }, 1000)
    } catch (error) {
      console.error('Error de registro:', error)
      console.error('Error completo:', {
        message: error.message,
        response: error.response,
        request: error.request,
        data: error.response?.data
      })
      
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
        formattedErrors.username = '⚠️ ' + (allBackendErrors.username || 'Este nombre de usuario ya está registrado')
        if (!errorData?.message) message = formattedErrors.username
      }
      if (allBackendErrors.email) {
        formattedErrors.email = '⚠️ ' + (allBackendErrors.email || 'Este correo electrónico ya está registrado')
        if (!formattedErrors.username && !errorData?.message) {
          message = formattedErrors.email
        }
      }
      if (allBackendErrors.password) {
        formattedErrors.password = '⚠️ ' + allBackendErrors.password
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
          <div className="p-4 border-2 border-tech-red bg-black/50 text-tech-red font-retro text-xs uppercase tracking-wider">
            ⚠️ {errors.auth}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-retro text-space-neon uppercase tracking-wider mb-2">
              Nombre
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className={`input w-full ${errors.firstName ? 'border-tech-red' : 'border-space-neon'}`}
              value={formData.firstName}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Nombre"
            />
            {errors.firstName && <p className="mt-2 text-sm font-retro text-tech-red">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-retro text-space-neon uppercase tracking-wider mb-2">
              Apellido
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className={`input w-full ${errors.lastName ? 'border-tech-red' : 'border-space-neon'}`}
              value={formData.lastName}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Apellido"
            />
            {errors.lastName && <p className="mt-2 text-sm font-retro text-tech-red">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-retro text-space-neon uppercase tracking-wider mb-2">
            👤 {t('auth.username')}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className={`input w-full ${errors.username ? 'border-tech-red' : 'border-space-neon'}`}
            value={formData.username}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder={t('auth.username')}
          />
          {errors.username && <p className="mt-2 text-sm font-retro text-tech-red">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-retro text-space-neon uppercase tracking-wider mb-2">
            📧 {t('auth.email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={`input w-full ${errors.email ? 'border-tech-red' : 'border-space-neon'}`}
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder={t('auth.email')}
          />
          {errors.email && <p className="mt-2 text-sm font-retro text-tech-red">{errors.email}</p>}
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-retro text-space-neon uppercase tracking-wider mb-2">
            🔒 {t('auth.password')}
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              className={`input w-full pr-12 ${errors.password ? 'border-tech-red' : 'border-space-neon'}`}
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder={t('auth.password')}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowPassword(!showPassword)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg hover:scale-125 transition-transform z-10 cursor-pointer"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              tabIndex={-1}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.password && <p className="mt-2 text-sm font-retro text-tech-red">{errors.password}</p>}
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-retro text-space-neon uppercase tracking-wider mb-2">
            🔒 {t('auth.confirmPassword')}
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              className={`input w-full pr-12 ${errors.confirmPassword ? 'border-tech-red' : 'border-space-neon'}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder={t('auth.confirmPassword')}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowConfirmPassword(!showConfirmPassword)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-lg hover:scale-125 transition-transform z-10 cursor-pointer"
              aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              tabIndex={-1}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-2 text-sm font-retro text-tech-red">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full text-lg py-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="animate-spin">⚡</span>
              <span>{t('common.loading')}</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>{t('auth.registerButton')}</span>
            </span>
          )}
        </button>
      </form>
    </div>
  )
}

export default RegisterForm

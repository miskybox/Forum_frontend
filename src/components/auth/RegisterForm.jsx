import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'

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

  const { register, login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Debe tener al menos 3 caracteres'
    } else if (/[^a-zA-Z0-9._-]/.test(formData.username)) {
      newErrors.username = 'Contiene caracteres no válidos'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo no válido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Debe tener mínimo 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es obligatorio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName
    }

    try {
      const registerResponse = await register(userData)
      console.log('Registro exitoso:', registerResponse)

      try {
        await login({ username: formData.username, password: formData.password })
        toast.success('¡Registro exitoso! Bienvenido/a ' + formData.username)
        navigate('/')
      } catch (loginError) {
        console.error('Error en inicio de sesión automático:', loginError)
        toast.success('¡Registro exitoso! Por favor, inicia sesión')
        navigate('/login')
      }
    } catch (error) {
      const status = error.response?.status
      const backendErrors = error.response?.data?.errors || {}
      const formattedErrors = {}

      if (status === 409 || backendErrors.username) {
        formattedErrors.username = backendErrors.username || 'Usuario ya registrado'
      }
      if (backendErrors.email) {
        formattedErrors.email = 'Este email ya está en uso'
      }

      setErrors({ ...errors, ...formattedErrors })
      toast.error(error.response?.data?.message || 'Error al registrar')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
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
            👤 Usuario
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
            placeholder="Nombre de usuario"
          />
          {errors.username && <p className="mt-2 text-sm font-retro text-tech-red">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-retro text-space-neon uppercase tracking-wider mb-2">
            📧 Email
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
            placeholder="tu@email.com"
          />
          {errors.email && <p className="mt-2 text-sm font-retro text-tech-red">{errors.email}</p>}
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-retro text-space-neon uppercase tracking-wider mb-2">
            🔒 Contraseña
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            className={`input w-full pr-12 ${errors.password ? 'border-tech-red' : 'border-space-neon'}`}
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Mínimo 6 caracteres"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-10 right-3 text-lg hover:scale-125 transition-transform"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
          {errors.password && <p className="mt-2 text-sm font-retro text-tech-red">{errors.password}</p>}
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-retro text-space-neon uppercase tracking-wider mb-2">
            🔒 Confirmar
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            className={`input w-full pr-12 ${errors.confirmPassword ? 'border-tech-red' : 'border-space-neon'}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Repite la contraseña"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-10 right-3 text-lg hover:scale-125 transition-transform"
            aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showConfirmPassword ? '🙈' : '👁️'}
          </button>
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
              <span>REGISTRANDO...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>CREAR CUENTA</span>
            </span>
          )}
        </button>
      </form>
    </div>
  )
}

export default RegisterForm

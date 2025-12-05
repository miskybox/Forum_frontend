import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'

/**
 * LoginForm con estilo retro Space/Alien
 */
const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
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
    } else if (/[^a-zA-Z0-9._-]/.test(formData.username)) {
      newErrors.username = 'El nombre de usuario contiene caracteres inválidos'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await login(formData)
      toast.success('¡Has iniciado sesión con éxito!')
      navigate('/')
    } catch (error) {
      const status = error.response?.status
      const message = error.response?.data?.message || 'Error al iniciar sesión'

      if (status === 401) {
        setErrors({ auth: 'Usuario o contraseña incorrectos' })
      } else {
        toast.error(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.auth && (
          <div className="p-4 border-2 border-tech-red bg-black/50 text-tech-red font-retro text-xs uppercase tracking-wider">
            ⚠️ {errors.auth}
          </div>
        )}

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
            placeholder="Ingresa tu usuario"
            autoFocus
          />
          {errors.username && (
            <p className="mt-2 text-sm font-retro text-tech-red">{errors.username}</p>
          )}
        </div>

        <div className="relative">
          <label htmlFor="password" className="block text-sm font-retro text-space-neon uppercase tracking-wider mb-2">
            🔒 Contraseña
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            className={`input w-full pr-12 ${errors.password ? 'border-tech-red' : 'border-space-neon'}`}
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Ingresa tu contraseña"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-10 right-3 text-lg hover:scale-125 transition-transform"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
          {errors.password && (
            <p className="mt-2 text-sm font-retro text-tech-red">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full text-lg py-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="animate-spin">⚡</span>
              <span>PROCESANDO...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <span>👽</span>
              <span>ACCEDER</span>
            </span>
          )}
        </button>
      </form>
    </div>
  )
}

export default LoginForm

// Archivo: src/components/auth/LoginForm.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Limpiar error del campo que se está editando
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio'
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      await login(formData)
      toast.success('¡Has iniciado sesión con éxito!')
      navigate('/')
    } catch (error) {
      console.error('Error de inicio de sesión:', error)
      toast.error(error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.')
      
      if (error.response?.status === 401) {
        setErrors({
          ...errors,
          auth: 'Nombre de usuario o contraseña incorrectos'
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-center text-primary-700 mb-6">Iniciar Sesión</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.auth && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
            {errors.auth}
          </div>
        )}
        
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
            Nombre de usuario
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className={`input w-full ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
            value={formData.username}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Contraseña
            </label>
            <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={`input w-full ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
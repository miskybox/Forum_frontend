// Archivo: src/components/auth/RegisterForm.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'

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
  
  const { register, login } = useAuth()
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
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Introduce un correo electrónico válido'
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
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
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Preparar datos para el registro
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      }
      
      // Registrar al usuario
      await register(userData)
      
      // Iniciar sesión automáticamente después del registro
      await login({
        username: formData.username,
        password: formData.password
      })
      
      toast.success('¡Te has registrado con éxito!')
      navigate('/')
    } catch (error) {
      console.error('Error de registro:', error)
      
      // Manejar errores específicos
      if (error.response?.status === 400) {
        // Validación de backend falló
        const backendErrors = error.response.data.errors || {}
        
        // Mapear errores del backend al estado de errores
        const formattedErrors = {}
        
        if (backendErrors.username) {
          formattedErrors.username = backendErrors.username
        }
        
        if (backendErrors.email) {
          formattedErrors.email = backendErrors.email
        }
        
        if (Object.keys(formattedErrors).length > 0) {
          setErrors({
            ...errors,
            ...formattedErrors
          })
        } else {
          toast.error(error.response.data.message || 'Error al registrarse. Inténtalo de nuevo.')
        }
      } else {
        toast.error('Error al registrarse. Inténtalo de nuevo.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-center text-primary-700 mb-6">Crear una cuenta</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-1">
              Nombre
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              className={`input w-full ${errors.firstName ? 'border-red-500 focus:ring-red-500' : ''}`}
              value={formData.firstName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-1">
              Apellido
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              className={`input w-full ${errors.lastName ? 'border-red-500 focus:ring-red-500' : ''}`}
              value={formData.lastName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>
        
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
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className={`input w-full ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
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
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className={`input w-full ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            required
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
            Acepto los{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-500">
              términos y condiciones
            </Link>
          </label>
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
                Registrando...
              </span>
            ) : (
              'Registrarse'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterForm
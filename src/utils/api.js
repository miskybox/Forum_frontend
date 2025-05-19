// Archivo: src/utils/api.js
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar el token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Si el error es 401 (Unauthorized) y no hemos intentado renovar el token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        
        if (!refreshToken) {
          throw new Error('No hay refresh token disponible')
        }
        
        // Llamar al endpoint para renovar el token
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken
        })
        
        const { token, refreshToken: newRefreshToken } = response.data
        
        // Guardar los nuevos tokens
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', newRefreshToken)
        
        // Modificar el header con el nuevo token
        originalRequest.headers['Authorization'] = `Bearer ${token}`
        
        // Reintentar la petición original
        return api(originalRequest)
      } catch (refreshError) {
        // Si falla la renovación, limpiar tokens y redirigir al login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api
// Archivo: src/services/authService.js
import api from '../utils/api'

const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
  
  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  },
  
  getCurrentUser: async () => {
    // Este endpoint no está en tu API pero es recomendable tenerlo
    // Debería devolver la información del usuario actual basado en el token
    const response = await api.get('/users/me')
    return response.data
  }
}

export default authService
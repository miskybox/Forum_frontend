import api from '../utils/api'

const authService = {

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error en registro - Detalles completos:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data,
          request: error.request
        })
      }
      // Asegurar que el error se propague con toda la información
      if (error.response) {
        // Error del servidor - mantener el error original
        throw error
      } else if (error.request) {
        // Error de red - crear un error más descriptivo
        const networkError = new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.')
        networkError.request = error.request
        throw networkError
      } else {
        // Error en la configuración de la petición
        throw error
      }
    }
  },


  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)

      const { accessToken, refreshToken } = response.data

      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error en login:', error.response?.data || error.message)
      }
      throw error
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await api.get('/users/me')
      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error al obtener usuario actual:', error.response?.data || error.message)
      }
      throw error
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout')
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error en logout:', error.response?.data || error.message)
      }

      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      throw error
    }
  },

  async refreshToken(refreshToken) {
    try {
      const response = await api.post('/auth/refresh', { refreshToken })

      const { accessToken, refreshToken: newRefreshToken } = response.data


      localStorage.setItem('token', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)

      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error al renovar token:', error.response?.data || error.message)
      }
      throw error
    }
  },


  isAuthenticated() {
    return !!localStorage.getItem('token')
  }
}

export default authService
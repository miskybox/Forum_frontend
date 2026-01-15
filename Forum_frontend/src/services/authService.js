import api from '../utils/api'

/**
 * Authentication service using HttpOnly cookies.
 * Tokens are stored in secure HttpOnly cookies by the backend,
 * not accessible via JavaScript for XSS protection.
 */
const authService = {
  // Track authentication state (since we can't read HttpOnly cookies)
  _isAuthenticated: false,

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
      // Cookies are automatically set by the browser from Set-Cookie headers
      const response = await api.post('/auth/login', credentials)

      // Store auth state locally (tokens are in HttpOnly cookies)
      if (response.data.authenticated) {
        this._isAuthenticated = true
        localStorage.setItem('isAuthenticated', 'true')
      }

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
      // Token is automatically sent via cookie
      const response = await api.get('/users/me')
      this._isAuthenticated = true
      localStorage.setItem('isAuthenticated', 'true')
      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error al obtener usuario actual:', error.response?.data || error.message)
      }
      // If we get 401, clear auth state
      if (error.response?.status === 401) {
        this._isAuthenticated = false
        localStorage.removeItem('isAuthenticated')
      }
      throw error
    }
  },

  async logout() {
    try {
      // Backend will clear HttpOnly cookies
      await api.post('/auth/logout')
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error en logout:', error.response?.data || error.message)
      }
    } finally {
      // Always clear local auth state
      this._isAuthenticated = false
      localStorage.removeItem('isAuthenticated')
    }
  },

  async refreshToken() {
    try {
      // Refresh token is sent automatically via cookie
      const response = await api.post('/auth/refresh', {})

      if (response.data.authenticated) {
        this._isAuthenticated = true
        localStorage.setItem('isAuthenticated', 'true')
      }

      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error al renovar token:', error.response?.data || error.message)
      }
      this._isAuthenticated = false
      localStorage.removeItem('isAuthenticated')
      throw error
    }
  },

  isAuthenticated() {
    // Check local state (actual auth is verified by cookies sent to backend)
    return this._isAuthenticated || localStorage.getItem('isAuthenticated') === 'true'
  },

  // Initialize auth state from localStorage on app load
  initAuthState() {
    this._isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  }
}

// Initialize on module load
authService.initAuthState()

export default authService
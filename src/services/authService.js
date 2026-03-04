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
      if (import.meta.env.DEV) {
        console.log('🔐 [authService] Enviando petición de login...')
      }
      
      // Cookies are automatically set by the browser from Set-Cookie headers
      const response = await api.post('/auth/login', credentials)
      
      if (import.meta.env.DEV) {
        console.log('📦 [authService] Respuesta de login:', {
          status: response.status,
          authenticated: response.data.authenticated,
          message: response.data.message
        })
      }

      // Store auth state locally (tokens are in HttpOnly cookies)
      if (response.data.authenticated) {
        this._isAuthenticated = true
        localStorage.setItem('isAuthenticated', 'true')
        if (import.meta.env.DEV) {
          console.log('✅ [authService] Estado de autenticación guardado')
        }
      } else if (import.meta.env.DEV) {
        console.warn('⚠️ [authService] La respuesta no indica autenticación exitosa')
      }

      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ [authService] Error en login:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          hasResponse: !!error.response,
          hasRequest: !!error.request
        })
        
        // Si es error de red (no hay respuesta), agregar info útil
        if (!error.response && error.request) {
          console.error('🔌 [authService] Error de red - el servidor no respondió')
          console.error('📍 URL intentada:', error.config?.url)
          console.error('📍 Base URL:', error.config?.baseURL)
        }
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
      // If we get 401 or 403, clear auth state
      if (error.response?.status === 401 || error.response?.status === 403) {
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
  },

  // Password Reset Methods
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error en forgot-password:', error.response?.data || error.message)
      }
      throw error
    }
  },

  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword })
      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error en reset-password:', error.response?.data || error.message)
      }
      throw error
    }
  },

  async validateResetToken(token) {
    try {
      const response = await api.post('/auth/validate-reset-token', { token })
      return response.data
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error validando token:', error.response?.data || error.message)
      }
      throw error
    }
  }
}

// Initialize on module load
authService.initAuthState()

export default authService
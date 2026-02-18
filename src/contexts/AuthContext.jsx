/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import authService from '../services/authService'

export const AuthContext = createContext()

/**
 * AuthProvider using HttpOnly cookie authentication.
 * Tokens are stored in secure HttpOnly cookies by the backend,
 * not accessible via JavaScript for enhanced XSS protection.
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      await authService.logout()
    } catch (err) {
      console.error('Error durante el cierre de sesión:', err)
      setError(err.response?.data?.message || 'No se pudo cerrar la sesión correctamente')
    } finally {
      setCurrentUser(null)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      // Check if user was previously authenticated
      if (authService.isAuthenticated()) {
        try {
          const userInfo = await authService.getCurrentUser()
          setCurrentUser(userInfo)
        } catch (error) {
          console.error('Error getting user:', error)
          // If getting user fails, try to refresh token
          try {
            await authService.refreshToken()
            const userInfo = await authService.getCurrentUser()
            setCurrentUser(userInfo)
          } catch (refreshError) {
            // Refresh failed, clear auth state
            setError(refreshError.response?.data?.message || 'Sesión expirada')
            await logout()
          }
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [logout])

  const login = useCallback(async (credentials) => {
    try {
      setError(null)
      setLoading(true)
      // Security: Don't log usernames - only log generic messages in dev
      if (import.meta.env.DEV) {
        console.log('🔐 [AuthContext] Login initiated')
      }

      await authService.login(credentials)
      if (import.meta.env.DEV) {
        console.log('✅ [AuthContext] Login successful, fetching user info...')
      }

      // Get user info after successful login
      const userInfo = await authService.getCurrentUser()
      if (import.meta.env.DEV) {
        console.log('👤 [AuthContext] User info retrieved')
      }

      setCurrentUser(userInfo)
      return userInfo
    } catch (err) {
      // Security: Only log status code, not full error objects
      if (import.meta.env.DEV) {
        console.error('❌ [AuthContext] Login failed:', err.response?.status || 'Network error')
      }

      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión'
      setError(errorMessage)

      // Re-throw para que el componente pueda manejar el error
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (userData) => {
    try {
      setError(null)
      setLoading(true)
      // Security: Don't log usernames in production
      if (import.meta.env.DEV) {
        console.log('📝 [AuthContext] Registration initiated')
      }

      const response = await authService.register(userData)
      if (import.meta.env.DEV) {
        console.log('✅ [AuthContext] Registration successful')
      }

      return response
    } catch (err) {
      // Security: Only log status code, not full error objects
      if (import.meta.env.DEV) {
        console.error('❌ [AuthContext] Registration failed:', err.response?.status || 'Network error')
      }

      const errorMessage = err.response?.data?.message || 'Error al registrar'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const value = useMemo(() => ({
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    hasRole: (role) => currentUser?.roles?.includes(role) || false,
  }), [currentUser, loading, error, login, register, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

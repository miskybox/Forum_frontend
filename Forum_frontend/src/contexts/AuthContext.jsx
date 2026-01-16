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
        } catch (err) {
          // If getting user fails, try to refresh token
          try {
            await authService.refreshToken()
            const userInfo = await authService.getCurrentUser()
            setCurrentUser(userInfo)
          } catch (refreshErr) {
            // Refresh failed, clear auth state
            setError(refreshErr.response?.data?.message || 'Sesión expirada')
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
      console.log('🔐 [AuthContext] Iniciando login para:', credentials.username)
      
      await authService.login(credentials)
      console.log('✅ [AuthContext] Login exitoso, obteniendo info de usuario...')

      // Get user info after successful login
      const userInfo = await authService.getCurrentUser()
      console.log('👤 [AuthContext] Usuario obtenido:', userInfo?.username)
      
      setCurrentUser(userInfo)
      return userInfo
    } catch (err) {
      console.error('❌ [AuthContext] Error en login:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      })
      
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
      console.log('📝 [AuthContext] Iniciando registro para:', userData.username)
      
      const response = await authService.register(userData)
      console.log('✅ [AuthContext] Registro exitoso')
      
      return response
    } catch (err) {
      console.error('❌ [AuthContext] Error en registro:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      })
      
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

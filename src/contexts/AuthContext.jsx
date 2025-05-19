// Archivo: src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react'
import authService from '../services/authService'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Verificar si el token es válido o intentar renovarlo
          const userInfo = await authService.getCurrentUser()
          setCurrentUser(userInfo)
        } catch (err) {
          // Si el token ha expirado, intentar renovarlo con el refreshToken
          if (refreshToken) {
            try {
              const response = await authService.refreshToken(refreshToken)
              setToken(response.token)
              setRefreshToken(response.refreshToken)
              localStorage.setItem('token', response.token)
              localStorage.setItem('refreshToken', response.refreshToken)
              
              const userInfo = await authService.getCurrentUser()
              setCurrentUser(userInfo)
            } catch (refreshErr) {
              logout()
              setError('Sesión expirada. Por favor, inicia sesión nuevamente.')
            }
          } else {
            logout()
          }
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [token, refreshToken])

  const login = async (credentials) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authService.login(credentials)
      
      setToken(response.token)
      setRefreshToken(response.refreshToken)
      localStorage.setItem('token', response.token)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      const userInfo = await authService.getCurrentUser()
      setCurrentUser(userInfo)
      return userInfo
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authService.register(userData)
      return response
    } catch (err) {
      setError(err.message || 'Error al registrar')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      if (token) {
        await authService.logout()
      }
    } catch (err) {
      console.error('Error during logout:', err)
    } finally {
      setToken(null)
      setRefreshToken(null)
      setCurrentUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      setLoading(false)
    }
  }

  const value = {
    currentUser,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
    hasRole: (role) => currentUser?.roles?.includes(role) || false,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
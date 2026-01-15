import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import authService from './authService'
import api from '../utils/api'

// Mock del módulo api
vi.mock('../utils/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

describe('authService (HttpOnly Cookies)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    // Reset auth state
    authService._isAuthenticated = false
    // Suprimir console.log/error durante los tests
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('register - POST /auth/register', () => {
    it('envía datos de registro correctamente', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      }
      const mockResponse = { data: { id: 1, username: 'newuser', email: 'newuser@example.com' } }

      api.post.mockResolvedValueOnce(mockResponse)

      const result = await authService.register(userData)

      expect(api.post).toHaveBeenCalledWith('/auth/register', userData)
      expect(result).toEqual(mockResponse.data)
    })

    it('maneja errores de servidor (usuario ya existe)', async () => {
      const userData = { username: 'existinguser', email: 'existing@example.com', password: 'pass' }
      const error = { response: { status: 400, data: { message: 'Usuario ya existe' } } }

      api.post.mockRejectedValueOnce(error)

      await expect(authService.register(userData)).rejects.toEqual(error)
    })

    it('maneja errores de red durante el registro', async () => {
      const userData = { username: 'newuser', email: 'new@example.com', password: 'pass123' }
      const error = { request: {}, message: 'Network Error' }

      api.post.mockRejectedValueOnce(error)

      await expect(authService.register(userData)).rejects.toThrow(
        'No se pudo conectar con el servidor'
      )
    })

    it('maneja errores de configuración de la petición', async () => {
      const userData = { username: 'newuser', email: 'new@example.com' }
      const error = new Error('Request configuration error')

      api.post.mockRejectedValueOnce(error)

      await expect(authService.register(userData)).rejects.toEqual(error)
    })
  })

  describe('login - POST /auth/login (HttpOnly cookies)', () => {
    it('realiza login y marca autenticación (tokens en cookies)', async () => {
      const credentials = { username: 'testuser', password: 'password123' }
      const mockResponse = {
        data: {
          message: 'Inicio de sesión exitoso',
          authenticated: true
        }
      }

      api.post.mockResolvedValueOnce(mockResponse)

      const result = await authService.login(credentials)

      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials)
      // Should store auth flag (not tokens - they're in HttpOnly cookies)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('isAuthenticated', 'true')
      expect(result).toEqual(mockResponse.data)
      expect(authService._isAuthenticated).toBe(true)
    })

    it('maneja errores de login', async () => {
      const credentials = { username: 'wronguser', password: 'wrongpass' }
      const error = { response: { status: 401, data: { message: 'Credenciales inválidas' } } }

      api.post.mockRejectedValueOnce(error)

      await expect(authService.login(credentials)).rejects.toEqual(error)
    })
  })

  describe('getCurrentUser - GET /users/me', () => {
    it('obtiene usuario actual (token enviado via cookie)', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' }

      api.get.mockResolvedValueOnce({ data: mockUser })

      const result = await authService.getCurrentUser()

      expect(api.get).toHaveBeenCalledWith('/users/me')
      expect(result).toEqual(mockUser)
      expect(authService._isAuthenticated).toBe(true)
    })

    it('limpia estado de auth cuando recibe 401', async () => {
      authService._isAuthenticated = true
      const error = { response: { status: 401, data: { message: 'No autorizado' } } }

      api.get.mockRejectedValueOnce(error)

      await expect(authService.getCurrentUser()).rejects.toEqual(error)
      expect(authService._isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('isAuthenticated')
    })
  })

  describe('logout - POST /auth/logout', () => {
    it('realiza logout y limpia estado de autenticación', async () => {
      authService._isAuthenticated = true
      api.post.mockResolvedValueOnce({})

      await authService.logout()

      expect(api.post).toHaveBeenCalledWith('/auth/logout')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('isAuthenticated')
      expect(authService._isAuthenticated).toBe(false)
    })

    it('limpia estado incluso si falla el logout', async () => {
      authService._isAuthenticated = true
      const error = { response: { status: 500 } }
      api.post.mockRejectedValueOnce(error)

      // Logout should not throw, it should handle errors gracefully
      await authService.logout()

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('isAuthenticated')
      expect(authService._isAuthenticated).toBe(false)
    })
  })

  describe('refreshToken - POST /auth/refresh (HttpOnly cookies)', () => {
    it('renueva tokens correctamente (via cookies)', async () => {
      const mockResponse = {
        data: {
          message: 'Token renovado exitosamente',
          authenticated: true
        }
      }

      api.post.mockResolvedValueOnce(mockResponse)

      const result = await authService.refreshToken()

      // Refresh token is sent automatically via cookie
      expect(api.post).toHaveBeenCalledWith('/auth/refresh', {})
      expect(localStorageMock.setItem).toHaveBeenCalledWith('isAuthenticated', 'true')
      expect(result).toEqual(mockResponse.data)
    })

    it('limpia auth state cuando falla el refresh', async () => {
      authService._isAuthenticated = true
      const error = { response: { status: 401, data: { message: 'Token expirado' } } }

      api.post.mockRejectedValueOnce(error)

      await expect(authService.refreshToken()).rejects.toEqual(error)
      expect(authService._isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('isAuthenticated')
    })
  })

  describe('isAuthenticated', () => {
    it('retorna true cuando _isAuthenticated es true', () => {
      authService._isAuthenticated = true

      expect(authService.isAuthenticated()).toBe(true)
    })

    it('retorna true cuando localStorage tiene isAuthenticated', () => {
      authService._isAuthenticated = false
      localStorageMock.getItem.mockReturnValue('true')

      expect(authService.isAuthenticated()).toBe(true)
    })

    it('retorna false cuando no hay indicador de autenticación', () => {
      authService._isAuthenticated = false
      localStorageMock.getItem.mockReturnValue(null)

      expect(authService.isAuthenticated()).toBe(false)
    })
  })

  describe('initAuthState', () => {
    it('inicializa estado desde localStorage', () => {
      localStorageMock.getItem.mockReturnValue('true')

      authService.initAuthState()

      expect(authService._isAuthenticated).toBe(true)
    })

    it('inicializa como false si no hay estado guardado', () => {
      localStorageMock.getItem.mockReturnValue(null)

      authService.initAuthState()

      expect(authService._isAuthenticated).toBe(false)
    })
  })
})

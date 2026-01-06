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

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
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

  describe('login - POST /auth/login', () => {
    it('realiza login y guarda tokens en localStorage', async () => {
      const credentials = { username: 'testuser', password: 'password123' }
      const mockResponse = {
        data: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token'
        }
      }
      
      api.post.mockResolvedValueOnce(mockResponse)

      const result = await authService.login(credentials)

      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-access-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'mock-refresh-token')
      expect(result).toEqual(mockResponse.data)
    })

    it('maneja errores de login', async () => {
      const credentials = { username: 'wronguser', password: 'wrongpass' }
      const error = { response: { status: 401, data: { message: 'Credenciales inválidas' } } }
      
      api.post.mockRejectedValueOnce(error)

      await expect(authService.login(credentials)).rejects.toEqual(error)
    })
  })

  describe('getCurrentUser - GET /users/me', () => {
    it('obtiene usuario actual cuando hay token', async () => {
      localStorageMock.getItem.mockReturnValue('valid-token')
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' }
      
      api.get.mockResolvedValueOnce({ data: mockUser })

      const result = await authService.getCurrentUser()

      expect(api.get).toHaveBeenCalledWith('/users/me')
      expect(result).toEqual(mockUser)
    })

    it('lanza error cuando no hay token', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      await expect(authService.getCurrentUser()).rejects.toThrow('No hay token disponible')
    })
  })

  describe('logout - POST /auth/logout', () => {
    it('realiza logout y limpia localStorage', async () => {
      api.post.mockResolvedValueOnce({})

      await authService.logout()

      expect(api.post).toHaveBeenCalledWith('/auth/logout')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken')
    })

    it('limpia localStorage incluso si falla el logout', async () => {
      const error = { response: { status: 500 } }
      api.post.mockRejectedValueOnce(error)

      await expect(authService.logout()).rejects.toEqual(error)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refreshToken')
    })
  })

  describe('refreshToken - POST /auth/refresh', () => {
    it('renueva tokens correctamente', async () => {
      const mockResponse = {
        data: {
          accessToken: 'new-access-token',
          refreshToken: 'new-refresh-token'
        }
      }
      
      api.post.mockResolvedValueOnce(mockResponse)

      const result = await authService.refreshToken('old-refresh-token')

      expect(api.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'old-refresh-token' })
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'new-access-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token')
      expect(result).toEqual(mockResponse.data)
    })
  })

  describe('isAuthenticated', () => {
    it('retorna true cuando hay token', () => {
      localStorageMock.getItem.mockReturnValue('valid-token')

      expect(authService.isAuthenticated()).toBe(true)
    })

    it('retorna false cuando no hay token', () => {
      localStorageMock.getItem.mockReturnValue(null)

      expect(authService.isAuthenticated()).toBe(false)
    })
  })
})


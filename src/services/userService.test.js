import { describe, it, expect, vi, beforeEach } from 'vitest'
import userService from './userService'
import api from '../utils/api'

// Mock del módulo api
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllUsers - GET /users', () => {
    it('obtiene todos los usuarios', async () => {
      const mockUsers = [
        { id: 1, username: 'user1', email: 'user1@example.com' },
        { id: 2, username: 'user2', email: 'user2@example.com' }
      ]
      api.get.mockResolvedValueOnce({ data: mockUsers })

      const result = await userService.getAllUsers()

      expect(api.get).toHaveBeenCalledWith('/users')
      expect(result).toEqual(mockUsers)
    })
  })

  describe('getUserById - GET /users/:id', () => {
    it('obtiene un usuario por ID', async () => {
      const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' }
      api.get.mockResolvedValueOnce({ data: mockUser })

      const result = await userService.getUserById(1)

      expect(api.get).toHaveBeenCalledWith('/users/1')
      expect(result).toEqual(mockUser)
    })

    it('maneja error cuando usuario no existe', async () => {
      const error = { response: { status: 404, data: { message: 'Usuario no encontrado' } } }
      api.get.mockRejectedValueOnce(error)

      await expect(userService.getUserById(999)).rejects.toEqual(error)
    })
  })

  describe('createUser - POST /users', () => {
    it('crea un nuevo usuario con roles', async () => {
      const userData = { username: 'newuser', email: 'new@example.com', password: 'pass123' }
      const roles = ['USER']
      const mockCreated = { id: 10, username: 'newuser', email: 'new@example.com' }
      api.post.mockResolvedValueOnce({ data: mockCreated })

      const result = await userService.createUser(userData, roles)

      expect(api.post).toHaveBeenCalledWith('/users', userData, { params: { roles } })
      expect(result).toEqual(mockCreated)
    })

    it('crea usuario con múltiples roles', async () => {
      const userData = { username: 'admin', email: 'admin@example.com' }
      const roles = ['USER', 'ADMIN']
      api.post.mockResolvedValueOnce({ data: { id: 1 } })

      await userService.createUser(userData, roles)

      expect(api.post).toHaveBeenCalledWith('/users', userData, { params: { roles: ['USER', 'ADMIN'] } })
    })
  })

  describe('updateUser - PUT /users/:id', () => {
    it('actualiza un usuario existente', async () => {
      const userData = { username: 'updateduser', email: 'updated@example.com' }
      const mockUpdated = { id: 1, ...userData }
      api.put.mockResolvedValueOnce({ data: mockUpdated })

      const result = await userService.updateUser(1, userData)

      expect(api.put).toHaveBeenCalledWith('/users/1', userData)
      expect(result).toEqual(mockUpdated)
    })
  })

  describe('deleteUser - DELETE /users/:id', () => {
    it('elimina un usuario', async () => {
      api.delete.mockResolvedValueOnce({ data: { success: true } })

      const result = await userService.deleteUser(1)

      expect(api.delete).toHaveBeenCalledWith('/users/1')
      expect(result).toEqual({ success: true })
    })
  })

  describe('changePassword - PUT /users/:id/change-password', () => {
    it('cambia la contraseña del usuario', async () => {
      api.put.mockResolvedValueOnce({ data: { success: true } })

      const result = await userService.changePassword(1, 'oldPass123', 'newPass456')

      expect(api.put).toHaveBeenCalledWith('/users/1/change-password', null, {
        params: { currentPassword: 'oldPass123', newPassword: 'newPass456' }
      })
      expect(result).toEqual({ success: true })
    })

    it('maneja error cuando contraseña actual es incorrecta', async () => {
      const error = { response: { status: 400, data: { message: 'Contraseña actual incorrecta' } } }
      api.put.mockRejectedValueOnce(error)

      await expect(userService.changePassword(1, 'wrongPass', 'newPass')).rejects.toEqual(error)
    })
  })
})


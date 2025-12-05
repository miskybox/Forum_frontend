import { describe, it, expect, vi, beforeEach } from 'vitest'
import forumService from './forumService'
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

describe('forumService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllForums - GET /forums', () => {
    it('obtiene lista de foros con paginación por defecto', async () => {
      const mockForums = {
        content: [
          { id: 1, title: 'Foro 1' },
          { id: 2, title: 'Foro 2' }
        ],
        totalPages: 1
      }
      api.get.mockResolvedValueOnce({ data: mockForums })

      const result = await forumService.getAllForums()

      expect(api.get).toHaveBeenCalledWith('/forums', { params: { page: 0, size: 10 } })
      expect(result).toEqual(mockForums)
    })

    it('obtiene foros con paginación personalizada', async () => {
      const mockForums = { content: [], totalPages: 5 }
      api.get.mockResolvedValueOnce({ data: mockForums })

      await forumService.getAllForums(2, 20)

      expect(api.get).toHaveBeenCalledWith('/forums', { params: { page: 2, size: 20 } })
    })
  })

  describe('getForumById - GET /forums/:id', () => {
    it('obtiene un foro por ID', async () => {
      const mockForum = { id: 1, title: 'Foro Test', description: 'Descripción' }
      api.get.mockResolvedValueOnce({ data: mockForum })

      const result = await forumService.getForumById(1)

      expect(api.get).toHaveBeenCalledWith('/forums/1')
      expect(result).toEqual(mockForum)
    })

    it('maneja error cuando foro no existe', async () => {
      const error = { response: { status: 404, data: { message: 'Foro no encontrado' } } }
      api.get.mockRejectedValueOnce(error)

      await expect(forumService.getForumById(999)).rejects.toEqual(error)
    })
  })

  describe('getForumsByCategory - GET /forums/category/:categoryId', () => {
    it('obtiene foros por categoría', async () => {
      const mockForums = [{ id: 1, title: 'Foro Europa' }]
      api.get.mockResolvedValueOnce({ data: mockForums })

      const result = await forumService.getForumsByCategory(5)

      expect(api.get).toHaveBeenCalledWith('/forums/category/5')
      expect(result).toEqual(mockForums)
    })
  })

  describe('searchForums - GET /forums/search', () => {
    it('busca foros por palabra clave', async () => {
      const mockForums = [{ id: 1, title: 'Viaje a París' }]
      api.get.mockResolvedValueOnce({ data: mockForums })

      const result = await forumService.searchForums('París')

      expect(api.get).toHaveBeenCalledWith('/forums/search', { params: { keyword: 'París' } })
      expect(result).toEqual(mockForums)
    })
  })

  describe('createForum - POST /forums', () => {
    it('crea un nuevo foro', async () => {
      const forumData = { title: 'Nuevo Foro', description: 'Descripción', categoryId: 1 }
      const mockCreated = { id: 10, ...forumData }
      api.post.mockResolvedValueOnce({ data: mockCreated })

      const result = await forumService.createForum(forumData)

      expect(api.post).toHaveBeenCalledWith('/forums', forumData)
      expect(result).toEqual(mockCreated)
    })
  })

  describe('updateForum - PUT /forums/:id', () => {
    it('actualiza un foro existente', async () => {
      const forumData = { title: 'Foro Actualizado' }
      const mockUpdated = { id: 1, title: 'Foro Actualizado' }
      api.put.mockResolvedValueOnce({ data: mockUpdated })

      const result = await forumService.updateForum(1, forumData)

      expect(api.put).toHaveBeenCalledWith('/forums/1', forumData)
      expect(result).toEqual(mockUpdated)
    })
  })

  describe('deleteForum - DELETE /forums/:id', () => {
    it('elimina un foro', async () => {
      api.delete.mockResolvedValueOnce({ data: { success: true } })

      const result = await forumService.deleteForum(1)

      expect(api.delete).toHaveBeenCalledWith('/forums/1')
      expect(result).toEqual({ success: true })
    })
  })

  describe('uploadForumImage - POST /forums/:id/image', () => {
    it('sube imagen para un foro', async () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const mockResponse = { imageUrl: '/uploads/test.jpg' }
      api.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await forumService.uploadForumImage(1, mockFile)

      expect(api.post).toHaveBeenCalledWith(
        '/forums/1/image',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getCurrentUserForums - GET /forums/user', () => {
    it('obtiene foros del usuario actual', async () => {
      const mockForums = [{ id: 1, title: 'Mi Foro' }]
      api.get.mockResolvedValueOnce({ data: mockForums })

      const result = await forumService.getCurrentUserForums()

      expect(api.get).toHaveBeenCalledWith('/forums/user')
      expect(result).toEqual(mockForums)
    })
  })
})


import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
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

    it('maneja error de red al obtener foros', async () => {
      const error = new Error('Network Error')

      api.get.mockRejectedValueOnce(error)

      await expect(forumService.getAllForums()).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener foros:', error)
    })

    it('maneja error 500 del servidor', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Error interno del servidor' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(forumService.getAllForums()).rejects.toEqual(error)
    })

    it('retorna array vacío cuando no hay foros', async () => {
      api.get.mockResolvedValueOnce({ data: { content: [], totalPages: 0 } })

      const result = await forumService.getAllForums()

      expect(result.content).toEqual([])
      expect(result.totalPages).toBe(0)
    })
  })

  describe('getForumById - GET /forums/:id', () => {
    it('obtiene un foro por ID exitosamente', async () => {
      const mockForum = { id: 1, title: 'Foro Test', description: 'Descripción', categoryId: 1 }
      api.get.mockResolvedValueOnce({ data: mockForum })

      const result = await forumService.getForumById(1)

      expect(api.get).toHaveBeenCalledWith('/forums/1')
      expect(result).toEqual(mockForum)
    })

    it('maneja error 404 cuando foro no existe', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Foro no encontrado' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(forumService.getForumById(999)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener foro con id 999:', error)
    })

    it('obtiene foro con ID como string', async () => {
      const mockForum = { id: 5, title: 'Foro', description: 'Desc' }

      api.get.mockResolvedValueOnce({ data: mockForum })

      const result = await forumService.getForumById('5')

      expect(api.get).toHaveBeenCalledWith('/forums/5')
      expect(result).toEqual(mockForum)
    })
  })

  describe('getForumsByCategory - GET /forums/category/:categoryId', () => {
    it('obtiene foros por categoría exitosamente', async () => {
      const mockForums = [
        { id: 1, title: 'Foro Europa', categoryId: 5 },
        { id: 2, title: 'Foro Asia', categoryId: 5 }
      ]
      api.get.mockResolvedValueOnce({ data: mockForums })

      const result = await forumService.getForumsByCategory(5)

      expect(api.get).toHaveBeenCalledWith('/forums/category/5')
      expect(result).toEqual(mockForums)
      expect(result).toHaveLength(2)
    })

    it('retorna array vacío cuando la categoría no tiene foros', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      const result = await forumService.getForumsByCategory(10)

      expect(result).toEqual([])
    })

    it('maneja error 404 cuando la categoría no existe', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Categoría no encontrada' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(forumService.getForumsByCategory(999)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener foros de la categoría con id 999:', error)
    })
  })

  describe('searchForums - GET /forums/search', () => {
    it('busca foros por palabra clave exitosamente', async () => {
      const mockForums = [
        { id: 1, title: 'Viaje a París', description: 'Foro sobre París' },
        { id: 2, title: 'París en primavera', description: 'Tips para París' }
      ]
      api.get.mockResolvedValueOnce({ data: mockForums })

      const result = await forumService.searchForums('París')

      expect(api.get).toHaveBeenCalledWith('/forums/search', { params: { keyword: 'París' } })
      expect(result).toEqual(mockForums)
      expect(result).toHaveLength(2)
    })

    it('retorna array vacío cuando no hay resultados', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      const result = await forumService.searchForums('XYZ123')

      expect(result).toEqual([])
    })

    it('maneja error de red durante búsqueda', async () => {
      const error = new Error('Network Error')

      api.get.mockRejectedValueOnce(error)

      await expect(forumService.searchForums('París')).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al buscar foros con palabra clave "París":', error)
    })

    it('busca con palabras clave especiales', async () => {
      const mockForums = [{ id: 1, title: 'Foro test' }]

      api.get.mockResolvedValueOnce({ data: mockForums })

      await forumService.searchForums('test & special')

      expect(api.get).toHaveBeenCalledWith('/forums/search', { params: { keyword: 'test & special' } })
    })
  })

  describe('createForum - POST /forums', () => {
    it('crea un nuevo foro exitosamente', async () => {
      const forumData = { title: 'Nuevo Foro', description: 'Descripción', categoryId: 1 }
      const mockCreated = { id: 10, ...forumData, createdAt: '2025-12-16' }
      api.post.mockResolvedValueOnce({ data: mockCreated })

      const result = await forumService.createForum(forumData)

      expect(api.post).toHaveBeenCalledWith('/forums', forumData)
      expect(result).toEqual(mockCreated)
    })

    it('maneja error de validación (título vacío)', async () => {
      const forumData = { title: '', description: 'Desc', categoryId: 1 }

      const error = {
        response: {
          status: 400,
          data: { message: 'El título del foro es requerido' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(forumService.createForum(forumData)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al crear foro:', error)
    })

    it('maneja error de autenticación', async () => {
      const forumData = { title: 'Foro', description: 'Desc', categoryId: 1 }

      const error = {
        response: {
          status: 401,
          data: { message: 'Debe iniciar sesión para crear foros' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(forumService.createForum(forumData)).rejects.toEqual(error)
    })

    it('maneja error cuando la categoría no existe', async () => {
      const forumData = { title: 'Foro', description: 'Desc', categoryId: 999 }

      const error = {
        response: {
          status: 404,
          data: { message: 'Categoría no encontrada' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(forumService.createForum(forumData)).rejects.toEqual(error)
    })
  })

  describe('updateForum - PUT /forums/:id', () => {
    it('actualiza un foro existente exitosamente', async () => {
      const forumData = { title: 'Foro Actualizado', description: 'Nueva descripción' }
      const mockUpdated = { id: 1, ...forumData, updatedAt: '2025-12-16' }
      api.put.mockResolvedValueOnce({ data: mockUpdated })

      const result = await forumService.updateForum(1, forumData)

      expect(api.put).toHaveBeenCalledWith('/forums/1', forumData)
      expect(result).toEqual(mockUpdated)
    })

    it('maneja error 404 al actualizar foro inexistente', async () => {
      const forumData = { title: 'Update' }

      const error = {
        response: {
          status: 404,
          data: { message: 'Foro no encontrado' }
        }
      }

      api.put.mockRejectedValueOnce(error)

      await expect(forumService.updateForum(999, forumData)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al actualizar foro con id 999:', error)
    })

    it('maneja error de autorización (no es el creador)', async () => {
      const forumData = { title: 'Update' }

      const error = {
        response: {
          status: 403,
          data: { message: 'No tienes permiso para editar este foro' }
        }
      }

      api.put.mockRejectedValueOnce(error)

      await expect(forumService.updateForum(1, forumData)).rejects.toEqual(error)
    })

    it('actualiza solo el título del foro', async () => {
      const partialUpdate = { title: 'Nuevo Título' }

      const mockResponse = {
        id: 1,
        title: 'Nuevo Título',
        description: 'Descripción original',
        categoryId: 1
      }

      api.put.mockResolvedValueOnce({ data: mockResponse })

      const result = await forumService.updateForum(1, partialUpdate)

      expect(result.title).toBe('Nuevo Título')
    })
  })

  describe('deleteForum - DELETE /forums/:id', () => {
    it('elimina un foro exitosamente', async () => {
      const mockResponse = { message: 'Foro eliminado exitosamente' }

      api.delete.mockResolvedValueOnce({ data: mockResponse })

      const result = await forumService.deleteForum(1)

      expect(api.delete).toHaveBeenCalledWith('/forums/1')
      expect(result).toEqual(mockResponse)
    })

    it('maneja error 404 al eliminar foro inexistente', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Foro no encontrado' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(forumService.deleteForum(999)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al eliminar foro con id 999:', error)
    })

    it('maneja error de autorización al eliminar', async () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'No tienes permiso para eliminar este foro' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(forumService.deleteForum(1)).rejects.toEqual(error)
    })

    it('maneja error de integridad referencial (foro con posts)', async () => {
      const error = {
        response: {
          status: 409,
          data: { message: 'No se puede eliminar el foro porque tiene posts asociados' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(forumService.deleteForum(1)).rejects.toEqual(error)
    })
  })

  describe('uploadForumImage - POST /forums/:id/image', () => {
    it('sube imagen para un foro exitosamente', async () => {
      const mockFile = new File(['image content'], 'forum.jpg', { type: 'image/jpeg' })
      const mockResponse = {
        id: 1,
        title: 'Foro',
        imagePath: '/uploads/forums/forum-123456.jpg'
      }
      api.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await forumService.uploadForumImage(1, mockFile)

      expect(api.post).toHaveBeenCalledWith(
        '/forums/1/image',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      expect(result).toEqual(mockResponse)
    })

    it('verifica que FormData contiene el archivo', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

      api.post.mockResolvedValueOnce({ data: {} })

      await forumService.uploadForumImage(1, mockFile)

      const formDataCall = api.post.mock.calls[0][1]
      expect(formDataCall).toBeInstanceOf(FormData)
    })

    it('maneja error de formato de archivo inválido', async () => {
      const mockFile = new File(['content'], 'document.pdf', { type: 'application/pdf' })

      const error = {
        response: {
          status: 400,
          data: { message: 'Formato de archivo no válido. Solo se permiten imágenes' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(forumService.uploadForumImage(1, mockFile)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al subir imagen para foro con id 1:', error)
    })

    it('maneja error de tamaño de archivo excedido', async () => {
      const largeFile = new File(['x'.repeat(10 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })

      const error = {
        response: {
          status: 413,
          data: { message: 'El archivo es demasiado grande. Máximo 5MB' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(forumService.uploadForumImage(1, largeFile)).rejects.toEqual(error)
    })

    it('maneja error 404 cuando el foro no existe', async () => {
      const mockFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' })

      const error = {
        response: {
          status: 404,
          data: { message: 'Foro no encontrado' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(forumService.uploadForumImage(999, mockFile)).rejects.toEqual(error)
    })
  })

  describe('getCurrentUserForums - GET /forums/user', () => {
    it('obtiene foros del usuario actual exitosamente', async () => {
      const mockForums = [
        { id: 1, title: 'Mi Foro 1', description: 'Desc 1' },
        { id: 2, title: 'Mi Foro 2', description: 'Desc 2' }
      ]
      api.get.mockResolvedValueOnce({ data: mockForums })

      const result = await forumService.getCurrentUserForums()

      expect(api.get).toHaveBeenCalledWith('/forums/user')
      expect(result).toEqual(mockForums)
      expect(result).toHaveLength(2)
    })

    it('retorna array vacío cuando el usuario no tiene foros', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      const result = await forumService.getCurrentUserForums()

      expect(result).toEqual([])
    })

    it('maneja error de autenticación', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Debe iniciar sesión' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(forumService.getCurrentUserForums()).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener foros del usuario actual:', error)
    })

    it('maneja error de servidor', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Error interno del servidor' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(forumService.getCurrentUserForums()).rejects.toEqual(error)
    })
  })
})


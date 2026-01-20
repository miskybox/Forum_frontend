import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import categoryService from './categoryService'
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

describe('categoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Suprimir console.error durante los tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAllCategories - GET /categories', () => {
    it('obtiene todas las categorías exitosamente', async () => {
      const mockCategories = [
        { id: 1, name: 'Europa', description: 'Países de Europa', type: 'CONTINENT' },
        { id: 2, name: 'Asia', description: 'Países de Asia', type: 'CONTINENT' },
        { id: 3, name: 'América', description: 'Países de América', type: 'CONTINENT' }
      ]

      api.get.mockResolvedValueOnce({ data: mockCategories })

      const result = await categoryService.getAllCategories()

      expect(api.get).toHaveBeenCalledWith('/categories')
      expect(result).toEqual(mockCategories)
    })

    it('maneja error cuando el servidor no responde', async () => {
      const error = new Error('Network Error')

      api.get.mockRejectedValueOnce(error)

      await expect(categoryService.getAllCategories()).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener categorías:', error)
    })

    it('maneja error 500 del servidor', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Error interno del servidor' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(categoryService.getAllCategories()).rejects.toEqual(error)
    })

    it('retorna array vacío cuando no hay categorías', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      const result = await categoryService.getAllCategories()

      expect(result).toEqual([])
    })
  })

  describe('getCategoryById - GET /categories/:id', () => {
    it('obtiene una categoría por ID exitosamente', async () => {
      const mockCategory = {
        id: 1,
        name: 'Europa',
        description: 'Países de Europa',
        type: 'CONTINENT',
        imagePath: '/images/europa.jpg'
      }

      api.get.mockResolvedValueOnce({ data: mockCategory })

      const result = await categoryService.getCategoryById(1)

      expect(api.get).toHaveBeenCalledWith('/categories/1')
      expect(result).toEqual(mockCategory)
    })

    it('maneja error 404 cuando la categoría no existe', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Categoría no encontrada' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(categoryService.getCategoryById(999)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener categoría con id 999:', error)
    })

    it('obtiene categoría con ID como string', async () => {
      const mockCategory = { id: 5, name: 'África', type: 'CONTINENT' }

      api.get.mockResolvedValueOnce({ data: mockCategory })

      const result = await categoryService.getCategoryById('5')

      expect(api.get).toHaveBeenCalledWith('/categories/5')
      expect(result).toEqual(mockCategory)
    })
  })

  describe('createCategory - POST /categories', () => {
    it('crea una nueva categoría exitosamente', async () => {
      const newCategory = {
        name: 'Oceanía',
        description: 'Países de Oceanía',
        type: 'CONTINENT'
      }

      const mockResponse = {
        id: 6,
        ...newCategory,
        imagePath: null
      }

      api.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await categoryService.createCategory(newCategory)

      expect(api.post).toHaveBeenCalledWith('/categories', newCategory)
      expect(result).toEqual(mockResponse)
    })

    it('maneja error de validación (nombre duplicado)', async () => {
      const categoryData = {
        name: 'Europa',
        description: 'Duplicado',
        type: 'CONTINENT'
      }

      const error = {
        response: {
          status: 400,
          data: { message: 'Ya existe una categoría con ese nombre' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(categoryService.createCategory(categoryData)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al crear categoría:', error)
    })

    it('maneja error de autorización (usuario no admin)', async () => {
      const categoryData = {
        name: 'Nueva Categoría',
        type: 'CONTINENT'
      }

      const error = {
        response: {
          status: 403,
          data: { message: 'No tienes permisos para crear categorías' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(categoryService.createCategory(categoryData)).rejects.toEqual(error)
    })
  })

  describe('updateCategory - PUT /categories/:id', () => {
    it('actualiza una categoría exitosamente', async () => {
      const categoryId = 1
      const updateData = {
        name: 'Europa Actualizada',
        description: 'Descripción actualizada',
        type: 'CONTINENT'
      }

      const mockResponse = {
        id: categoryId,
        ...updateData,
        imagePath: '/images/europa.jpg'
      }

      api.put.mockResolvedValueOnce({ data: mockResponse })

      const result = await categoryService.updateCategory(categoryId, updateData)

      expect(api.put).toHaveBeenCalledWith(`/categories/${categoryId}`, updateData)
      expect(result).toEqual(mockResponse)
    })

    it('maneja error 404 al actualizar categoría inexistente', async () => {
      const categoryId = 999
      const updateData = { name: 'No Existe' }

      const error = {
        response: {
          status: 404,
          data: { message: 'Categoría no encontrada' }
        }
      }

      api.put.mockRejectedValueOnce(error)

      await expect(categoryService.updateCategory(categoryId, updateData)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith(`Error al actualizar categoría con id ${categoryId}:`, error)
    })

    it('actualiza solo el nombre de la categoría', async () => {
      const categoryId = 2
      const partialUpdate = { name: 'Asia-Pacífico' }

      const mockResponse = {
        id: categoryId,
        name: 'Asia-Pacífico',
        description: 'Original description',
        type: 'CONTINENT'
      }

      api.put.mockResolvedValueOnce({ data: mockResponse })

      const result = await categoryService.updateCategory(categoryId, partialUpdate)

      expect(result.name).toBe('Asia-Pacífico')
    })
  })

  describe('deleteCategory - DELETE /categories/:id', () => {
    it('elimina una categoría exitosamente', async () => {
      const categoryId = 5
      const mockResponse = { message: 'Categoría eliminada exitosamente' }

      api.delete.mockResolvedValueOnce({ data: mockResponse })

      const result = await categoryService.deleteCategory(categoryId)

      expect(api.delete).toHaveBeenCalledWith(`/categories/${categoryId}`)
      expect(result).toEqual(mockResponse)
    })

    it('maneja error 404 al eliminar categoría inexistente', async () => {
      const categoryId = 999

      const error = {
        response: {
          status: 404,
          data: { message: 'Categoría no encontrada' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(categoryService.deleteCategory(categoryId)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith(`Error al eliminar categoría con id ${categoryId}:`, error)
    })

    it('maneja error de integridad referencial (categoría con foros)', async () => {
      const categoryId = 1

      const error = {
        response: {
          status: 409,
          data: { message: 'No se puede eliminar la categoría porque tiene foros asociados' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(categoryService.deleteCategory(categoryId)).rejects.toEqual(error)
    })

    it('maneja error de autorización al eliminar', async () => {
      const categoryId = 1

      const error = {
        response: {
          status: 403,
          data: { message: 'No tienes permisos para eliminar categorías' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(categoryService.deleteCategory(categoryId)).rejects.toEqual(error)
    })
  })

  describe('uploadCategoryImage - POST /categories/:id/image', () => {
    it('sube una imagen de categoría exitosamente', async () => {
      const categoryId = 1
      const mockFile = new File(['image content'], 'europa.jpg', { type: 'image/jpeg' })

      const mockResponse = {
        id: categoryId,
        name: 'Europa',
        imagePath: '/images/categories/europa-123456.jpg'
      }

      api.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await categoryService.uploadCategoryImage(categoryId, mockFile)

      expect(api.post).toHaveBeenCalledWith(
        `/categories/${categoryId}/image`,
        expect.any(FormData),
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('verifica que FormData contiene el archivo', async () => {
      const categoryId = 1
      const mockFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' })

      api.post.mockResolvedValueOnce({ data: {} })

      await categoryService.uploadCategoryImage(categoryId, mockFile)

      const formDataCall = api.post.mock.calls[0][1]
      expect(formDataCall).toBeInstanceOf(FormData)
    })

    it('maneja error de formato de archivo inválido', async () => {
      const categoryId = 1
      const mockFile = new File(['content'], 'document.txt', { type: 'text/plain' })

      const error = {
        response: {
          status: 400,
          data: { message: 'Formato de archivo no válido. Solo se permiten imágenes' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(categoryService.uploadCategoryImage(categoryId, mockFile)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith(`Error al subir imagen para categoría con id ${categoryId}:`, error)
    })

    it('maneja error de tamaño de archivo excedido', async () => {
      const categoryId = 1
      const largeFile = new File(['x'.repeat(10 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })

      const error = {
        response: {
          status: 413,
          data: { message: 'El archivo es demasiado grande. Máximo 5MB' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(categoryService.uploadCategoryImage(categoryId, largeFile)).rejects.toEqual(error)
    })

    it('maneja error 404 cuando la categoría no existe', async () => {
      const categoryId = 999
      const mockFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' })

      const error = {
        response: {
          status: 404,
          data: { message: 'Categoría no encontrada' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(categoryService.uploadCategoryImage(categoryId, mockFile)).rejects.toEqual(error)
    })
  })
})

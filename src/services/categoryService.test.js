import { describe, it, expect, vi, beforeEach } from 'vitest'
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
  })

  describe('getAllCategories - GET /categories', () => {
    it('obtiene todas las categorías', async () => {
      const mockCategories = [
        { id: 1, name: 'Europa', description: 'Viajes por Europa' },
        { id: 2, name: 'Asia', description: 'Viajes por Asia' }
      ]
      api.get.mockResolvedValueOnce({ data: mockCategories })

      const result = await categoryService.getAllCategories()

      expect(api.get).toHaveBeenCalledWith('/categories')
      expect(result).toEqual(mockCategories)
    })

    it('maneja errores al obtener categorías', async () => {
      const error = { response: { status: 500 } }
      api.get.mockRejectedValueOnce(error)

      await expect(categoryService.getAllCategories()).rejects.toEqual(error)
    })
  })

  describe('getCategoryById - GET /categories/:id', () => {
    it('obtiene una categoría por ID', async () => {
      const mockCategory = { id: 1, name: 'Europa', description: 'Viajes por Europa' }
      api.get.mockResolvedValueOnce({ data: mockCategory })

      const result = await categoryService.getCategoryById(1)

      expect(api.get).toHaveBeenCalledWith('/categories/1')
      expect(result).toEqual(mockCategory)
    })

    it('maneja error cuando categoría no existe', async () => {
      const error = { response: { status: 404, data: { message: 'Categoría no encontrada' } } }
      api.get.mockRejectedValueOnce(error)

      await expect(categoryService.getCategoryById(999)).rejects.toEqual(error)
    })
  })

  describe('createCategory - POST /categories', () => {
    it('crea una nueva categoría', async () => {
      const categoryData = { name: 'Oceanía', description: 'Viajes por Oceanía' }
      const mockCreated = { id: 5, ...categoryData }
      api.post.mockResolvedValueOnce({ data: mockCreated })

      const result = await categoryService.createCategory(categoryData)

      expect(api.post).toHaveBeenCalledWith('/categories', categoryData)
      expect(result).toEqual(mockCreated)
    })
  })

  describe('updateCategory - PUT /categories/:id', () => {
    it('actualiza una categoría existente', async () => {
      const categoryData = { name: 'Europa Actualizada' }
      const mockUpdated = { id: 1, name: 'Europa Actualizada' }
      api.put.mockResolvedValueOnce({ data: mockUpdated })

      const result = await categoryService.updateCategory(1, categoryData)

      expect(api.put).toHaveBeenCalledWith('/categories/1', categoryData)
      expect(result).toEqual(mockUpdated)
    })
  })

  describe('deleteCategory - DELETE /categories/:id', () => {
    it('elimina una categoría', async () => {
      api.delete.mockResolvedValueOnce({ data: { success: true } })

      const result = await categoryService.deleteCategory(1)

      expect(api.delete).toHaveBeenCalledWith('/categories/1')
      expect(result).toEqual({ success: true })
    })
  })

  describe('uploadCategoryImage - POST /categories/:id/image', () => {
    it('sube imagen para una categoría', async () => {
      const mockFile = new File([''], 'category.jpg', { type: 'image/jpeg' })
      const mockResponse = { imageUrl: '/uploads/category.jpg' }
      api.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await categoryService.uploadCategoryImage(1, mockFile)

      expect(api.post).toHaveBeenCalledWith(
        '/categories/1/image',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      expect(result).toEqual(mockResponse)
    })
  })
})


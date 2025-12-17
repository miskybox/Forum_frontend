import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import travelService from './travelService'
import api from '../utils/api'

// Mock del módulo api
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}))

describe('travelService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // === LUGARES VISITADOS ===
  describe('addPlace - POST /travel/places', () => {
    it('añade un nuevo lugar visitado exitosamente', async () => {
      const placeData = {
        countryId: 'ES',
        city: 'Barcelona',
        visitDate: '2024-06-15',
        notes: 'Increíble viaje',
        status: 'VISITED'
      }
      const mockPlace = { id: 1, ...placeData, createdAt: '2025-12-16' }
      api.post.mockResolvedValueOnce({ data: mockPlace })

      const result = await travelService.addPlace(placeData)

      expect(api.post).toHaveBeenCalledWith('/travel/places', placeData)
      expect(result).toEqual(mockPlace)
    })

    it('maneja error de validación (400)', async () => {
      const error = { response: { status: 400, data: { message: 'countryId es requerido' } } }
      api.post.mockRejectedValueOnce(error)

      await expect(travelService.addPlace({})).rejects.toEqual(error)
    })

    it('maneja error de autenticación (401)', async () => {
      const error = { response: { status: 401, data: { message: 'No autenticado' } } }
      api.post.mockRejectedValueOnce(error)

      await expect(travelService.addPlace({ countryId: 'ES' })).rejects.toEqual(error)
    })
  })

  describe('updatePlace - PUT /travel/places/:placeId', () => {
    it('actualiza un lugar visitado exitosamente', async () => {
      const placeData = { notes: 'Actualizado: mejor viaje', rating: 5 }
      const mockUpdated = { id: 1, countryId: 'ES', ...placeData, updatedAt: '2025-12-16' }
      api.put.mockResolvedValueOnce({ data: mockUpdated })

      const result = await travelService.updatePlace(1, placeData)

      expect(api.put).toHaveBeenCalledWith('/travel/places/1', placeData)
      expect(result).toEqual(mockUpdated)
    })

    it('maneja error 404 cuando lugar no existe', async () => {
      const error = { response: { status: 404, data: { message: 'Lugar no encontrado' } } }
      api.put.mockRejectedValueOnce(error)

      await expect(travelService.updatePlace(999, {})).rejects.toEqual(error)
    })

    it('maneja error de autorización (403)', async () => {
      const error = { response: { status: 403, data: { message: 'No autorizado' } } }
      api.put.mockRejectedValueOnce(error)

      await expect(travelService.updatePlace(1, {})).rejects.toEqual(error)
    })
  })

  describe('deletePlace - DELETE /travel/places/:placeId', () => {
    it('elimina un lugar visitado exitosamente', async () => {
      api.delete.mockResolvedValueOnce({ data: { message: 'Lugar eliminado' } })

      await travelService.deletePlace(1)

      expect(api.delete).toHaveBeenCalledWith('/travel/places/1')
    })

    it('maneja error 404 cuando lugar no existe', async () => {
      const error = { response: { status: 404, data: { message: 'Lugar no encontrado' } } }
      api.delete.mockRejectedValueOnce(error)

      await expect(travelService.deletePlace(999)).rejects.toEqual(error)
    })

    it('maneja error de autorización (403)', async () => {
      const error = { response: { status: 403, data: { message: 'No autorizado' } } }
      api.delete.mockRejectedValueOnce(error)

      await expect(travelService.deletePlace(1)).rejects.toEqual(error)
    })
  })

  describe('getPlaceById - GET /travel/places/:placeId', () => {
    it('obtiene un lugar por ID', async () => {
      const mockPlace = { id: 1, countryId: 'FR', city: 'París' }
      api.get.mockResolvedValueOnce({ data: mockPlace })

      const result = await travelService.getPlaceById(1)

      expect(api.get).toHaveBeenCalledWith('/travel/places/1')
      expect(result).toEqual(mockPlace)
    })
  })

  describe('getMyPlaces - GET /travel/my-places', () => {
    it('obtiene todos mis lugares visitados', async () => {
      const mockPlaces = [
        { id: 1, countryId: 'ES', city: 'Barcelona' },
        { id: 2, countryId: 'FR', city: 'París' }
      ]
      api.get.mockResolvedValueOnce({ data: mockPlaces })

      const result = await travelService.getMyPlaces()

      expect(api.get).toHaveBeenCalledWith('/travel/my-places')
      expect(result).toEqual(mockPlaces)
    })
  })

  describe('getMyPlacesPaginated - GET /travel/my-places/paginated', () => {
    it('obtiene lugares con paginación', async () => {
      const mockPaginated = {
        content: [{ id: 1, countryId: 'ES' }],
        totalPages: 3
      }
      api.get.mockResolvedValueOnce({ data: mockPaginated })

      const result = await travelService.getMyPlacesPaginated(0, 20, 'createdAt', 'desc')

      expect(api.get).toHaveBeenCalledWith('/travel/my-places/paginated', {
        params: { page: 0, size: 20, sortBy: 'createdAt', direction: 'desc' }
      })
      expect(result).toEqual(mockPaginated)
    })

    it('usa valores por defecto', async () => {
      api.get.mockResolvedValueOnce({ data: { content: [] } })

      await travelService.getMyPlacesPaginated()

      expect(api.get).toHaveBeenCalledWith('/travel/my-places/paginated', {
        params: { page: 0, size: 20, sortBy: 'createdAt', direction: 'desc' }
      })
    })
  })

  describe('getMyPlacesByStatus - GET /travel/my-places/status/:status', () => {
    it('obtiene lugares por estado (VISITED)', async () => {
      const mockPlaces = [{ id: 1, status: 'VISITED' }]
      api.get.mockResolvedValueOnce({ data: mockPlaces })

      const result = await travelService.getMyPlacesByStatus('VISITED')

      expect(api.get).toHaveBeenCalledWith('/travel/my-places/status/VISITED')
      expect(result).toEqual(mockPlaces)
    })

    it('obtiene lugares por estado (WISHLIST)', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await travelService.getMyPlacesByStatus('WISHLIST')

      expect(api.get).toHaveBeenCalledWith('/travel/my-places/status/WISHLIST')
    })
  })

  describe('getMyFavorites - GET /travel/my-places/favorites', () => {
    it('obtiene lugares favoritos', async () => {
      const mockFavorites = [{ id: 1, favorite: true }]
      api.get.mockResolvedValueOnce({ data: mockFavorites })

      const result = await travelService.getMyFavorites()

      expect(api.get).toHaveBeenCalledWith('/travel/my-places/favorites')
      expect(result).toEqual(mockFavorites)
    })
  })

  describe('toggleFavorite - PATCH /travel/places/:placeId/favorite', () => {
    it('marca/desmarca lugar como favorito', async () => {
      const mockUpdated = { id: 1, favorite: true }
      api.patch.mockResolvedValueOnce({ data: mockUpdated })

      const result = await travelService.toggleFavorite(1)

      expect(api.patch).toHaveBeenCalledWith('/travel/places/1/favorite')
      expect(result).toEqual(mockUpdated)
    })
  })

  // === ESTADÍSTICAS ===
  describe('getMyStats - GET /travel/my-stats', () => {
    it('obtiene mis estadísticas de viaje', async () => {
      const mockStats = {
        countriesVisited: 15,
        continentsVisited: 4,
        percentWorld: 7.8
      }
      api.get.mockResolvedValueOnce({ data: mockStats })

      const result = await travelService.getMyStats()

      expect(api.get).toHaveBeenCalledWith('/travel/my-stats')
      expect(result).toEqual(mockStats)
    })
  })

  describe('getUserStats - GET /travel/users/:userId/stats', () => {
    it('obtiene estadísticas de otro usuario', async () => {
      const mockStats = { countriesVisited: 30, percentWorld: 15.6 }
      api.get.mockResolvedValueOnce({ data: mockStats })

      const result = await travelService.getUserStats(5)

      expect(api.get).toHaveBeenCalledWith('/travel/users/5/stats')
      expect(result).toEqual(mockStats)
    })
  })

  describe('getUserPlaces - GET /travel/users/:userId/places', () => {
    it('obtiene lugares de otro usuario', async () => {
      const mockPlaces = [{ id: 1, countryId: 'JP' }]
      api.get.mockResolvedValueOnce({ data: mockPlaces })

      const result = await travelService.getUserPlaces(5)

      expect(api.get).toHaveBeenCalledWith('/travel/users/5/places')
      expect(result).toEqual(mockPlaces)
    })
  })

  // === RANKING ===
  describe('getRanking - GET /travel/ranking', () => {
    it('obtiene ranking de viajeros', async () => {
      const mockRanking = [
        { rank: 1, username: 'traveler1', countriesVisited: 100 },
        { rank: 2, username: 'traveler2', countriesVisited: 85 }
      ]
      api.get.mockResolvedValueOnce({ data: mockRanking })

      const result = await travelService.getRanking(10)

      expect(api.get).toHaveBeenCalledWith('/travel/ranking', { params: { limit: 10 } })
      expect(result).toEqual(mockRanking)
    })

    it('usa límite por defecto', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await travelService.getRanking()

      expect(api.get).toHaveBeenCalledWith('/travel/ranking', { params: { limit: 10 } })
    })
  })

  describe('getMyRanking - GET /travel/my-ranking', () => {
    it('obtiene mi posición en el ranking', async () => {
      const mockMyRank = { rank: 42, totalUsers: 500 }
      api.get.mockResolvedValueOnce({ data: mockMyRank })

      const result = await travelService.getMyRanking()

      expect(api.get).toHaveBeenCalledWith('/travel/my-ranking')
      expect(result).toEqual(mockMyRank)
    })
  })

  describe('hasVisitedCountry - GET /travel/check/:countryId', () => {
    it('verifica si he visitado un país', async () => {
      api.get.mockResolvedValueOnce({ data: true })

      const result = await travelService.hasVisitedCountry('ES')

      expect(api.get).toHaveBeenCalledWith('/travel/check/ES')
      expect(result).toBe(true)
    })

    it('retorna false si no he visitado el país', async () => {
      api.get.mockResolvedValueOnce({ data: false })

      const result = await travelService.hasVisitedCountry('AU')

      expect(result).toBe(false)
    })
  })

})


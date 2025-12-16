import { describe, it, expect, vi, beforeEach } from 'vitest'
import countryService from './countryService'
import api from '../utils/api'

// Mock del módulo api
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn()
  }
}))

describe('countryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllCountries - GET /countries', () => {
    it('obtiene todos los países', async () => {
      const mockCountries = [
        { id: 1, name: 'España', isoCode: 'ES' },
        { id: 2, name: 'Francia', isoCode: 'FR' }
      ]
      api.get.mockResolvedValueOnce({ data: mockCountries })

      const result = await countryService.getAllCountries()

      expect(api.get).toHaveBeenCalledWith('/countries')
      expect(result).toEqual(mockCountries)
    })
  })

  describe('getCountryById - GET /countries/:id', () => {
    it('obtiene un país por ID', async () => {
      const mockCountry = { id: 1, name: 'España', isoCode: 'ES', capital: 'Madrid' }
      api.get.mockResolvedValueOnce({ data: mockCountry })

      const result = await countryService.getCountryById(1)

      expect(api.get).toHaveBeenCalledWith('/countries/1')
      expect(result).toEqual(mockCountry)
    })
  })

  describe('getCountryByIsoCode - GET /countries/code/:isoCode', () => {
    it('obtiene un país por código ISO', async () => {
      const mockCountry = { id: 1, name: 'España', isoCode: 'ES' }
      api.get.mockResolvedValueOnce({ data: mockCountry })

      const result = await countryService.getCountryByIsoCode('ES')

      expect(api.get).toHaveBeenCalledWith('/countries/code/ES')
      expect(result).toEqual(mockCountry)
    })

    it('busca con código en minúsculas', async () => {
      api.get.mockResolvedValueOnce({ data: {} })

      await countryService.getCountryByIsoCode('fr')

      expect(api.get).toHaveBeenCalledWith('/countries/code/fr')
    })
  })

  describe('searchCountries - GET /countries/search', () => {
    it('busca países por nombre', async () => {
      const mockResults = [
        { id: 1, name: 'España' },
        { id: 2, name: 'Estados Unidos' }
      ]
      api.get.mockResolvedValueOnce({ data: mockResults })

      const result = await countryService.searchCountries('Espa')

      expect(api.get).toHaveBeenCalledWith('/countries/search', { params: { q: 'Espa' } })
      expect(result).toEqual(mockResults)
    })
  })

  describe('getCountriesByContinent - GET /countries/continent/:continent', () => {
    it('obtiene países de un continente', async () => {
      const mockCountries = [
        { id: 1, name: 'España', continent: 'Europe' },
        { id: 2, name: 'Francia', continent: 'Europe' }
      ]
      api.get.mockResolvedValueOnce({ data: mockCountries })

      const result = await countryService.getCountriesByContinent('Europe')

      expect(api.get).toHaveBeenCalledWith('/countries/continent/Europe')
      expect(result).toEqual(mockCountries)
    })

    it('obtiene países de Asia', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await countryService.getCountriesByContinent('Asia')

      expect(api.get).toHaveBeenCalledWith('/countries/continent/Asia')
    })
  })

  describe('getAllContinents - GET /countries/continents', () => {
    it('obtiene lista de continentes', async () => {
      const mockContinents = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']
      api.get.mockResolvedValueOnce({ data: mockContinents })

      const result = await countryService.getAllContinents()

      expect(api.get).toHaveBeenCalledWith('/countries/continents')
      expect(result).toEqual(mockContinents)
    })
  })

  describe('getCountryStats - GET /countries/stats', () => {
    it('obtiene estadísticas globales', async () => {
      const mockStats = {
        totalCountries: 195,
        totalContinents: 6,
        mostPopulated: 'China'
      }
      api.get.mockResolvedValueOnce({ data: mockStats })

      const result = await countryService.getCountryStats()

      expect(api.get).toHaveBeenCalledWith('/countries/stats')
      expect(result).toEqual(mockStats)
    })
  })

  describe('getRandomCountries - GET /countries/random', () => {
    it('obtiene países aleatorios con cantidad por defecto', async () => {
      const mockCountries = [
        { id: 1, name: 'Japón' },
        { id: 2, name: 'Brasil' }
      ]
      api.get.mockResolvedValueOnce({ data: mockCountries })

      const result = await countryService.getRandomCountries()

      expect(api.get).toHaveBeenCalledWith('/countries/random', { params: { count: 5 } })
      expect(result).toEqual(mockCountries)
    })

    it('obtiene cantidad personalizada de países aleatorios', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await countryService.getRandomCountries(10)

      expect(api.get).toHaveBeenCalledWith('/countries/random', { params: { count: 10 } })
    })
  })

  // === TESTS DE ERRORES ===
  describe('Manejo de errores', () => {
    it('getAllCountries - propaga error de red', async () => {
      const error = new Error('Network Error')
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.getAllCountries()).rejects.toThrow('Network Error')
    })

    it('getCountryById - propaga error 404', async () => {
      const error = { response: { status: 404, data: { message: 'País no encontrado' } } }
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.getCountryById(999)).rejects.toEqual(error)
    })

    it('getCountryByIsoCode - propaga error cuando código no existe', async () => {
      const error = { response: { status: 404 } }
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.getCountryByIsoCode('XX')).rejects.toEqual(error)
    })

    it('searchCountries - retorna array vacío para búsqueda sin resultados', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      const result = await countryService.searchCountries('paisinexistente')

      expect(result).toEqual([])
    })

    it('getCountriesByContinent - propaga error para continente inválido', async () => {
      const error = { response: { status: 400, data: { message: 'Continente inválido' } } }
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.getCountriesByContinent('Invalid')).rejects.toEqual(error)
    })

    it('getAllContinents - propaga error de servidor', async () => {
      const error = { response: { status: 500 } }
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.getAllContinents()).rejects.toEqual(error)
    })

    it('getCountryStats - propaga error de autorización', async () => {
      const error = { response: { status: 401 } }
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.getCountryStats()).rejects.toEqual(error)
    })

    it('getRandomCountries - maneja cantidad cero', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await countryService.getRandomCountries(0)

      expect(api.get).toHaveBeenCalledWith('/countries/random', { params: { count: 0 } })
    })
  })
})


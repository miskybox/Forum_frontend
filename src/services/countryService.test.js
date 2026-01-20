import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAllCountries - GET /countries', () => {
    it('obtiene todos los países exitosamente', async () => {
      const mockCountries = [
        { id: 1, name: 'España', isoCode: 'ES', continent: 'Europe' },
        { id: 2, name: 'Francia', isoCode: 'FR', continent: 'Europe' },
        { id: 3, name: 'Japón', isoCode: 'JP', continent: 'Asia' }
      ]
      api.get.mockResolvedValueOnce({ data: mockCountries })

      const result = await countryService.getAllCountries()

      expect(api.get).toHaveBeenCalledWith('/countries')
      expect(result).toEqual(mockCountries)
      expect(result).toHaveLength(3)
    })

    it('retorna array vacío cuando no hay países', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      const result = await countryService.getAllCountries()

      expect(result).toEqual([])
    })

    it('maneja error de red', async () => {
      const error = new Error('Network Error')
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.getAllCountries()).rejects.toThrow('Network Error')
    })
  })

  describe('getCountryById - GET /countries/:id', () => {
    it('obtiene un país por ID exitosamente', async () => {
      const mockCountry = { id: 1, name: 'España', isoCode: 'ES', capital: 'Madrid', continent: 'Europe' }
      api.get.mockResolvedValueOnce({ data: mockCountry })

      const result = await countryService.getCountryById(1)

      expect(api.get).toHaveBeenCalledWith('/countries/1')
      expect(result).toEqual(mockCountry)
    })

    it('acepta ID como string', async () => {
      const mockCountry = { id: 5, name: 'Italia', isoCode: 'IT' }
      api.get.mockResolvedValueOnce({ data: mockCountry })

      const result = await countryService.getCountryById('5')

      expect(api.get).toHaveBeenCalledWith('/countries/5')
      expect(result).toEqual(mockCountry)
    })

    it('maneja error 404 cuando país no existe', async () => {
      const error = { response: { status: 404, data: { message: 'País no encontrado' } } }
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.getCountryById(999)).rejects.toEqual(error)
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
    it('busca países por nombre exitosamente', async () => {
      const mockResults = [
        { id: 1, name: 'España', isoCode: 'ES' },
        { id: 2, name: 'Estados Unidos', isoCode: 'US' }
      ]
      api.get.mockResolvedValueOnce({ data: mockResults })

      const result = await countryService.searchCountries('Espa')

      expect(api.get).toHaveBeenCalledWith('/countries/search', { params: { q: 'Espa' } })
      expect(result).toEqual(mockResults)
      expect(result).toHaveLength(2)
    })

    it('retorna array vacío para búsqueda sin resultados', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      const result = await countryService.searchCountries('paisinexistente')

      expect(result).toEqual([])
    })

    it('maneja búsqueda con caracteres especiales', async () => {
      const mockResults = [{ id: 1, name: 'São Tomé and Príncipe' }]
      api.get.mockResolvedValueOnce({ data: mockResults })

      await countryService.searchCountries('São')

      expect(api.get).toHaveBeenCalledWith('/countries/search', { params: { q: 'São' } })
    })

    it('maneja error de red durante búsqueda', async () => {
      const error = new Error('Network Error')
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.searchCountries('test')).rejects.toThrow('Network Error')
    })
  })

  describe('getCountriesByContinent - GET /countries/continent/:continent', () => {
    it('obtiene países de un continente exitosamente', async () => {
      const mockCountries = [
        { id: 1, name: 'España', continent: 'Europe', isoCode: 'ES' },
        { id: 2, name: 'Francia', continent: 'Europe', isoCode: 'FR' },
        { id: 3, name: 'Italia', continent: 'Europe', isoCode: 'IT' }
      ]
      api.get.mockResolvedValueOnce({ data: mockCountries })

      const result = await countryService.getCountriesByContinent('Europe')

      expect(api.get).toHaveBeenCalledWith('/countries/continent/Europe')
      expect(result).toEqual(mockCountries)
      expect(result).toHaveLength(3)
    })

    it('obtiene países de Asia', async () => {
      const mockCountries = [{ id: 1, name: 'Japón', continent: 'Asia' }]
      api.get.mockResolvedValueOnce({ data: mockCountries })

      const result = await countryService.getCountriesByContinent('Asia')

      expect(api.get).toHaveBeenCalledWith('/countries/continent/Asia')
      expect(result).toHaveLength(1)
    })

    it('retorna array vacío para continente sin países', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      const result = await countryService.getCountriesByContinent('Antarctica')

      expect(result).toEqual([])
    })

    it('maneja error 400 para continente inválido', async () => {
      const error = { response: { status: 400, data: { message: 'Continente inválido' } } }
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.getCountriesByContinent('Invalid')).rejects.toEqual(error)
    })
  })

  describe('getAllContinents - GET /countries/continents', () => {
    it('obtiene lista de continentes exitosamente', async () => {
      const mockContinents = ['Africa', 'Asia', 'Europe', 'North America', 'Oceania', 'South America']
      api.get.mockResolvedValueOnce({ data: mockContinents })

      const result = await countryService.getAllContinents()

      expect(api.get).toHaveBeenCalledWith('/countries/continents')
      expect(result).toEqual(mockContinents)
      expect(result).toHaveLength(6)
    })

    it('maneja error de servidor', async () => {
      const error = { response: { status: 500, data: { message: 'Error interno' } } }
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.getAllContinents()).rejects.toEqual(error)
    })
  })

  describe('getCountryStats - GET /countries/stats', () => {
    it('obtiene estadísticas globales exitosamente', async () => {
      const mockStats = {
        totalCountries: 195,
        totalContinents: 6,
        mostPopulated: 'China',
        totalVisitors: 15000
      }
      api.get.mockResolvedValueOnce({ data: mockStats })

      const result = await countryService.getCountryStats()

      expect(api.get).toHaveBeenCalledWith('/countries/stats')
      expect(result).toEqual(mockStats)
      expect(result.totalCountries).toBe(195)
    })

    it('maneja error de autorización', async () => {
      const error = { response: { status: 401, data: { message: 'No autorizado' } } }
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.getCountryStats()).rejects.toEqual(error)
    })
  })

  describe('getRandomCountries - GET /countries/random', () => {
    it('obtiene países aleatorios con cantidad por defecto', async () => {
      const mockCountries = [
        { id: 1, name: 'Japón', isoCode: 'JP' },
        { id: 2, name: 'Brasil', isoCode: 'BR' },
        { id: 3, name: 'Canadá', isoCode: 'CA' },
        { id: 4, name: 'Australia', isoCode: 'AU' },
        { id: 5, name: 'Egipto', isoCode: 'EG' }
      ]
      api.get.mockResolvedValueOnce({ data: mockCountries })

      const result = await countryService.getRandomCountries()

      expect(api.get).toHaveBeenCalledWith('/countries/random', { params: { count: 5 } })
      expect(result).toEqual(mockCountries)
      expect(result).toHaveLength(5)
    })

    it('obtiene cantidad personalizada de países aleatorios', async () => {
      const mockCountries = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `País ${i + 1}`
      }))
      api.get.mockResolvedValueOnce({ data: mockCountries })

      const result = await countryService.getRandomCountries(10)

      expect(api.get).toHaveBeenCalledWith('/countries/random', { params: { count: 10 } })
      expect(result).toHaveLength(10)
    })

    it('maneja cantidad cero', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      const result = await countryService.getRandomCountries(0)

      expect(api.get).toHaveBeenCalledWith('/countries/random', { params: { count: 0 } })
      expect(result).toEqual([])
    })

    it('maneja error de servidor', async () => {
      const error = { response: { status: 500, data: { message: 'Error al generar aleatorios' } } }
      api.get.mockRejectedValueOnce(error)

      await expect(countryService.getRandomCountries(5)).rejects.toEqual(error)
    })
  })
})


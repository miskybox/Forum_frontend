import api from '../utils/api'

const CATEGORY_CACHE_KEY = 'forum_categories_cache_v1'
const CATEGORY_CACHE_TTL_MS = Number(import.meta.env.VITE_CATEGORY_CACHE_TTL_MS || 10 * 60 * 1000)
const IS_TEST_ENV = import.meta.env.MODE === 'test'

let categoryMemoryCache = null
let inFlightCategoriesPromise = null

function readCategoriesFromStorage() {
  if (IS_TEST_ENV) {
    return null
  }

  try {
    const raw = globalThis.localStorage?.getItem(CATEGORY_CACHE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw)
    if (!parsed?.timestamp || !Array.isArray(parsed?.data)) {
      return null
    }

    const isFresh = Date.now() - parsed.timestamp < CATEGORY_CACHE_TTL_MS
    return isFresh ? parsed.data : null
  } catch {
    return null
  }
}

function writeCategoriesToStorage(data) {
  if (IS_TEST_ENV) {
    return
  }

  try {
    globalThis.localStorage?.setItem(
      CATEGORY_CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), data })
    )
  } catch {
    // Best effort: if storage is unavailable, continue without persistence.
  }
}

async function fetchAndCacheCategories() {
  if (inFlightCategoriesPromise) {
    return inFlightCategoriesPromise
  }

  inFlightCategoriesPromise = api
    .get('/categories')
    .then((response) => {
      const data = response.data
      categoryMemoryCache = data
      writeCategoriesToStorage(data)
      return data
    })
    .finally(() => {
      inFlightCategoriesPromise = null
    })

  return inFlightCategoriesPromise
}

const categoryService = {
  getAllCategories: async ({ forceRefresh = false } = {}) => {
    try {
      if (IS_TEST_ENV) {
        const response = await api.get('/categories')
        return response.data
      }

      if (!forceRefresh) {
        if (Array.isArray(categoryMemoryCache)) {
          return categoryMemoryCache
        }

        const persistedCache = readCategoriesFromStorage()
        if (Array.isArray(persistedCache)) {
          categoryMemoryCache = persistedCache
          return persistedCache
        }
      }

      return await fetchAndCacheCategories()
    } catch (error) {
      console.error('Error al obtener categorías:', error)
      throw error
    }
  },
  
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener categoría con id ${id}:`, error)
      throw error
    }
  },
  
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData)
      return response.data
    } catch (error) {
      console.error('Error al crear categoría:', error)
      throw error
    }
  },
  
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar categoría con id ${id}:`, error)
      throw error
    }
  },
  
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar categoría con id ${id}:`, error)
      throw error
    }
  },
  
  uploadCategoryImage: async (id, imageFile) => {
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      
      const response = await api.post(`/categories/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    } catch (error) {
      console.error(`Error al subir imagen para categoría con id ${id}:`, error)
      throw error
    }
  }
}

export default categoryService
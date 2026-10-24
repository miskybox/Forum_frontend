import api from '../utils/api'

const tagService = {
  getPopular: async (limit = 8) => {
    const response = await api.get('/tags/popular', { params: { limit } })
    return Array.isArray(response.data) ? response.data : []
  },
}

export default tagService

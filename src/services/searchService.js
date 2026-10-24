import api from '../utils/api'

const searchService = {
  search: async (query) => {
    const response = await api.get('/search', { params: { q: query } })
    return response.data
  },
}

export default searchService

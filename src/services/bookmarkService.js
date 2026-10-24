import api from '../utils/api'

const bookmarkService = {
  add: async (postId) => {
    await api.post(`/posts/${postId}/bookmark`)
  },
  remove: async (postId) => {
    await api.delete(`/posts/${postId}/bookmark`)
  },
  list: async (page = 0, size = 20) => {
    const response = await api.get('/users/me/bookmarks', { params: { page, size } })
    return response.data
  },
}

export default bookmarkService

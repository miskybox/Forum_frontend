import api from '../utils/api'

const likeService = {
  toggleLike: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`)
    return response.data
  },

  getLikeStatus: async (postId) => {
    const response = await api.get(`/posts/${postId}/like`)
    return response.data
  },

  getLikeCount: async (postId) => {
    const response = await api.get(`/posts/${postId}/like/count`)
    return response.data
  }
}

export default likeService

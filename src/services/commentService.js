// Archivo: src/services/commentService.js
import api from '../utils/api'

const commentService = {
  getAllComments: async () => {
    const response = await api.get('/comments')
    return response.data
  },
  
  getCommentById: async (id) => {
    const response = await api.get(`/comments/${id}`)
    return response.data
  },
  
  getCommentsByPost: async (postId) => {
    const response = await api.get(`/comments/post/${postId}`)
    return response.data
  },
  
  createComment: async (postId, commentData) => {
    const response = await api.post(`/comments/post/${postId}`, commentData)
    return response.data
  },
  
  updateComment: async (id, commentData) => {
    const response = await api.put(`/comments/${id}`, commentData)
    return response.data
  },
  
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`)
    return response.data
  }
}

export default commentService
// Archivo: src/services/postService.js
import api from '../utils/api'

const postService = {
  getAllPosts: async (page = 0, size = 10) => {
    const response = await api.get('/posts', {
      params: { page, size }
    })
    return response.data
  },
  
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`)
    return response.data
  },
  
  getPostsByForum: async (forumId) => {
    const response = await api.get(`/posts/forum/${forumId}`)
    return response.data
  },
  
  createPost: async (postData) => {
    const response = await api.post('/posts', postData)
    return response.data
  },
  
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData)
    return response.data
  },
  
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`)
    return response.data
  },
  
  uploadPostImages: async (id, imageFiles) => {
    const formData = new FormData()
    
    // Manejar múltiples archivos
    imageFiles.forEach((file) => {
      formData.append('files', file)
    })
    
    const response = await api.post(`/posts/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  },
  
  deletePostImage: async (postId, imageId) => {
    const response = await api.delete(`/posts/${postId}/images/${imageId}`)
    return response.data
  },
  
  getCurrentUserPosts: async () => {
    const response = await api.get('/posts/user')
    return response.data
  }
}

export default postService
// Archivo: src/services/forumService.js
import api from '../utils/api'

const forumService = {
  getAllForums: async (page = 0, size = 10) => {
    const response = await api.get('/forums', {
      params: { page, size }
    })
    return response.data
  },
  
  getForumById: async (id) => {
    const response = await api.get(`/forums/${id}`)
    return response.data
  },
  
  getForumsByCategory: async (categoryId) => {
    const response = await api.get(`/forums/category/${categoryId}`)
    return response.data
  },
  
  searchForums: async (keyword) => {
    const response = await api.get('/forums/search', {
      params: { keyword }
    })
    return response.data
  },
  
  createForum: async (forumData) => {
    const response = await api.post('/forums', forumData)
    return response.data
  },
  
  updateForum: async (id, forumData) => {
    const response = await api.put(`/forums/${id}`, forumData)
    return response.data
  },
  
  deleteForum: async (id) => {
    const response = await api.delete(`/forums/${id}`)
    return response.data
  },
  
  uploadForumImage: async (id, imageFile) => {
    const formData = new FormData()
    formData.append('file', imageFile)
    
    const response = await api.post(`/forums/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  },
  
  getCurrentUserForums: async () => {
    const response = await api.get('/forums/user')
    return response.data
  }
}

export default forumService
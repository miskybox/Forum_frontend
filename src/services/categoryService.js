// Archivo: src/services/categoryService.js
import api from '../utils/api'

const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories')
    return response.data
  },
  
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },
  
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData)
    return response.data
  },
  
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData)
    return response.data
  },
  
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  },
  
  uploadCategoryImage: async (id, imageFile) => {
    const formData = new FormData()
    formData.append('file', imageFile)
    
    const response = await api.post(`/categories/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    return response.data
  }
}

export default categoryService
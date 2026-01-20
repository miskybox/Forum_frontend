import api from '../utils/api'

const forumService = {
  getAllForums: async (page = 0, size = 10) => {
    try {
      const response = await api.get('/forums', {
        params: { page, size }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener foros:', error)
      throw error
    }
  },
  
  getForumById: async (id) => {
    try {
      const response = await api.get(`/forums/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener foro con id ${id}:`, error)
      throw error
    }
  },
  
  getForumsByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/forums/category/${categoryId}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener foros de la categoría con id ${categoryId}:`, error)
      throw error
    }
  },
  
  searchForums: async (keyword) => {
    try {
      const response = await api.get('/forums/search', {
        params: { keyword }
      })
      return response.data
    } catch (error) {
      console.error(`Error al buscar foros con palabra clave "${keyword}":`, error)
      throw error
    }
  },
  
  createForum: async (forumData) => {
    try {
      const response = await api.post('/forums', forumData)
      return response.data
    } catch (error) {
      console.error('Error al crear foro:', error)
      throw error
    }
  },
  
  updateForum: async (id, forumData) => {
    try {
      const response = await api.put(`/forums/${id}`, forumData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar foro con id ${id}:`, error)
      throw error
    }
  },
  
  deleteForum: async (id) => {
    try {
      const response = await api.delete(`/forums/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar foro con id ${id}:`, error)
      throw error
    }
  },
  
  uploadForumImage: async (id, imageFile) => {
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      
      const response = await api.post(`/forums/${id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    } catch (error) {
      console.error(`Error al subir imagen para foro con id ${id}:`, error)
      throw error
    }
  },
  
  getCurrentUserForums: async () => {
    try {
      const response = await api.get('/forums/user')
      return response.data
    } catch (error) {
      console.error('Error al obtener foros del usuario actual:', error)
      throw error
    }
  },

  updateForumStatus: async (id, status) => {
    try {
      const response = await api.put(`/forums/${id}/status`, null, {
        params: { status }
      })
      return response.data
    } catch (error) {
      console.error(`Error al actualizar estado del foro con id ${id}:`, error)
      throw error
    }
  },

  hideForum: async (id) => {
    try {
      const response = await api.put(`/forums/${id}/status`, null, {
        params: { status: 'HIDDEN' }
      })
      return response.data
    } catch (error) {
      console.error(`Error al ocultar foro con id ${id}:`, error)
      throw error
    }
  },

  showForum: async (id) => {
    try {
      const response = await api.put(`/forums/${id}/status`, null, {
        params: { status: 'ACTIVE' }
      })
      return response.data
    } catch (error) {
      console.error(`Error al mostrar foro con id ${id}:`, error)
      throw error
    }
  }
}

export default forumService
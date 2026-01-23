import api from '../utils/api'

const userService = {
  getAllUsers: async (page = 0, size = 20) => {
    try {
      const response = await api.get('/users', {
        params: { page, size }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      throw error
    }
  },

  searchUsers: async (query, page = 0, size = 20) => {
    try {
      const response = await api.get('/users/search', {
        params: { q: query, page, size }
      })
      return response.data
    } catch (error) {
      console.error('Error al buscar usuarios:', error)
      throw error
    }
  },
  
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener usuario con id ${id}:`, error)
      throw error
    }
  },
  
  createUser: async (userData, roles) => {
    try {
      const response = await api.post('/users', userData, {
        params: { roles }
      })
      return response.data
    } catch (error) {
      console.error('Error al crear usuario:', error)
      throw error
    }
  },
  
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar usuario con id ${id}:`, error)
      throw error
    }
  },
  
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar usuario con id ${id}:`, error)
      throw error
    }
  },
  
  changePassword: async (id, currentPassword, newPassword) => {
    try {
      // La API espera parámetros vía query según los tests
      const response = await api.put(
        `/users/${id}/change-password`,
        null,
        {
          params: { currentPassword, newPassword }
        }
      )
      return response.data
    } catch (error) {
      console.error(`Error al cambiar contraseña del usuario con id ${id}:`, error)
      throw error
    }
  },
  
  updateUserRoles: async (id, roles) => {
    try {
      const response = await api.put(`/users/${id}/roles`, roles)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar roles del usuario con id ${id}:`, error)
      throw error
    }
  },

  updateUserStatus: async (id, status) => {
    try {
      const response = await api.put(`/users/${id}/status`, null, {
        params: { status }
      })
      return response.data
    } catch (error) {
      console.error(`Error al actualizar estado del usuario con id ${id}:`, error)
      throw error
    }
  },

  blockUser: async (id) => {
    try {
      const response = await api.put(`/users/${id}/status`, null, {
        params: { status: 'BANNED' }
      })
      return response.data
    } catch (error) {
      console.error(`Error al bloquear usuario con id ${id}:`, error)
      throw error
    }
  },

  unblockUser: async (id) => {
    try {
      const response = await api.put(`/users/${id}/status`, null, {
        params: { status: 'ACTIVE' }
      })
      return response.data
    } catch (error) {
      console.error(`Error al desbloquear usuario con id ${id}:`, error)
      throw error
    }
  }
}

export default userService
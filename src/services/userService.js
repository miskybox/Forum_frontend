// Archivo: src/services/userService.js
import api from '../utils/api'

const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users')
    return response.data
  },
  
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },
  
  createUser: async (userData, roles) => {
    const response = await api.post('/users', userData, {
      params: { roles }
    })
    return response.data
  },
  
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },
  
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
  
  changePassword: async (id, currentPassword, newPassword) => {
    const response = await api.put(`/users/${id}/change-password`, null, {
      params: { currentPassword, newPassword }
    })
    return response.data
  }
}

export default userService
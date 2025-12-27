import api from '../utils/api'

const roleService = {
  getAllRoles: async () => {
    try {
      const response = await api.get('/roles')
      return response.data
    } catch (error) {
      console.error('Error al obtener roles:', error)
      throw error
    }
  },
  
  getRoleById: async (id) => {
    try {
      const response = await api.get(`/roles/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al obtener rol con id ${id}:`, error)
      throw error
    }
  },
  
  createRole: async (roleData) => {
    try {
      const response = await api.post('/roles', roleData)
      return response.data
    } catch (error) {
      console.error('Error al crear rol:', error)
      throw error
    }
  },
  
  updateRole: async (id, roleData) => {
    try {
      const response = await api.put(`/roles/${id}`, roleData)
      return response.data
    } catch (error) {
      console.error(`Error al actualizar rol con id ${id}:`, error)
      throw error
    }
  },
  
  deleteRole: async (id) => {
    try {
      const response = await api.delete(`/roles/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error al eliminar rol con id ${id}:`, error)
      throw error
    }
  }
}

export default roleService


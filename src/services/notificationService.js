import api from '../utils/api'

const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications')
    return response.data
  },
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread-count')
      return response.data
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return 0
      }
      throw error
    }
  },
  markAsRead: async (id) => {
    const response = await api.post(`/notifications/${id}/read`)
    return response.data
  },
  markAllAsRead: async () => {
    const response = await api.post('/notifications/mark-all-read')
    return response.data
  }
}

export default notificationService

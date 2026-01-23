import api from '../utils/api'

const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications')
    return response.data
  },
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count')
    return response.data
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

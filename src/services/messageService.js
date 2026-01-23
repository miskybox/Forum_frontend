import api from '../utils/api'

/**
 * Service for private messaging functionality
 */
const messageService = {
  /**
   * Send a private message to a user
   * @param {number} recipientId - ID of the recipient
   * @param {string} content - Message content
   */
  sendMessage: async (recipientId, content) => {
    const response = await api.post('/messages', {
      recipientId,
      content
    })
    return response.data
  },

  /**
   * Get all conversations for the current user
   */
  getConversations: async () => {
    const response = await api.get('/messages/conversations')
    return response.data
  },

  /**
   * Get full conversation with a specific user
   * @param {number} userId - ID of the other user
   */
  getConversation: async (userId) => {
    const response = await api.get(`/messages/conversation/${userId}`)
    return response.data
  },

  /**
   * Get paginated conversation with a specific user
   * @param {number} userId - ID of the other user
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Page size
   */
  getConversationPaged: async (userId, page = 0, size = 20) => {
    const response = await api.get(`/messages/conversation/${userId}/paged`, {
      params: { page, size }
    })
    return response.data
  },

  /**
   * Mark all messages in a conversation as read
   * @param {number} userId - ID of the other user
   */
  markConversationAsRead: async (userId) => {
    await api.put(`/messages/conversation/${userId}/read`)
  },

  /**
   * Get unread message count
   */
  getUnreadCount: async () => {
    const response = await api.get('/messages/unread-count')
    return response.data
  },

  /**
   * Delete a message (only sender can delete)
   * @param {number} messageId - ID of the message
   */
  deleteMessage: async (messageId) => {
    await api.delete(`/messages/${messageId}`)
  }
}

export default messageService

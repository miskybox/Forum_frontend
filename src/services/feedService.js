import api from '../utils/api'

/**
 * Service for feed functionality
 */
const feedService = {
  /**
   * Get feed from users that the current user follows
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Page size
   */
  getFollowingFeed: async (page = 0, size = 10) => {
    const response = await api.get('/feed/following', {
      params: { page, size }
    })
    return response.data
  },

  /**
   * Get global/explore feed with recent posts
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Page size
   */
  getExploreFeed: async (page = 0, size = 10) => {
    const response = await api.get('/feed/explore', {
      params: { page, size }
    })
    return response.data
  }
}

export default feedService

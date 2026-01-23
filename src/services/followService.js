import api from '../utils/api'

/**
 * Service for follow/follower functionality
 */
const followService = {
  /**
   * Follow a user
   * @param {number} userId - ID of the user to follow
   */
  followUser: async (userId) => {
    await api.post(`/users/${userId}/follow`)
  },

  /**
   * Unfollow a user
   * @param {number} userId - ID of the user to unfollow
   */
  unfollowUser: async (userId) => {
    await api.delete(`/users/${userId}/unfollow`)
  },

  /**
   * Get followers of a user
   * @param {number} userId - ID of the user
   */
  getFollowers: async (userId) => {
    const response = await api.get(`/users/${userId}/followers`)
    return response.data
  },

  /**
   * Get paginated followers of a user
   * @param {number} userId - ID of the user
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Page size
   */
  getFollowersPaged: async (userId, page = 0, size = 20) => {
    const response = await api.get(`/users/${userId}/followers/paged`, {
      params: { page, size }
    })
    return response.data
  },

  /**
   * Get users that a user follows
   * @param {number} userId - ID of the user
   */
  getFollowing: async (userId) => {
    const response = await api.get(`/users/${userId}/following`)
    return response.data
  },

  /**
   * Get paginated users that a user follows
   * @param {number} userId - ID of the user
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Page size
   */
  getFollowingPaged: async (userId, page = 0, size = 20) => {
    const response = await api.get(`/users/${userId}/following/paged`, {
      params: { page, size }
    })
    return response.data
  },

  /**
   * Get follow statistics for a user
   * @param {number} userId - ID of the user
   */
  getFollowStats: async (userId) => {
    const response = await api.get(`/users/${userId}/follow-stats`)
    return response.data
  },

  /**
   * Check if current user is following another user
   * @param {number} userId - ID of the user to check
   */
  isFollowing: async (userId) => {
    const response = await api.get(`/users/${userId}/is-following`)
    return response.data
  },

  /**
   * Get suggested users to follow
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Page size
   */
  getSuggestedUsers: async (page = 0, size = 10) => {
    const response = await api.get('/users/suggestions', {
      params: { page, size }
    })
    return response.data
  },

  /**
   * Get mutual follows (users who follow each other)
   */
  getMutualFollows: async () => {
    const response = await api.get('/users/mutuals')
    return response.data
  }
}

export default followService

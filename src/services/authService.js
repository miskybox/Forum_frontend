import api from '../utils/api'

const authService = {

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    const { accessToken, refreshToken } = response.data

    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    return response.data
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('No hay token disponible')
    }

    const response = await api.get('/users/me')
    return response.data
  },

  async logout() {
    const refreshToken = localStorage.getItem('refreshToken')

    try {
      await api.post(
        '/auth/logout',
        null,
        refreshToken
          ? {
              headers: {
                'Refresh-Token': refreshToken,
              },
            }
          : undefined
      )
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
    }
  },

  async refreshToken(refreshToken) {
    const response = await api.post(
      '/auth/refresh',
      { refreshToken },
      {
        headers: {
          'Refresh-Token': refreshToken,
        },
      }
    )

    const { accessToken, refreshToken: newRefreshToken } = response.data

    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', newRefreshToken)

    return response.data
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },
}

export default authService
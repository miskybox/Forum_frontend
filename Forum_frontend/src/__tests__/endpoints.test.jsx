import { describe, it, expect, vi, beforeEach } from 'vitest'
import forumService from '../services/forumService'
import postService from '../services/postService'
import authService from '../services/authService'
import triviaService from '../services/triviaService'
import travelService from '../services/travelService'
import categoryService from '../services/categoryService'
import commentService from '../services/commentService'
import userService from '../services/userService'
import countryService from '../services/countryService'
import api from '../utils/api'

// Mock del módulo api
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}))

describe('Endpoints - Verificación Completa de Llamadas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Auth Endpoints', () => {
    it('POST /auth/register - registra usuario', async () => {
      const userData = { username: 'test', email: 'test@test.com', password: 'pass123' }
      api.post.mockResolvedValueOnce({ data: { id: 1 } })

      await authService.register(userData)

      expect(api.post).toHaveBeenCalledWith('/auth/register', userData)
    })

    it('POST /auth/login - inicia sesión', async () => {
      const credentials = { username: 'test', password: 'pass123' }
      api.post.mockResolvedValueOnce({ data: { accessToken: 'token' } })

      await authService.login(credentials)

      expect(api.post).toHaveBeenCalledWith('/auth/login', credentials)
    })

    it('GET /users/me - obtiene usuario actual', async () => {
      api.get.mockResolvedValueOnce({ data: { id: 1 } })
      localStorage.setItem('token', 'test-token')

      await authService.getCurrentUser()

      expect(api.get).toHaveBeenCalledWith('/users/me')
    })

    it('POST /auth/logout - cierra sesión', async () => {
      api.post.mockResolvedValueOnce({})

      await authService.logout()

      expect(api.post).toHaveBeenCalledWith('/auth/logout')
    })
  })

  describe('Forum Endpoints', () => {
    it('GET /forums - obtiene lista de foros', async () => {
      api.get.mockResolvedValueOnce({ data: { content: [] } })

      await forumService.getAllForums()

      expect(api.get).toHaveBeenCalledWith('/forums', { params: { page: 0, size: 10 } })
    })

    it('GET /forums/:id - obtiene foro por ID', async () => {
      api.get.mockResolvedValueOnce({ data: { id: 1 } })

      await forumService.getForumById(1)

      expect(api.get).toHaveBeenCalledWith('/forums/1')
    })

    it('POST /forums - crea foro', async () => {
      const forumData = { title: 'Test', description: 'Test' }
      api.post.mockResolvedValueOnce({ data: { id: 1 } })

      await forumService.createForum(forumData)

      expect(api.post).toHaveBeenCalledWith('/forums', forumData)
    })

    it('PUT /forums/:id - actualiza foro', async () => {
      const forumData = { title: 'Updated' }
      api.put.mockResolvedValueOnce({ data: { id: 1 } })

      await forumService.updateForum(1, forumData)

      expect(api.put).toHaveBeenCalledWith('/forums/1', forumData)
    })

    it('DELETE /forums/:id - elimina foro', async () => {
      api.delete.mockResolvedValueOnce({ data: {} })

      await forumService.deleteForum(1)

      expect(api.delete).toHaveBeenCalledWith('/forums/1')
    })

    it('GET /forums/category/:categoryId - obtiene foros por categoría', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await forumService.getForumsByCategory(5)

      expect(api.get).toHaveBeenCalledWith('/forums/category/5')
    })

    it('GET /forums/search - busca foros', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await forumService.searchForums('test')

      expect(api.get).toHaveBeenCalledWith('/forums/search', { params: { keyword: 'test' } })
    })
  })

  describe('Post Endpoints', () => {
    it('GET /posts - obtiene lista de posts', async () => {
      api.get.mockResolvedValueOnce({ data: { content: [] } })

      await postService.getAllPosts()

      expect(api.get).toHaveBeenCalledWith('/posts', { params: { page: 0, size: 10 } })
    })

    it('GET /posts/:id - obtiene post por ID', async () => {
      api.get.mockResolvedValueOnce({ data: { id: 1 } })

      await postService.getPostById(1)

      expect(api.get).toHaveBeenCalledWith('/posts/1')
    })

    it('GET /posts/forum/:forumId - obtiene posts de foro', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await postService.getPostsByForum(1)

      expect(api.get).toHaveBeenCalledWith('/posts/forum/1')
    })

    it('POST /posts - crea post', async () => {
      const postData = { title: 'Test', content: 'Test' }
      api.post.mockResolvedValueOnce({ data: { id: 1 } })

      await postService.createPost(postData)

      expect(api.post).toHaveBeenCalledWith('/posts', postData)
    })

    it('PUT /posts/:id - actualiza post', async () => {
      const postData = { title: 'Updated' }
      api.put.mockResolvedValueOnce({ data: { id: 1 } })

      await postService.updatePost(1, postData)

      expect(api.put).toHaveBeenCalledWith('/posts/1', postData)
    })

    it('DELETE /posts/:id - elimina post', async () => {
      api.delete.mockResolvedValueOnce({ data: {} })

      await postService.deletePost(1)

      expect(api.delete).toHaveBeenCalledWith('/posts/1')
    })
  })

  describe('Trivia Endpoints', () => {
    it('POST /trivia/games - inicia partida', async () => {
      const options = { gameMode: 'QUICK', totalQuestions: 10 }
      api.post.mockResolvedValueOnce({ data: { id: 1 } })

      await triviaService.startGame(options)

      expect(api.post).toHaveBeenCalledWith('/trivia/games', options)
    })

    it('GET /trivia/games/:gameId - obtiene estado de partida', async () => {
      api.get.mockResolvedValueOnce({ data: { id: 1 } })

      await triviaService.getGameStatus(1)

      expect(api.get).toHaveBeenCalledWith('/trivia/games/1')
    })

    it('POST /trivia/games/answer - responde pregunta', async () => {
      const answer = { gameId: 1, questionId: 1, selectedAnswer: 'A' }
      api.post.mockResolvedValueOnce({ data: { correct: true } })

      await triviaService.answerQuestion(answer)

      expect(api.post).toHaveBeenCalledWith('/trivia/games/answer', answer)
    })

    it('GET /trivia/leaderboard - obtiene ranking', async () => {
      api.get.mockResolvedValueOnce({ data: { content: [] } })

      await triviaService.getLeaderboard()

      expect(api.get).toHaveBeenCalledWith('/trivia/leaderboard', { params: { type: 'score', page: 0, size: 20 } })
    })

    it('GET /trivia/my-score - obtiene mis estadísticas', async () => {
      api.get.mockResolvedValueOnce({ data: { totalScore: 100 } })

      await triviaService.getMyScore()

      expect(api.get).toHaveBeenCalledWith('/trivia/my-score')
    })
  })

  describe('Travel Endpoints', () => {
    it('POST /travel/places - añade lugar', async () => {
      const placeData = { countryId: 'ES', city: 'Madrid' }
      api.post.mockResolvedValueOnce({ data: { id: 1 } })

      await travelService.addPlace(placeData)

      expect(api.post).toHaveBeenCalledWith('/travel/places', placeData)
    })

    it('GET /travel/my-places - obtiene mis lugares', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await travelService.getMyPlaces()

      expect(api.get).toHaveBeenCalledWith('/travel/my-places')
    })

    it('GET /travel/my-stats - obtiene mis estadísticas', async () => {
      api.get.mockResolvedValueOnce({ data: { countriesVisited: 5 } })

      await travelService.getMyStats()

      expect(api.get).toHaveBeenCalledWith('/travel/my-stats')
    })

    it('GET /travel/ranking - obtiene ranking', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await travelService.getRanking()

      expect(api.get).toHaveBeenCalledWith('/travel/ranking', { params: { limit: 10 } })
    })
  })

  describe('Category Endpoints', () => {
    it('GET /categories - obtiene todas las categorías', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await categoryService.getAllCategories()

      expect(api.get).toHaveBeenCalledWith('/categories')
    })

    it('GET /categories/:id - obtiene categoría por ID', async () => {
      api.get.mockResolvedValueOnce({ data: { id: 1 } })

      await categoryService.getCategoryById(1)

      expect(api.get).toHaveBeenCalledWith('/categories/1')
    })
  })

  describe('Comment Endpoints', () => {
    it('GET /comments/post/:postId - obtiene comentarios de post', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await commentService.getCommentsByPost(1)

      expect(api.get).toHaveBeenCalledWith('/comments/post/1')
    })

    it('POST /comments/post/:postId - crea comentario', async () => {
      const commentData = { content: 'Test comment' }
      api.post.mockResolvedValueOnce({ data: { id: 1 } })

      await commentService.createComment(1, commentData)

      expect(api.post).toHaveBeenCalledWith('/comments/post/1', { ...commentData, postId: 1 })
    })
  })

  describe('User Endpoints', () => {
    it('GET /users/:id - obtiene usuario por ID', async () => {
      api.get.mockResolvedValueOnce({ data: { id: 1 } })

      await userService.getUserById(1)

      expect(api.get).toHaveBeenCalledWith('/users/1')
    })

    it('PUT /users/:id/change-password - cambia contraseña', async () => {
      api.put.mockResolvedValueOnce({ data: { success: true } })

      await userService.changePassword(1, 'old', 'new')

      expect(api.put).toHaveBeenCalledWith('/users/1/change-password', null, {
        params: { currentPassword: 'old', newPassword: 'new' }
      })
    })
  })

  describe('Country Endpoints', () => {
    it('GET /countries - obtiene todos los países', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await countryService.getAllCountries()

      expect(api.get).toHaveBeenCalledWith('/countries')
    })

    it('GET /countries/search - busca países', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      await countryService.searchCountries('Spain')

      expect(api.get).toHaveBeenCalledWith('/countries/search', { params: { q: 'Spain' } })
    })
  })
})


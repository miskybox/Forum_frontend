import { describe, it, expect, vi, beforeEach } from 'vitest'
import triviaService from './triviaService'
import api from '../utils/api'

// Mock del módulo api
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn()
  }
}))

describe('triviaService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // === PARTIDAS ===
  describe('startGame - POST /trivia/games', () => {
    it('inicia una nueva partida con opciones', async () => {
      const options = {
        gameMode: 'QUICK',
        totalQuestions: 10,
        difficulty: 2
      }
      const mockGame = { id: 1, ...options, status: 'IN_PROGRESS' }
      api.post.mockResolvedValueOnce({ data: mockGame })

      const result = await triviaService.startGame(options)

      expect(api.post).toHaveBeenCalledWith('/trivia/games', options)
      expect(result).toEqual(mockGame)
    })

    it('inicia partida con filtro de continente', async () => {
      const options = {
        gameMode: 'CHALLENGE',
        totalQuestions: 20,
        continent: 'Europe'
      }
      api.post.mockResolvedValueOnce({ data: { id: 2, ...options } })

      await triviaService.startGame(options)

      expect(api.post).toHaveBeenCalledWith('/trivia/games', options)
    })
  })

  describe('getGameStatus - GET /trivia/games/:gameId', () => {
    it('obtiene estado de una partida', async () => {
      const mockStatus = { 
        id: 1, 
        status: 'IN_PROGRESS', 
        currentQuestion: 5, 
        totalQuestions: 10 
      }
      api.get.mockResolvedValueOnce({ data: mockStatus })

      const result = await triviaService.getGameStatus(1)

      expect(api.get).toHaveBeenCalledWith('/trivia/games/1')
      expect(result).toEqual(mockStatus)
    })
  })

  describe('getNextQuestion - GET /trivia/games/:gameId/question', () => {
    it('obtiene siguiente pregunta de la partida', async () => {
      const mockQuestion = {
        id: 10,
        question: '¿Cuál es la capital de Francia?',
        options: ['Madrid', 'París', 'Roma', 'Berlín'],
        type: 'CAPITAL'
      }
      api.get.mockResolvedValueOnce({ data: mockQuestion })

      const result = await triviaService.getNextQuestion(1)

      expect(api.get).toHaveBeenCalledWith('/trivia/games/1/question')
      expect(result).toEqual(mockQuestion)
    })
  })

  describe('answerQuestion - POST /trivia/games/answer', () => {
    it('envía respuesta a una pregunta', async () => {
      const answer = {
        gameId: 1,
        questionId: 10,
        selectedAnswer: 'París',
        responseTimeMs: 5000,
        hintUsed: false,
        timedOut: false
      }
      const mockResult = { correct: true, points: 100 }
      api.post.mockResolvedValueOnce({ data: mockResult })

      const result = await triviaService.answerQuestion(answer)

      expect(api.post).toHaveBeenCalledWith('/trivia/games/answer', answer)
      expect(result).toEqual(mockResult)
    })

    it('envía respuesta con timeout', async () => {
      const answer = {
        gameId: 1,
        questionId: 10,
        selectedAnswer: '',
        responseTimeMs: 30000,
        timedOut: true
      }
      api.post.mockResolvedValueOnce({ data: { correct: false, points: 0 } })

      await triviaService.answerQuestion(answer)

      expect(api.post).toHaveBeenCalledWith('/trivia/games/answer', answer)
    })
  })

  describe('finishGame - POST /trivia/games/:gameId/finish', () => {
    it('finaliza una partida', async () => {
      const mockSummary = {
        id: 1,
        status: 'COMPLETED',
        totalScore: 800,
        correctAnswers: 8,
        totalQuestions: 10
      }
      api.post.mockResolvedValueOnce({ data: mockSummary })

      const result = await triviaService.finishGame(1)

      expect(api.post).toHaveBeenCalledWith('/trivia/games/1/finish')
      expect(result).toEqual(mockSummary)
    })
  })

  describe('abandonGame - DELETE /trivia/games/:gameId', () => {
    it('abandona una partida', async () => {
      api.delete.mockResolvedValueOnce({})

      await triviaService.abandonGame(1)

      expect(api.delete).toHaveBeenCalledWith('/trivia/games/1')
    })
  })

  describe('getGameHistory - GET /trivia/my-games', () => {
    it('obtiene historial de partidas con paginación', async () => {
      const mockHistory = {
        content: [
          { id: 1, score: 800, date: '2024-01-15' },
          { id: 2, score: 600, date: '2024-01-14' }
        ],
        totalPages: 5
      }
      api.get.mockResolvedValueOnce({ data: mockHistory })

      const result = await triviaService.getGameHistory(0, 10)

      expect(api.get).toHaveBeenCalledWith('/trivia/my-games', { params: { page: 0, size: 10 } })
      expect(result).toEqual(mockHistory)
    })
  })

  // === PUNTUACIONES ===
  describe('getMyScore - GET /trivia/my-score', () => {
    it('obtiene mis estadísticas', async () => {
      const mockScore = {
        totalScore: 5000,
        gamesPlayed: 20,
        accuracy: 85.5
      }
      api.get.mockResolvedValueOnce({ data: mockScore })

      const result = await triviaService.getMyScore()

      expect(api.get).toHaveBeenCalledWith('/trivia/my-score')
      expect(result).toEqual(mockScore)
    })
  })

  describe('getUserScore - GET /trivia/users/:userId/score', () => {
    it('obtiene estadísticas de otro usuario', async () => {
      const mockScore = { totalScore: 3000, gamesPlayed: 15 }
      api.get.mockResolvedValueOnce({ data: mockScore })

      const result = await triviaService.getUserScore(5)

      expect(api.get).toHaveBeenCalledWith('/trivia/users/5/score')
      expect(result).toEqual(mockScore)
    })
  })

  describe('getLeaderboard - GET /trivia/leaderboard', () => {
    it('obtiene ranking global por puntuación', async () => {
      const mockLeaderboard = {
        content: [
          { rank: 1, username: 'top1', score: 10000 },
          { rank: 2, username: 'top2', score: 9500 }
        ]
      }
      api.get.mockResolvedValueOnce({ data: mockLeaderboard })

      const result = await triviaService.getLeaderboard('score', 0, 20)

      expect(api.get).toHaveBeenCalledWith('/trivia/leaderboard', { params: { type: 'score', page: 0, size: 20 } })
      expect(result).toEqual(mockLeaderboard)
    })

    it('obtiene ranking por precisión', async () => {
      api.get.mockResolvedValueOnce({ data: { content: [] } })

      await triviaService.getLeaderboard('accuracy', 0, 10)

      expect(api.get).toHaveBeenCalledWith('/trivia/leaderboard', { params: { type: 'accuracy', page: 0, size: 10 } })
    })
  })

  describe('getMyRank - GET /trivia/my-rank', () => {
    it('obtiene mi posición en el ranking', async () => {
      const mockRank = { rank: 42, totalPlayers: 1000 }
      api.get.mockResolvedValueOnce({ data: mockRank })

      const result = await triviaService.getMyRank()

      expect(api.get).toHaveBeenCalledWith('/trivia/my-rank')
      expect(result).toEqual(mockRank)
    })
  })

  // === PREGUNTAS (PRÁCTICA) ===
  describe('getRandomQuestion - GET /trivia/questions/random', () => {
    it('obtiene una pregunta aleatoria', async () => {
      const mockQuestion = {
        id: 50,
        question: '¿En qué continente está Japón?',
        options: ['Europa', 'Asia', 'América', 'Oceanía']
      }
      api.get.mockResolvedValueOnce({ data: mockQuestion })

      const result = await triviaService.getRandomQuestion()

      expect(api.get).toHaveBeenCalledWith('/trivia/questions/random')
      expect(result).toEqual(mockQuestion)
    })
  })

  describe('checkAnswer - POST /trivia/questions/:questionId/check', () => {
    it('verifica respuesta en modo práctica', async () => {
      const mockResult = { correct: true, correctAnswer: 'Asia' }
      api.post.mockResolvedValueOnce({ data: mockResult })

      const result = await triviaService.checkAnswer(50, 'Asia')

      expect(api.post).toHaveBeenCalledWith('/trivia/questions/50/check', null, { params: { answer: 'Asia' } })
      expect(result).toEqual(mockResult)
    })

    it('verifica respuesta incorrecta', async () => {
      const mockResult = { correct: false, correctAnswer: 'Asia' }
      api.post.mockResolvedValueOnce({ data: mockResult })

      const result = await triviaService.checkAnswer(50, 'Europa')

      expect(result.correct).toBe(false)
    })
  })

  // === TESTS DE ERRORES ===
  describe('Manejo de errores', () => {
    it('startGame - propaga error de validación', async () => {
      const error = { response: { status: 400, data: { message: 'Modo de juego inválido' } } }
      api.post.mockRejectedValueOnce(error)

      await expect(triviaService.startGame({ gameMode: 'INVALID' })).rejects.toEqual(error)
    })

    it('getGameStatus - propaga error 404 si partida no existe', async () => {
      const error = { response: { status: 404 } }
      api.get.mockRejectedValueOnce(error)

      await expect(triviaService.getGameStatus(999)).rejects.toEqual(error)
    })

    it('getNextQuestion - propaga error si partida finalizada', async () => {
      const error = { response: { status: 400, data: { message: 'Partida ya finalizada' } } }
      api.get.mockRejectedValueOnce(error)

      await expect(triviaService.getNextQuestion(1)).rejects.toEqual(error)
    })

    it('answerQuestion - propaga error si ya respondida', async () => {
      const error = { response: { status: 400, data: { message: 'Pregunta ya respondida' } } }
      api.post.mockRejectedValueOnce(error)

      await expect(triviaService.answerQuestion({ gameId: 1, questionId: 1 })).rejects.toEqual(error)
    })

    it('finishGame - propaga error de autorización', async () => {
      const error = { response: { status: 403 } }
      api.post.mockRejectedValueOnce(error)

      await expect(triviaService.finishGame(1)).rejects.toEqual(error)
    })

    it('abandonGame - propaga error si partida no existe', async () => {
      const error = { response: { status: 404 } }
      api.delete.mockRejectedValueOnce(error)

      await expect(triviaService.abandonGame(999)).rejects.toEqual(error)
    })

    it('getGameHistory - usa valores por defecto correctamente', async () => {
      api.get.mockResolvedValueOnce({ data: { content: [], totalPages: 0 } })

      await triviaService.getGameHistory()

      expect(api.get).toHaveBeenCalledWith('/trivia/my-games', { params: { page: 0, size: 10 } })
    })

    it('getMyScore - propaga error de autenticación', async () => {
      const error = { response: { status: 401 } }
      api.get.mockRejectedValueOnce(error)

      await expect(triviaService.getMyScore()).rejects.toEqual(error)
    })

    it('getUserScore - propaga error 404 si usuario no existe', async () => {
      const error = { response: { status: 404 } }
      api.get.mockRejectedValueOnce(error)

      await expect(triviaService.getUserScore(999)).rejects.toEqual(error)
    })

    it('getLeaderboard - usa valores por defecto', async () => {
      api.get.mockResolvedValueOnce({ data: { content: [] } })

      await triviaService.getLeaderboard()

      expect(api.get).toHaveBeenCalledWith('/trivia/leaderboard', { params: { type: 'score', page: 0, size: 20 } })
    })

    it('getRandomQuestion - propaga error de servidor', async () => {
      const error = { response: { status: 500 } }
      api.get.mockRejectedValueOnce(error)

      await expect(triviaService.getRandomQuestion()).rejects.toEqual(error)
    })

    it('checkAnswer - propaga error si pregunta no existe', async () => {
      const error = { response: { status: 404 } }
      api.post.mockRejectedValueOnce(error)

      await expect(triviaService.checkAnswer(999, 'respuesta')).rejects.toEqual(error)
    })
  })
})


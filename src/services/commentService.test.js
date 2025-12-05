import { describe, it, expect, vi, beforeEach } from 'vitest'
import commentService from './commentService'
import api from '../utils/api'

// Mock del módulo api
vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('commentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllComments - GET /comments', () => {
    it('obtiene todos los comentarios', async () => {
      const mockComments = [
        { id: 1, content: 'Comentario 1', postId: 1 },
        { id: 2, content: 'Comentario 2', postId: 1 }
      ]
      api.get.mockResolvedValueOnce({ data: mockComments })

      const result = await commentService.getAllComments()

      expect(api.get).toHaveBeenCalledWith('/comments')
      expect(result).toEqual(mockComments)
    })
  })

  describe('getCommentById - GET /comments/:id', () => {
    it('obtiene un comentario por ID', async () => {
      const mockComment = { id: 1, content: 'Comentario Test', postId: 1 }
      api.get.mockResolvedValueOnce({ data: mockComment })

      const result = await commentService.getCommentById(1)

      expect(api.get).toHaveBeenCalledWith('/comments/1')
      expect(result).toEqual(mockComment)
    })

    it('maneja error cuando comentario no existe', async () => {
      const error = { response: { status: 404 } }
      api.get.mockRejectedValueOnce(error)

      await expect(commentService.getCommentById(999)).rejects.toEqual(error)
    })
  })

  describe('getCommentsByPost - GET /comments/post/:postId', () => {
    it('obtiene comentarios de un post específico', async () => {
      const mockComments = [
        { id: 1, content: 'Comentario', postId: 5 },
        { id: 2, content: 'Otro comentario', postId: 5 }
      ]
      api.get.mockResolvedValueOnce({ data: mockComments })

      const result = await commentService.getCommentsByPost(5)

      expect(api.get).toHaveBeenCalledWith('/comments/post/5')
      expect(result).toEqual(mockComments)
    })
  })

  describe('createComment - POST /comments/post/:postId', () => {
    it('crea un nuevo comentario en un post', async () => {
      const commentData = { content: 'Nuevo comentario' }
      const mockCreated = { id: 10, content: 'Nuevo comentario', postId: 5 }
      api.post.mockResolvedValueOnce({ data: mockCreated })

      const result = await commentService.createComment(5, commentData)

      expect(api.post).toHaveBeenCalledWith('/comments/post/5', { ...commentData, postId: 5 })
      expect(result).toEqual(mockCreated)
    })

    it('incluye postId en los datos enviados', async () => {
      const commentData = { content: 'Test' }
      api.post.mockResolvedValueOnce({ data: { id: 1 } })

      await commentService.createComment(10, commentData)

      expect(api.post).toHaveBeenCalledWith('/comments/post/10', { content: 'Test', postId: 10 })
    })
  })

  describe('updateComment - PUT /comments/:id', () => {
    it('actualiza un comentario existente', async () => {
      const commentData = { content: 'Comentario actualizado' }
      const mockUpdated = { id: 1, content: 'Comentario actualizado' }
      api.put.mockResolvedValueOnce({ data: mockUpdated })

      const result = await commentService.updateComment(1, commentData)

      expect(api.put).toHaveBeenCalledWith('/comments/1', commentData)
      expect(result).toEqual(mockUpdated)
    })
  })

  describe('deleteComment - DELETE /comments/:id', () => {
    it('elimina un comentario', async () => {
      api.delete.mockResolvedValueOnce({ data: { success: true } })

      const result = await commentService.deleteComment(1)

      expect(api.delete).toHaveBeenCalledWith('/comments/1')
      expect(result).toEqual({ success: true })
    })
  })
})


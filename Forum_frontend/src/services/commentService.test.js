import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAllComments - GET /comments', () => {
    it('obtiene todos los comentarios exitosamente', async () => {
      const mockComments = [
        { id: 1, content: 'Comentario 1', postId: 1, userId: 1 },
        { id: 2, content: 'Comentario 2', postId: 1, userId: 2 }
      ]

      api.get.mockResolvedValueOnce({ data: mockComments })

      const result = await commentService.getAllComments()

      expect(api.get).toHaveBeenCalledWith('/comments')
      expect(result).toEqual(mockComments)
    })

    it('maneja error al obtener comentarios', async () => {
      const error = new Error('Network Error')

      api.get.mockRejectedValueOnce(error)

      await expect(commentService.getAllComments()).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener comentarios:', error)
    })
  })

  describe('getCommentById - GET /comments/:id', () => {
    it('obtiene un comentario por ID exitosamente', async () => {
      const mockComment = {
        id: 1,
        content: 'Excelente post',
        postId: 5,
        userId: 10,
        createdAt: '2025-01-01'
      }

      api.get.mockResolvedValueOnce({ data: mockComment })

      const result = await commentService.getCommentById(1)

      expect(api.get).toHaveBeenCalledWith('/comments/1')
      expect(result).toEqual(mockComment)
    })

    it('maneja error 404 cuando el comentario no existe', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Comentario no encontrado' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(commentService.getCommentById(999)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener comentario con id 999:', error)
    })
  })

  describe('getCommentsByPost - GET /comments/post/:postId', () => {
    it('obtiene comentarios de un post exitosamente', async () => {
      const mockComments = [
        { id: 1, content: 'Primer comentario', postId: 5 },
        { id: 2, content: 'Segundo comentario', postId: 5 },
        { id: 3, content: 'Tercer comentario', postId: 5 }
      ]

      api.get.mockResolvedValueOnce({ data: mockComments })

      const result = await commentService.getCommentsByPost(5)

      expect(api.get).toHaveBeenCalledWith('/comments/post/5')
      expect(result).toEqual(mockComments)
      expect(result).toHaveLength(3)
    })

    it('retorna array vacío cuando el post no tiene comentarios', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      const result = await commentService.getCommentsByPost(10)

      expect(result).toEqual([])
    })

    it('maneja error 404 cuando el post no existe', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Post no encontrado' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(commentService.getCommentsByPost(999)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener comentarios del post con id 999:', error)
    })
  })

  describe('createComment - POST /comments/post/:postId', () => {
    it('crea un comentario exitosamente', async () => {
      const postId = 5
      const commentData = {
        content: 'Nuevo comentario de prueba'
      }

      const mockResponse = {
        id: 10,
        content: 'Nuevo comentario de prueba',
        postId: 5,
        userId: 1,
        createdAt: '2025-12-16'
      }

      api.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await commentService.createComment(postId, commentData)

      expect(api.post).toHaveBeenCalledWith(
        '/comments/post/5',
        { ...commentData, postId: 5 }
      )
      expect(result).toEqual(mockResponse)
    })

    it('incluye postId en el payload enviado', async () => {
      const postId = 3
      const commentData = { content: 'Test' }

      api.post.mockResolvedValueOnce({ data: {} })

      await commentService.createComment(postId, commentData)

      const callArgs = api.post.mock.calls[0]
      expect(callArgs[1]).toHaveProperty('postId', 3)
    })

    it('maneja error de validación (contenido vacío)', async () => {
      const postId = 5
      const commentData = { content: '' }

      const error = {
        response: {
          status: 400,
          data: { message: 'El contenido del comentario es requerido' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(commentService.createComment(postId, commentData)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al crear comentario para el post con id 5:', error)
    })

    it('maneja error de autenticación', async () => {
      const postId = 5
      const commentData = { content: 'Test' }

      const error = {
        response: {
          status: 401,
          data: { message: 'Debe iniciar sesión para comentar' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(commentService.createComment(postId, commentData)).rejects.toEqual(error)
    })
  })

  describe('updateComment - PUT /comments/:id', () => {
    it('actualiza un comentario exitosamente', async () => {
      const commentId = 10
      const updateData = {
        content: 'Comentario actualizado'
      }

      const mockResponse = {
        id: commentId,
        content: 'Comentario actualizado',
        postId: 5,
        updatedAt: '2025-12-16'
      }

      api.put.mockResolvedValueOnce({ data: mockResponse })

      const result = await commentService.updateComment(commentId, updateData)

      expect(api.put).toHaveBeenCalledWith('/comments/10', updateData)
      expect(result).toEqual(mockResponse)
    })

    it('maneja error 404 al actualizar comentario inexistente', async () => {
      const commentId = 999
      const updateData = { content: 'Update' }

      const error = {
        response: {
          status: 404,
          data: { message: 'Comentario no encontrado' }
        }
      }

      api.put.mockRejectedValueOnce(error)

      await expect(commentService.updateComment(commentId, updateData)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al actualizar comentario con id 999:', error)
    })

    it('maneja error de autorización (no es el autor)', async () => {
      const commentId = 10
      const updateData = { content: 'Update' }

      const error = {
        response: {
          status: 403,
          data: { message: 'No tienes permiso para editar este comentario' }
        }
      }

      api.put.mockRejectedValueOnce(error)

      await expect(commentService.updateComment(commentId, updateData)).rejects.toEqual(error)
    })
  })

  describe('deleteComment - DELETE /comments/:id', () => {
    it('elimina un comentario exitosamente', async () => {
      const commentId = 10
      const mockResponse = { message: 'Comentario eliminado exitosamente' }

      api.delete.mockResolvedValueOnce({ data: mockResponse })

      const result = await commentService.deleteComment(commentId)

      expect(api.delete).toHaveBeenCalledWith('/comments/10')
      expect(result).toEqual(mockResponse)
    })

    it('maneja error 404 al eliminar comentario inexistente', async () => {
      const commentId = 999

      const error = {
        response: {
          status: 404,
          data: { message: 'Comentario no encontrado' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(commentService.deleteComment(commentId)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al eliminar comentario con id 999:', error)
    })

    it('maneja error de autorización al eliminar', async () => {
      const commentId = 10

      const error = {
        response: {
          status: 403,
          data: { message: 'No tienes permiso para eliminar este comentario' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(commentService.deleteComment(commentId)).rejects.toEqual(error)
    })
  })
})

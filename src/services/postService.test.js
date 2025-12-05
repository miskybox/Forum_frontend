import { describe, it, expect, vi, beforeEach } from 'vitest'
import postService from './postService'
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

describe('postService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllPosts - GET /posts', () => {
    it('obtiene lista de posts con paginación por defecto', async () => {
      const mockPosts = {
        content: [
          { id: 1, title: 'Post 1' },
          { id: 2, title: 'Post 2' }
        ],
        totalPages: 1
      }
      api.get.mockResolvedValueOnce({ data: mockPosts })

      const result = await postService.getAllPosts()

      expect(api.get).toHaveBeenCalledWith('/posts', { params: { page: 0, size: 10 } })
      expect(result).toEqual(mockPosts)
    })

    it('obtiene posts con paginación personalizada', async () => {
      api.get.mockResolvedValueOnce({ data: { content: [] } })

      await postService.getAllPosts(3, 25)

      expect(api.get).toHaveBeenCalledWith('/posts', { params: { page: 3, size: 25 } })
    })
  })

  describe('getPostById - GET /posts/:id', () => {
    it('obtiene un post por ID', async () => {
      const mockPost = { id: 1, title: 'Post Test', content: 'Contenido' }
      api.get.mockResolvedValueOnce({ data: mockPost })

      const result = await postService.getPostById(1)

      expect(api.get).toHaveBeenCalledWith('/posts/1')
      expect(result).toEqual(mockPost)
    })

    it('maneja error cuando post no existe', async () => {
      const error = { response: { status: 404 } }
      api.get.mockRejectedValueOnce(error)

      await expect(postService.getPostById(999)).rejects.toEqual(error)
    })
  })

  describe('fetchPostById - alias de getPostById', () => {
    it('funciona como alias de getPostById', async () => {
      const mockPost = { id: 1, title: 'Post' }
      api.get.mockResolvedValueOnce({ data: mockPost })

      const result = await postService.fetchPostById(1)

      expect(api.get).toHaveBeenCalledWith('/posts/1')
      expect(result).toEqual(mockPost)
    })
  })

  describe('getPostsByForum - GET /posts/forum/:forumId', () => {
    it('obtiene posts de un foro específico', async () => {
      const mockPosts = [
        { id: 1, title: 'Post en Foro', forumId: 5 }
      ]
      api.get.mockResolvedValueOnce({ data: mockPosts })

      const result = await postService.getPostsByForum(5)

      expect(api.get).toHaveBeenCalledWith('/posts/forum/5')
      expect(result).toEqual(mockPosts)
    })
  })

  describe('createPost - POST /posts', () => {
    it('crea un nuevo post', async () => {
      const postData = { title: 'Nuevo Post', content: 'Contenido', forumId: 1 }
      const mockCreated = { id: 10, ...postData }
      api.post.mockResolvedValueOnce({ data: mockCreated })

      const result = await postService.createPost(postData)

      expect(api.post).toHaveBeenCalledWith('/posts', postData)
      expect(result).toEqual(mockCreated)
    })
  })

  describe('updatePost - PUT /posts/:id', () => {
    it('actualiza un post existente', async () => {
      const postData = { title: 'Post Actualizado', content: 'Nuevo contenido' }
      const mockUpdated = { id: 1, ...postData }
      api.put.mockResolvedValueOnce({ data: mockUpdated })

      const result = await postService.updatePost(1, postData)

      expect(api.put).toHaveBeenCalledWith('/posts/1', postData)
      expect(result).toEqual(mockUpdated)
    })
  })

  describe('deletePost - DELETE /posts/:id', () => {
    it('elimina un post', async () => {
      api.delete.mockResolvedValueOnce({ data: { success: true } })

      const result = await postService.deletePost(1)

      expect(api.delete).toHaveBeenCalledWith('/posts/1')
      expect(result).toEqual({ success: true })
    })
  })

  describe('uploadPostImages - POST /posts/:id/images', () => {
    it('sube una sola imagen para un post', async () => {
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' })
      const mockResponse = { images: ['/uploads/test.jpg'] }
      api.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await postService.uploadPostImages(1, mockFile)

      expect(api.post).toHaveBeenCalledWith(
        '/posts/1/images',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      expect(result).toEqual(mockResponse)
    })

    it('sube múltiples imágenes para un post', async () => {
      const mockFiles = [
        new File([''], 'test1.jpg', { type: 'image/jpeg' }),
        new File([''], 'test2.jpg', { type: 'image/jpeg' })
      ]
      const mockResponse = { images: ['/uploads/test1.jpg', '/uploads/test2.jpg'] }
      api.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await postService.uploadPostImages(1, mockFiles)

      expect(api.post).toHaveBeenCalledWith(
        '/posts/1/images',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deletePostImage - DELETE /posts/:postId/images/:imageId', () => {
    it('elimina una imagen de un post', async () => {
      api.delete.mockResolvedValueOnce({ data: { success: true } })

      const result = await postService.deletePostImage(1, 5)

      expect(api.delete).toHaveBeenCalledWith('/posts/1/images/5')
      expect(result).toEqual({ success: true })
    })
  })

  describe('getCurrentUserPosts - GET /posts/user', () => {
    it('obtiene posts del usuario actual', async () => {
      const mockPosts = [{ id: 1, title: 'Mi Post' }]
      api.get.mockResolvedValueOnce({ data: mockPosts })

      const result = await postService.getCurrentUserPosts()

      expect(api.get).toHaveBeenCalledWith('/posts/user')
      expect(result).toEqual(mockPosts)
    })
  })
})


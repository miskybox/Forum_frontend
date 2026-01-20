import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
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

    it('maneja error de red al obtener posts', async () => {
      const error = new Error('Network Error')

      api.get.mockRejectedValueOnce(error)

      await expect(postService.getAllPosts()).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener posts:', error)
    })

    it('maneja error 500 del servidor', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Error interno del servidor' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(postService.getAllPosts()).rejects.toEqual(error)
    })

    it('retorna array vacío cuando no hay posts', async () => {
      api.get.mockResolvedValueOnce({ data: { content: [], totalPages: 0 } })

      const result = await postService.getAllPosts()

      expect(result.content).toEqual([])
      expect(result.totalPages).toBe(0)
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

    it('maneja error 404 cuando post no existe', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Post no encontrado' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(postService.getPostById(999)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener post con id 999:', error)
    })

    it('obtiene post con ID como string', async () => {
      const mockPost = { id: 5, title: 'Post', content: 'Contenido' }

      api.get.mockResolvedValueOnce({ data: mockPost })

      const result = await postService.getPostById('5')

      expect(api.get).toHaveBeenCalledWith('/posts/5')
      expect(result).toEqual(mockPost)
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
        { id: 1, title: 'Post en Foro', forumId: 5 },
        { id: 2, title: 'Otro Post', forumId: 5 }
      ]
      api.get.mockResolvedValueOnce({ data: mockPosts })

      const result = await postService.getPostsByForum(5)

      expect(api.get).toHaveBeenCalledWith('/posts/forum/5')
      expect(result).toEqual(mockPosts)
      expect(result).toHaveLength(2)
    })

    it('retorna array vacío cuando el foro no tiene posts', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      const result = await postService.getPostsByForum(10)

      expect(result).toEqual([])
    })

    it('maneja error 404 cuando el foro no existe', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Foro no encontrado' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(postService.getPostsByForum(999)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener posts del foro con id 999:', error)
    })
  })

  describe('createPost - POST /posts', () => {
    it('crea un nuevo post exitosamente', async () => {
      const postData = { title: 'Nuevo Post', content: 'Contenido', forumId: 1 }
      const mockCreated = { id: 10, ...postData, createdAt: '2025-12-16' }
      api.post.mockResolvedValueOnce({ data: mockCreated })

      const result = await postService.createPost(postData)

      expect(api.post).toHaveBeenCalledWith('/posts', postData)
      expect(result).toEqual(mockCreated)
    })

    it('maneja error de validación (título vacío)', async () => {
      const postData = { title: '', content: 'Contenido', forumId: 1 }

      const error = {
        response: {
          status: 400,
          data: { message: 'El título del post es requerido' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(postService.createPost(postData)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al crear post:', error)
    })

    it('maneja error de autenticación', async () => {
      const postData = { title: 'Post', content: 'Contenido', forumId: 1 }

      const error = {
        response: {
          status: 401,
          data: { message: 'Debe iniciar sesión para crear posts' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(postService.createPost(postData)).rejects.toEqual(error)
    })

    it('maneja error cuando el foro no existe', async () => {
      const postData = { title: 'Post', content: 'Contenido', forumId: 999 }

      const error = {
        response: {
          status: 404,
          data: { message: 'Foro no encontrado' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(postService.createPost(postData)).rejects.toEqual(error)
    })
  })

  describe('updatePost - PUT /posts/:id', () => {
    it('actualiza un post existente', async () => {
      const postData = { title: 'Post Actualizado', content: 'Nuevo contenido' }
      const mockUpdated = { id: 1, ...postData, updatedAt: '2025-12-16' }
      api.put.mockResolvedValueOnce({ data: mockUpdated })

      const result = await postService.updatePost(1, postData)

      expect(api.put).toHaveBeenCalledWith('/posts/1', postData)
      expect(result).toEqual(mockUpdated)
    })

    it('maneja error 404 al actualizar post inexistente', async () => {
      const postData = { title: 'Update' }

      const error = {
        response: {
          status: 404,
          data: { message: 'Post no encontrado' }
        }
      }

      api.put.mockRejectedValueOnce(error)

      await expect(postService.updatePost(999, postData)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al actualizar post con id 999:', error)
    })

    it('maneja error de autorización (no es el autor)', async () => {
      const postData = { title: 'Update' }

      const error = {
        response: {
          status: 403,
          data: { message: 'No tienes permiso para editar este post' }
        }
      }

      api.put.mockRejectedValueOnce(error)

      await expect(postService.updatePost(1, postData)).rejects.toEqual(error)
    })

    it('actualiza solo el título del post', async () => {
      const partialUpdate = { title: 'Nuevo Título' }

      const mockResponse = {
        id: 1,
        title: 'Nuevo Título',
        content: 'Contenido original',
        forumId: 1
      }

      api.put.mockResolvedValueOnce({ data: mockResponse })

      const result = await postService.updatePost(1, partialUpdate)

      expect(result.title).toBe('Nuevo Título')
    })
  })

  describe('deletePost - DELETE /posts/:id', () => {
    it('elimina un post exitosamente', async () => {
      const mockResponse = { message: 'Post eliminado exitosamente' }

      api.delete.mockResolvedValueOnce({ data: mockResponse })

      const result = await postService.deletePost(1)

      expect(api.delete).toHaveBeenCalledWith('/posts/1')
      expect(result).toEqual(mockResponse)
    })

    it('maneja error 404 al eliminar post inexistente', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Post no encontrado' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(postService.deletePost(999)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al eliminar post con id 999:', error)
    })

    it('maneja error de autorización al eliminar', async () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'No tienes permiso para eliminar este post' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(postService.deletePost(1)).rejects.toEqual(error)
    })
  })

  describe('uploadPostImages - POST /posts/:id/images', () => {
    it('sube una sola imagen para un post', async () => {
      const mockFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' })
      const mockResponse = { images: [{ id: 1, path: '/uploads/test.jpg' }] }
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
        new File(['content1'], 'test1.jpg', { type: 'image/jpeg' }),
        new File(['content2'], 'test2.jpg', { type: 'image/jpeg' })
      ]
      const mockResponse = {
        images: [
          { id: 1, path: '/uploads/test1.jpg' },
          { id: 2, path: '/uploads/test2.jpg' }
        ]
      }
      api.post.mockResolvedValueOnce({ data: mockResponse })

      const result = await postService.uploadPostImages(1, mockFiles)

      expect(api.post).toHaveBeenCalledWith(
        '/posts/1/images',
        expect.any(FormData),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      expect(result).toEqual(mockResponse)
    })

    it('verifica que FormData contiene el archivo', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

      api.post.mockResolvedValueOnce({ data: {} })

      await postService.uploadPostImages(1, mockFile)

      const formDataCall = api.post.mock.calls[0][1]
      expect(formDataCall).toBeInstanceOf(FormData)
    })

    it('maneja error de formato de archivo inválido', async () => {
      const mockFile = new File(['content'], 'document.txt', { type: 'text/plain' })

      const error = {
        response: {
          status: 400,
          data: { message: 'Formato de archivo no válido. Solo se permiten imágenes' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(postService.uploadPostImages(1, mockFile)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al subir imágenes para post con id 1:', error)
    })

    it('maneja error de tamaño de archivo excedido', async () => {
      const largeFile = new File(['x'.repeat(10 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })

      const error = {
        response: {
          status: 413,
          data: { message: 'El archivo es demasiado grande. Máximo 5MB por imagen' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(postService.uploadPostImages(1, largeFile)).rejects.toEqual(error)
    })

    it('maneja error 404 cuando el post no existe', async () => {
      const mockFile = new File(['content'], 'image.jpg', { type: 'image/jpeg' })

      const error = {
        response: {
          status: 404,
          data: { message: 'Post no encontrado' }
        }
      }

      api.post.mockRejectedValueOnce(error)

      await expect(postService.uploadPostImages(999, mockFile)).rejects.toEqual(error)
    })
  })

  describe('deletePostImage - DELETE /posts/:postId/images/:imageId', () => {
    it('elimina una imagen de un post exitosamente', async () => {
      const mockResponse = { message: 'Imagen eliminada exitosamente' }

      api.delete.mockResolvedValueOnce({ data: mockResponse })

      const result = await postService.deletePostImage(1, 5)

      expect(api.delete).toHaveBeenCalledWith('/posts/1/images/5')
      expect(result).toEqual(mockResponse)
    })

    it('maneja error 404 cuando la imagen no existe', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Imagen no encontrada' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(postService.deletePostImage(1, 999)).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al eliminar imagen 999 del post 1:', error)
    })

    it('maneja error 404 cuando el post no existe', async () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Post no encontrado' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(postService.deletePostImage(999, 5)).rejects.toEqual(error)
    })

    it('maneja error de autorización', async () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'No tienes permiso para eliminar esta imagen' }
        }
      }

      api.delete.mockRejectedValueOnce(error)

      await expect(postService.deletePostImage(1, 5)).rejects.toEqual(error)
    })
  })

  describe('getCurrentUserPosts - GET /posts/user', () => {
    it('obtiene posts del usuario actual exitosamente', async () => {
      const mockPosts = [
        { id: 1, title: 'Mi Post 1', content: 'Contenido 1' },
        { id: 2, title: 'Mi Post 2', content: 'Contenido 2' }
      ]
      api.get.mockResolvedValueOnce({ data: mockPosts })

      const result = await postService.getCurrentUserPosts()

      expect(api.get).toHaveBeenCalledWith('/posts/user')
      expect(result).toEqual(mockPosts)
      expect(result).toHaveLength(2)
    })

    it('retorna array vacío cuando el usuario no tiene posts', async () => {
      api.get.mockResolvedValueOnce({ data: [] })

      const result = await postService.getCurrentUserPosts()

      expect(result).toEqual([])
    })

    it('maneja error de autenticación', async () => {
      const error = {
        response: {
          status: 401,
          data: { message: 'Debe iniciar sesión' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(postService.getCurrentUserPosts()).rejects.toEqual(error)
      expect(console.error).toHaveBeenCalledWith('Error al obtener posts del usuario actual:', error)
    })

    it('maneja error de servidor', async () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Error interno del servidor' }
        }
      }

      api.get.mockRejectedValueOnce(error)

      await expect(postService.getCurrentUserPosts()).rejects.toEqual(error)
    })
  })
})


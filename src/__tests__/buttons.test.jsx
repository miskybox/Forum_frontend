import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import ForumDetailsPage from '../pages/ForumDetailsPage'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import { renderWithProviders } from './test-utils'

// Mock de servicios
vi.mock('../services/forumService', () => ({
  default: {
    getForumById: vi.fn(),
    deleteForum: vi.fn(),
    createForum: vi.fn(),
    updateForum: vi.fn()
  }
}))

vi.mock('../services/postService', () => ({
  default: {
    getPostsByForum: vi.fn(),
    createPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn()
  }
}))

import forumService from '../services/forumService'
import postService from '../services/postService'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: '1' })
  }
})

describe('Botones y Acciones - Verificación Completa', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    forumService.getForumById.mockResolvedValue({
      id: 1,
      title: 'Test Forum',
      description: 'Test Description',
      createdBy: 1
    })
    postService.getPostsByForum.mockResolvedValue([])
  })

  describe('ForumDetailsPage - Botones', () => {
    it('tiene botón para crear post cuando está autenticado', async () => {
      renderWithProviders(<ForumDetailsPage />, {
        authValue: {
          currentUser: { id: 1, username: 'testuser' },
          isAuthenticated: true,
          hasRole: vi.fn(() => false),
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn()
        }
      })

      await waitFor(() => {
        // Buscar cualquier link que contenga "nueva" o "crear" o "new" o "post"
        const links = screen.getAllByRole('link')
        const createPostLink = links.find(link => 
          link.getAttribute('href')?.includes('/posts/create')
        )
        expect(createPostLink).toBeTruthy()
      })
    })

    it('tiene botón para editar foro cuando es el autor', async () => {
      renderWithProviders(<ForumDetailsPage />, {
        authValue: {
          currentUser: { id: 1, username: 'testuser' },
          isAuthenticated: true,
          hasRole: vi.fn(() => false),
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn()
        }
      })

      await waitFor(() => {
        const links = screen.getAllByRole('link')
        const editLink = links.find(link => 
          link.getAttribute('href')?.includes('/edit')
        )
        expect(editLink).toBeTruthy()
      })
    })

    it('tiene botón para eliminar foro cuando es el autor', async () => {
      // Mock globalThis.confirm
      globalThis.confirm = vi.fn(() => true)
      forumService.deleteForum.mockResolvedValue({})

      renderWithProviders(<ForumDetailsPage />, {
        authValue: {
          currentUser: { id: 1, username: 'testuser' },
          isAuthenticated: true,
          hasRole: vi.fn(() => false),
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn()
        }
      })

      await waitFor(() => {
        const buttons = screen.getAllByRole('button')
        const deleteButton = buttons.find(btn => 
          btn.textContent?.toLowerCase().includes('eliminar') ||
          btn.getAttribute('aria-label')?.toLowerCase().includes('eliminar')
        )
        expect(deleteButton).toBeTruthy()
      })
    })
  })

  describe('LoginForm - Botones', () => {
    it('tiene botón de submit para iniciar sesión', () => {
      renderWithProviders(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: /acceder|entrar|iniciar/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('tiene botón para mostrar/ocultar contraseña', () => {
      renderWithProviders(<LoginForm />)

      const toggleButtons = screen.getAllByRole('button', { name: /mostrar contraseña|ocultar contraseña/i })
      expect(toggleButtons.length).toBeGreaterThan(0)
    })
  })

  describe('RegisterForm - Botones', () => {
    it('tiene botón de submit para registrarse', () => {
      renderWithProviders(<RegisterForm />)

      const submitButton = screen.getByRole('button', { name: /crear cuenta|registrarse|registro/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('tiene botones para mostrar/ocultar contraseñas', () => {
      renderWithProviders(<RegisterForm />)

      const toggleButtons = screen.getAllByRole('button', { name: /mostrar contraseña|ocultar contraseña/i })
      expect(toggleButtons.length).toBeGreaterThan(0)
    })
  })
})


import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
        const createPostLink = screen.getByRole('link', { name: /nueva/i })
        expect(createPostLink).toBeInTheDocument()
        expect(createPostLink).toHaveAttribute('href', '/forums/1/posts/create')
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
        const editLink = screen.getByRole('link', { name: /editar/i })
        expect(editLink).toBeInTheDocument()
        expect(editLink).toHaveAttribute('href', '/forums/1/edit')
      })
    })

    it('tiene botón para eliminar foro cuando es el autor', async () => {
      // Mock window.confirm
      window.confirm = vi.fn(() => true)
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

      await waitFor(async () => {
        const deleteButton = screen.getByRole('button', { name: /eliminar/i })
        expect(deleteButton).toBeInTheDocument()

        const user = userEvent.setup()
        await user.click(deleteButton)

        await waitFor(() => {
          expect(forumService.deleteForum).toHaveBeenCalledWith('1')
        })
      })
    })
  })

  describe('LoginForm - Botones', () => {
    it('tiene botón de submit para iniciar sesión', () => {
      renderWithProviders(<LoginForm />)

      const submitButton = screen.getByRole('button', { name: /acceder/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('tiene botón para mostrar/ocultar contraseña', () => {
      renderWithProviders(<LoginForm />)

      const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i })
      expect(toggleButton).toBeInTheDocument()
    })
  })

  describe('RegisterForm - Botones', () => {
    it('tiene botón de submit para registrarse', () => {
      renderWithProviders(<RegisterForm />)

      const submitButton = screen.getByRole('button', { name: /crear cuenta/i })
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


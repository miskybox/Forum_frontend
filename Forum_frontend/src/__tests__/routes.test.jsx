import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import App from '../App'
import { renderWithProviders } from './test-utils'

// Mock de react-hot-toast
vi.mock('react-hot-toast', () => ({
  Toaster: () => null,
  default: {
    success: vi.fn(),
    error: vi.fn()
  },
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock de todos los servicios
vi.mock('../services/forumService', () => ({
  default: {
    getAllForums: vi.fn(() => Promise.resolve({ content: [] })),
    getForumById: vi.fn(() => Promise.resolve({ id: 1, title: 'Test Forum' })),
    createForum: vi.fn(() => Promise.resolve({ id: 1 })),
    updateForum: vi.fn(() => Promise.resolve({ id: 1 })),
    deleteForum: vi.fn(() => Promise.resolve())
  }
}))

vi.mock('../services/postService', () => ({
  default: {
    getAllPosts: vi.fn(() => Promise.resolve({ content: [] })),
    getPostById: vi.fn(() => Promise.resolve({ id: 1, title: 'Test Post' })),
    getPostsByForum: vi.fn(() => Promise.resolve([])),
    createPost: vi.fn(() => Promise.resolve({ id: 1 })),
    updatePost: vi.fn(() => Promise.resolve({ id: 1 })),
    deletePost: vi.fn(() => Promise.resolve())
  }
}))

vi.mock('../services/categoryService', () => ({
  default: {
    getAllCategories: vi.fn(() => Promise.resolve([]))
  }
}))

vi.mock('../services/triviaService', () => ({
  default: {
    getMyScore: vi.fn(() => Promise.resolve({ totalScore: 0 })),
    startGame: vi.fn(() => Promise.resolve({ id: 1 })),
    getLeaderboard: vi.fn(() => Promise.resolve({ content: [] }))
  }
}))

vi.mock('../services/travelService', () => ({
  default: {
    getMyPlaces: vi.fn(() => Promise.resolve([])),
    getMyStats: vi.fn(() => Promise.resolve({ countriesVisited: 0 }))
  }
}))

vi.mock('../services/authService', () => ({
  default: {
    getCurrentUser: vi.fn(() => Promise.resolve({ id: 1, username: 'testuser' })),
    isAuthenticated: vi.fn(() => false)
  }
}))

describe('App Routes - Verificación de Rutas', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rutas Públicas - Verificación de existencia', () => {
    it('ruta / existe y renderiza componente', async () => {
      renderWithProviders(<App />, { initialEntries: ['/'] })
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('ruta /login existe y renderiza componente', async () => {
      renderWithProviders(<App />, { initialEntries: ['/login'] })
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('ruta /register existe y renderiza componente', async () => {
      renderWithProviders(<App />, { initialEntries: ['/register'] })
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('ruta /categories existe y renderiza componente', async () => {
      renderWithProviders(<App />, { initialEntries: ['/categories'] })
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('ruta /forums existe y renderiza componente', async () => {
      renderWithProviders(<App />, { initialEntries: ['/forums'] })
      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })
})


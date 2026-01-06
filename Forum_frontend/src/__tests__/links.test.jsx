import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import Navbar from '../components/common/Navbar'
import HomePage from '../pages/HomePage'
import ForumCard from '../components/forums/ForumCard'
import PostCard from '../components/post/PostCard'
import CategoryCard from '../components/categories/CategoryCard'
import { renderWithProviders } from './test-utils'

vi.mock('../services/forumService', () => ({
  default: {
    getAllForums: vi.fn(() => Promise.resolve({ content: [] }))
  }
}))

vi.mock('../services/categoryService', () => ({
  default: {
    getAllCategories: vi.fn(() => Promise.resolve([]))
  }
}))

describe('Links y Navegación - Verificación Completa', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Navbar - Links Principales', () => {
    it('tiene link a Inicio (/)', () => {
      renderWithProviders(<Navbar />)

      const homeLinks = screen.getAllByRole('link', { name: /inicio/i })
      expect(homeLinks.length).toBeGreaterThan(0)
      expect(homeLinks[0]).toHaveAttribute('href', '/')
    })

    it('tiene link a Foros (/forums)', () => {
      renderWithProviders(<Navbar />)

      const forumsLinks = screen.getAllByRole('link', { name: /foros/i })
      expect(forumsLinks.length).toBeGreaterThan(0)
      expect(forumsLinks[0]).toHaveAttribute('href', '/forums')
    })

    it('tiene link a Trivia (/trivia)', () => {
      renderWithProviders(<Navbar />)

      const triviaLinks = screen.getAllByRole('link', { name: /trivia/i })
      expect(triviaLinks.length).toBeGreaterThan(0)
      expect(triviaLinks[0]).toHaveAttribute('href', '/trivia')
    })

    it('tiene link a Mi Mapa (/travel)', () => {
      renderWithProviders(<Navbar />)

      const mapLinks = screen.getAllByRole('link', { name: /mi mapa/i })
      expect(mapLinks.length).toBeGreaterThan(0)
      expect(mapLinks[0]).toHaveAttribute('href', '/travel')
    })

    it('tiene link a Login (/login)', () => {
      renderWithProviders(<Navbar />)

      const loginLinks = screen.getAllByRole('link', { name: /entrar/i })
      expect(loginLinks.length).toBeGreaterThan(0)
      expect(loginLinks[0]).toHaveAttribute('href', '/login')
    })

    it('tiene link a Registro (/register)', () => {
      renderWithProviders(<Navbar />)

      const registerLinks = screen.getAllByRole('link', { name: /registrarse/i })
      expect(registerLinks.length).toBeGreaterThan(0)
      expect(registerLinks[0]).toHaveAttribute('href', '/register')
    })
  })

  describe('HomePage - Links de Acción', () => {
    it('tiene link a Explorar Foros (/forums)', async () => {
      renderWithProviders(<HomePage />)

      await screen.findByRole('link', { name: /explorar foros/i })
      const forumsLink = screen.getByRole('link', { name: /explorar foros/i })
      expect(forumsLink).toHaveAttribute('href', '/forums')
    })

    it('tiene link a Jugar Trivia (/trivia)', async () => {
      renderWithProviders(<HomePage />)

      await screen.findByRole('link', { name: /jugar trivia/i })
      const triviaLink = screen.getByRole('link', { name: /jugar trivia/i })
      expect(triviaLink).toHaveAttribute('href', '/trivia')
    })

    it('tiene link a Mi Mapa (/travel)', async () => {
      renderWithProviders(<HomePage />)

      await screen.findByRole('link', { name: /mi mapa/i })
      const mapLink = screen.getByRole('link', { name: /mi mapa/i })
      expect(mapLink).toHaveAttribute('href', '/travel')
    })
  })

  describe('ForumCard - Links', () => {
    const mockForum = {
      id: 1,
      title: 'Viaje a París',
      description: 'Descripción del foro',
      imageUrl: 'https://example.com/image.jpg',
      postCount: 10,
      viewCount: 100,
      creator: { username: 'user1' },
      createdAt: '2024-01-01',
      tags: []
    }

    it('tiene link a detalles del foro (/forums/:id)', () => {
      renderWithProviders(<ForumCard forum={mockForum} />)

      const links = screen.getAllByRole('link')
      const forumLink = links.find(link => link.getAttribute('href') === '/forums/1')
      expect(forumLink).toBeInTheDocument()
    })
  })

  describe('PostCard - Links', () => {
    const mockPost = {
      id: 42,
      title: 'Mi experiencia',
      content: 'Contenido del post',
      author: { username: 'user1' },
      createdAt: '2024-01-01',
      images: [],
      commentCount: 5,
      viewCount: 50
    }

    it('tiene link a detalles del post (/posts/:id)', () => {
      renderWithProviders(<PostCard post={mockPost} />)

      const postLink = screen.getByRole('link')
      expect(postLink).toHaveAttribute('href', '/posts/42')
    })
  })

  describe('CategoryCard - Links', () => {
    const mockCategory = {
      id: 5,
      name: 'Europa',
      description: 'Descripción',
      imageUrl: 'https://example.com/image.jpg',
      forumCount: 10
    }

    it('tiene link a foros de categoría (/forums/category/:id)', () => {
      renderWithProviders(<CategoryCard category={mockCategory} />)

      const categoryLink = screen.getByRole('link')
      expect(categoryLink).toHaveAttribute('href', '/forums/category/5')
    })
  })
})


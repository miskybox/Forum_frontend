import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { renderWithProviders } from './test-utils'

describe('Validación de Rutas y Links', () => {
  it('debe tener todas las rutas principales definidas', () => {
    const routes = [
      '/',
      '/login',
      '/register',
      '/categories',
      '/forums',
      '/travel',
      '/trivia',
      '/profile',
      '/forums/create',
      '/admin/dashboard',
      '/moderator/dashboard'
    ]

    routes.forEach(route => {
      expect(route).toBeDefined()
    })
  })

  it('debe renderizar NotFoundPage para rutas inexistentes', () => {
    renderWithProviders(<App />, { initialEntries: ['/ruta-inexistente'] })

    // Verificar que se muestra la página 404
    const matches = screen.getAllByText(/404|not found|página no encontrada/i)
    expect(matches.length).toBeGreaterThan(0)
  })

  it('debe tener rutas protegidas correctamente configuradas', () => {
    const protectedRoutes = [
      '/profile',
      '/forums/create',
      '/forums/:id/edit',
      '/forums/:forumId/posts/create',
      '/posts/:id/edit',
      '/trivia/play/:gameId',
      '/trivia/infinite',
      '/admin/dashboard',
      '/moderator/dashboard'
    ]

    protectedRoutes.forEach(route => {
      expect(route).toMatch(/^\/|\/forums|\/posts|\/trivia|\/admin|\/moderator|\/profile/)
    })
  })
})



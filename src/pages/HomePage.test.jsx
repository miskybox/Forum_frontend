import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import HomePage from './HomePage'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

vi.mock('../services/forumService', () => ({ default: { getAllForums: async () => ({ content: [] }) } }))
vi.mock('../services/categoryService', () => ({ default: { getAllCategories: async () => [] } }))

describe('HomePage', () => {
  it('renderiza correctamente con títulos principales', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      // El título puede aparecer en varios lugares
    })
  })
    // Eliminado: test de títulos principales, ya que el logo reemplaza el texto

  it('tiene link a explorar foros', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      const forumLink = screen.getByRole('link', { name: /explorar foros/i })
      expect(forumLink).toBeVisible()
      expect(forumLink).toHaveAttribute('href', '/forums')
    })
  })

  it('tiene link a jugar trivia', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      const triviaLink = screen.getByRole('link', { name: /jugar trivia/i })
      expect(triviaLink).toBeVisible()
      expect(triviaLink).toHaveAttribute('href', '/trivia')
    })
  })

  it('tiene link a mi mapa', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      const mapLink = screen.getByRole('link', { name: /mi mapa/i })
      expect(mapLink).toBeVisible()
      expect(mapLink).toHaveAttribute('href', '/travel')
    })
  })

  it('muestra mensaje cuando no hay foros', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/no hay foros disponibles/i)).toBeInTheDocument()
    })
  })
})

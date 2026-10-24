import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import HomeHero from './HomeHero'
import categoryService from '../../services/categoryService'
import tagService from '../../services/tagService'

vi.mock('../../services/categoryService', () => ({
  default: { getAllCategories: vi.fn() },
}))
vi.mock('../../services/tagService', () => ({
  default: { getPopular: vi.fn() },
}))

describe('HomeHero', () => {
  it('links interest chips to existing category forum routes', async () => {
    tagService.getPopular.mockResolvedValue([])
    categoryService.getAllCategories.mockResolvedValue([
      { id: 3, name: 'Senderismo', icon: '🥾' },
    ])

    render(
      <MemoryRouter>
        <HomeHero />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /senderismo/i })).toHaveAttribute('href', '/forums/category/3')
    })
  })
})

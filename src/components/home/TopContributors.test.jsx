import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TopContributors from './TopContributors'

describe('TopContributors', () => {
  it('links each contributor to their public profile', () => {
    render(
      <MemoryRouter>
        <TopContributors
          contributors={[
            { userId: 9, username: 'viajero_demo', role: 'USER', points: 12, avatarUrl: null },
          ]}
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: /viajero_demo/i })).toHaveAttribute('href', '/profile/9')
    expect(screen.getByText(/12/)).toBeInTheDocument()
  })
})

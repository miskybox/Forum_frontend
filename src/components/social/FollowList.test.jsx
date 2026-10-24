import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import FollowList from './FollowList'
import { LanguageProvider } from '../../contexts/LanguageContext'

vi.mock('../../services/followService', () => ({
  default: {
    getFollowers: vi.fn(async () => [{ userId: 2, username: 'ana', bio: 'Viaja ligero' }]),
    getFollowing: vi.fn(async () => []),
    isFollowing: vi.fn(async () => false),
  },
}))

vi.mock('../../hooks/useAuth', () => ({
  default: () => ({ user: { id: 1 }, currentUser: { id: 1 } }),
}))

describe('FollowList', () => {
  it('renders follower rows with profile links', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <FollowList userId={1} type="followers" />
        </MemoryRouter>
      </LanguageProvider>
    )
    expect(await screen.findByText('ana')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ana/i })).toHaveAttribute('href', '/profile/2')
  })
})

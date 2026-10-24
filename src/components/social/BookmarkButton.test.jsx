import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import BookmarkButton from './BookmarkButton'
import bookmarkService from '../../services/bookmarkService'

vi.mock('../../services/bookmarkService', () => ({
  default: { add: vi.fn(), remove: vi.fn(), list: vi.fn() },
}))
vi.mock('../../hooks/useAuth', () => ({
  default: () => ({ isAuthenticated: true }),
}))

describe('BookmarkButton', () => {
  it('saves a post', async () => {
    bookmarkService.add.mockResolvedValue()
    render(
      <MemoryRouter>
        <BookmarkButton postId={4} />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }))
    await waitFor(() => expect(bookmarkService.add).toHaveBeenCalledWith(4))
  })
})

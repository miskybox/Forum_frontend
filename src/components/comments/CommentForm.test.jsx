import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import CommentForm from './CommentForm'
import { LanguageProvider } from '../../contexts/LanguageContext'

vi.mock('../../services/commentService', () => ({
  default: { createComment: vi.fn() },
}))

vi.mock('../../hooks/useAuth', () => ({
  default: () => ({ isAuthenticated: true, currentUser: { id: 1, username: 'ana' } }),
}))

const renderForm = () => render(
  <LanguageProvider>
    <MemoryRouter>
      <CommentForm postId={9} />
    </MemoryRouter>
  </LanguageProvider>
)

describe('CommentForm', () => {
  it('inserts markdown markers from the toolbar', async () => {
    const user = userEvent.setup()
    renderForm()
    await user.click(screen.getByRole('button', { name: 'Negrita' }))
    expect(screen.getByLabelText('Escribe un comentario...')).toHaveValue('**texto**')
  })
})

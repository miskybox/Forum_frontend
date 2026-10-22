import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import CommentItem from './CommentItems'

const mockAuth = { currentUser: null, hasRole: () => false }
vi.mock('../../hooks/useAuth', () => ({ default: () => mockAuth }))
vi.mock('../../services/commentService', () => ({ default: {} }))

const comment = {
  id: 1,
  content: 'Gran ruta',
  userId: 9,
  username: 'elena',
  createdAt: new Date().toISOString(),
}

const renderItem = (props = {}) =>
  render(
    <MemoryRouter>
      <CommentItem comment={comment} onUpdate={vi.fn()} onDelete={vi.fn()} {...props} />
    </MemoryRouter>
  )

describe('CommentItem', () => {
  beforeEach(() => {
    mockAuth.currentUser = null
    mockAuth.hasRole = () => false
  })

  it('reads the author from the flat API fields', () => {
    renderItem()
    expect(screen.getByRole('link', { name: '@elena' })).toHaveAttribute('href', '/profile/9')
    expect(screen.getByText('Gran ruta')).toBeInTheDocument()
  })

  it('marks replies written by the post author', () => {
    renderItem({ postAuthorId: 9 })
    expect(screen.getByText('Autor del hilo')).toBeInTheDocument()
  })

  it('shows edit and delete only to the comment author', () => {
    renderItem()
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument()

    mockAuth.currentUser = { id: 9 }
    renderItem()
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument()
  })

  it('lets moderators delete but not edit', () => {
    mockAuth.currentUser = { id: 1 }
    mockAuth.hasRole = (role) => role === 'MODERATOR'
    renderItem()
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument()
  })
})

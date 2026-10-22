import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import PostForm from './PostForm'
import postService from '../../services/postService'
import forumService from '../../services/forumService'

vi.mock('../../services/postService', () => ({
  default: { getPostById: vi.fn(), updatePost: vi.fn(), createPost: vi.fn() },
}))
vi.mock('../../services/forumService', () => ({ default: { getAllForums: vi.fn() } }))
vi.mock('react-hot-toast', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const renderForm = (props) =>
  render(
    <MemoryRouter>
      <PostForm {...props} />
    </MemoryRouter>
  )

describe('PostForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('loads the post and updates it instead of creating a new one', async () => {
    postService.getPostById.mockResolvedValue({ id: 5, title: 'Ruta Dolomitas', content: 'Contenido de la ruta', forumId: 3, tags: [] })
    postService.updatePost.mockResolvedValue({})
    renderForm({ postId: '5' })

    expect(await screen.findByDisplayValue('Ruta Dolomitas')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar' }))

    await waitFor(() => expect(postService.updatePost).toHaveBeenCalledWith('5', expect.objectContaining({ title: 'Ruta Dolomitas', forumId: 3 })))
    expect(postService.createPost).not.toHaveBeenCalled()
  })

  it('uses the forum from the route and hides the forum selector', () => {
    renderForm({ forumId: '3' })
    expect(screen.queryByLabelText('Foro')).not.toBeInTheDocument()
    expect(forumService.getAllForums).not.toHaveBeenCalled()
  })
})

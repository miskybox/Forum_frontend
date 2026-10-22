import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PostHeader from './PostHeader'

const basePost = { id: 7, title: 'Mi viaje', forumId: 5, username: 'marcos', createdBy: 3 }

const renderHeader = (props = {}) =>
  render(
    <MemoryRouter>
      <PostHeader post={basePost} commentCount={0} {...props} />
    </MemoryRouter>
  )

describe('PostHeader', () => {
  it('renders the title as the page heading', () => {
    renderHeader()
    expect(screen.getByRole('heading', { level: 1, name: 'Mi viaje' })).toBeInTheDocument()
  })

  it('shows views and replies', () => {
    renderHeader({ post: { ...basePost, viewCount: 100 }, commentCount: 4 })
    expect(screen.getByText(/100 visitas/)).toBeInTheDocument()
    expect(screen.getByText(/4 respuestas/)).toBeInTheDocument()
  })

  it('links the breadcrumb to the forum, using its title when available', () => {
    renderHeader({ forum: { title: 'Alpes' } })
    expect(screen.getByRole('link', { name: 'Alpes' })).toHaveAttribute('href', '/forums/5')
  })

  it('falls back to a generic forum link when the forum is unknown', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: /volver al foro/i })).toHaveAttribute('href', '/forums/5')
  })

  it('includes the category in the breadcrumb when provided', () => {
    renderHeader({ category: { id: 2, name: 'Europa' } })
    expect(screen.getByRole('link', { name: 'Europa' })).toHaveAttribute('href', '/forums/category/2')
  })

  it('shows unknown date when createdAt is missing', () => {
    renderHeader()
    expect(screen.getByText(/Fecha desconocida/i)).toBeInTheDocument()
  })

  it('links the author to their profile', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: /@marcos/ })).toHaveAttribute('href', '/profile/3')
  })

  it('renders tags', () => {
    renderHeader({ post: { ...basePost, tags: ['Europa', 'Aventura'] } })
    expect(screen.getByText('Europa')).toBeInTheDocument()
    expect(screen.getByText('Aventura')).toBeInTheDocument()
  })
})

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ForumCard from './ForumCard'

describe('ForumCard - Links funcionales', () => {
  const mockForum = {
    id: 1,
    title: 'Viaje a París',
    description: 'Consejos para viajar a la ciudad de la luz',
    imageUrl: 'https://example.com/paris.jpg',
    postCount: 15,
    viewCount: 230,
    creator: {
      username: 'viajero123',
      profileImage: null
    },
    createdAt: '2024-01-15T10:00:00Z',
    tags: [
      { id: 1, name: 'Europa' },
      { id: 2, name: 'Francia' }
    ]
  }

  it('renderiza el componente correctamente', () => {
    render(
      <MemoryRouter>
        <ForumCard forum={mockForum} />
      </MemoryRouter>
    )

    // El texto se muestra en mayúsculas en el DOM debido al CSS
    expect(screen.getByText(/viaje a par[ií]s/i)).toBeInTheDocument()
    expect(screen.getByText(/Consejos para viajar a la ciudad de la luz/i)).toBeInTheDocument()
  })

  it('tiene links que navegan a detalles del foro', () => {
    render(
      <MemoryRouter>
        <ForumCard forum={mockForum} />
      </MemoryRouter>
    )

    const links = screen.getAllByRole('link')
    const forumLinks = links.filter(link => link.getAttribute('href') === '/forums/1')
    expect(forumLinks.length).toBeGreaterThan(0)
  })

  it('muestra información del creador', () => {
    render(
      <MemoryRouter>
        <ForumCard forum={mockForum} />
      </MemoryRouter>
    )

    expect(screen.getByText(/viajero123/i)).toBeInTheDocument()
  })

  it('muestra estadísticas del foro', () => {
    render(
      <MemoryRouter>
        <ForumCard forum={mockForum} />
      </MemoryRouter>
    )

    expect(screen.getByText(/15/)).toBeInTheDocument()
    expect(screen.getByText(/publicaciones/i)).toBeInTheDocument()
    expect(screen.getByText(/230/)).toBeInTheDocument()
    expect(screen.getByText(/vistas/i)).toBeInTheDocument()
  })

  it('muestra los tags del foro', () => {
    render(
      <MemoryRouter>
        <ForumCard forum={mockForum} />
      </MemoryRouter>
    )

    expect(screen.getByText(/Europa/i)).toBeInTheDocument()
    expect(screen.getByText(/Francia/i)).toBeInTheDocument()
  })

  it('funciona sin imagen (muestra placeholder)', () => {
    const forumWithoutImage = { ...mockForum, imageUrl: null }
    render(
      <MemoryRouter>
        <ForumCard forum={forumWithoutImage} />
      </MemoryRouter>
    )

    expect(screen.getByText(/viaje a par[ií]s/i)).toBeInTheDocument()
  })
})

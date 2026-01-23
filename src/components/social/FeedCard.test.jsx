import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import FeedCard from './FeedCard'

// Mock de los componentes hijos
vi.mock('./FollowButton', () => ({
  default: function MockFollowButton({ userId, size }) {
    return <button data-testid="follow-button">Seguir {userId}</button>
  }
}))

vi.mock('./ShareButton', () => ({
  default: function MockShareButton({ postId, title, size }) {
    return <button data-testid="share-button" aria-label="Compartir">Compartir {postId}</button>
  }
}))

vi.mock('./LikeButton', () => ({
  default: function MockLikeButton({ postId, initialLiked, initialCount, size }) {
    return <button data-testid="like-button" aria-label="Me gusta">Like {initialCount || 0}</button>
  }
}))

const mockItem = {
  id: 1,
  postId: 123,
  title: 'Mi viaje a Barcelona',
  content: 'Contenido del post sobre Barcelona...',
  authorId: 5,
  authorUsername: 'viajero1',
  authorAvatarUrl: 'https://example.com/avatar.jpg',
  forumId: 10,
  forumName: 'Europa',
  createdAt: new Date().toISOString(),
  imageUrl: 'https://example.com/image.jpg',
  commentCount: 15
}

const renderFeedCard = (item = mockItem) => {
  return render(
    <MemoryRouter>
      <FeedCard item={item} />
    </MemoryRouter>
  )
}

describe('FeedCard', () => {
  it('renderiza la informacion basica del post', () => {
    renderFeedCard()

    expect(screen.getByText('Mi viaje a Barcelona')).toBeInTheDocument()
    expect(screen.getByText('Contenido del post sobre Barcelona...')).toBeInTheDocument()
    expect(screen.getByText('viajero1')).toBeInTheDocument()
    expect(screen.getByText('Europa')).toBeInTheDocument()
  })

  it('muestra la imagen del post si existe', () => {
    renderFeedCard()

    const image = screen.getByAltText('Mi viaje a Barcelona')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('no muestra imagen si no existe imageUrl', () => {
    const itemSinImagen = { ...mockItem, imageUrl: null }
    renderFeedCard(itemSinImagen)

    expect(screen.queryByAltText('Mi viaje a Barcelona')).not.toBeInTheDocument()
  })

  it('muestra el avatar del autor', () => {
    renderFeedCard()

    const avatar = screen.getByAltText('viajero1')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('muestra el contador de comentarios', () => {
    renderFeedCard()

    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('muestra 0 si no hay comentarios', () => {
    const itemSinComentarios = { ...mockItem, commentCount: 0 }
    renderFeedCard(itemSinComentarios)

    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('incluye el boton de seguir', () => {
    renderFeedCard()

    expect(screen.getByTestId('follow-button')).toBeInTheDocument()
  })

  it('incluye el boton de compartir', () => {
    renderFeedCard()

    expect(screen.getByTestId('share-button')).toBeInTheDocument()
  })

  it('tiene enlace al perfil del autor', () => {
    renderFeedCard()

    const profileLinks = screen.getAllByRole('link')
    const authorLink = profileLinks.find(link => link.getAttribute('href') === '/profile/5')
    expect(authorLink).toBeTruthy()
  })

  it('tiene enlace al post', () => {
    renderFeedCard()

    const postLinks = screen.getAllByRole('link')
    const postLink = postLinks.find(link => link.getAttribute('href') === '/posts/123')
    expect(postLink).toBeTruthy()
  })

  it('tiene enlace al foro', () => {
    renderFeedCard()

    const forumLinks = screen.getAllByRole('link')
    const forumLink = forumLinks.find(link => link.getAttribute('href') === '/forums/10')
    expect(forumLink).toBeTruthy()
  })

  it('formatea fechas recientes correctamente', () => {
    const itemReciente = { ...mockItem, createdAt: new Date().toISOString() }
    renderFeedCard(itemReciente)

    // Deberia mostrar "Ahora" o "hace Xm"
    const timeText = screen.getByText(/Ahora|hace \d+m/)
    expect(timeText).toBeInTheDocument()
  })
})

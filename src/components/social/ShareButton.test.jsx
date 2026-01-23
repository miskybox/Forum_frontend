import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import ShareButton from './ShareButton'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'

// Mock de los modulos necesarios
vi.mock('../../hooks/useAuth', () => ({
  default: vi.fn()
}))

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock('../messages/ShareToUserModal', () => ({
  default: function MockShareToUserModal({ isOpen, onClose, shareContent }) {
    if (!isOpen) return null
    return (
      <div data-testid="share-modal">
        <span>ShareToUserModal</span>
        <span data-testid="share-content">{shareContent?.title}</span>
        <button onClick={onClose}>Cerrar modal</button>
      </div>
    )
  }
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

const renderShareButton = (props = {}) => {
  const defaultProps = {
    postId: 123,
    title: 'Titulo del post',
    size: 'md'
  }
  return render(
    <MemoryRouter>
      <ShareButton {...defaultProps} {...props} />
    </MemoryRouter>
  )
}

describe('ShareButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuth.mockReturnValue({
      isAuthenticated: true,
      currentUser: { id: 1, username: 'testuser' }
    })

    // Mock del portapapeles
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue()
      }
    })
  })

  it('renderiza el boton de compartir', () => {
    renderShareButton()
    expect(screen.getByLabelText('Compartir')).toBeInTheDocument()
  })

  it('muestra el menu al hacer clic', () => {
    renderShareButton()

    fireEvent.click(screen.getByLabelText('Compartir'))

    expect(screen.getByText('Copiar enlace')).toBeInTheDocument()
    expect(screen.getByText('Enviar por mensaje')).toBeInTheDocument()
  })

  it('oculta el menu al hacer clic fuera', async () => {
    renderShareButton()

    fireEvent.click(screen.getByLabelText('Compartir'))
    expect(screen.getByText('Copiar enlace')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)

    await waitFor(() => {
      expect(screen.queryByText('Copiar enlace')).not.toBeInTheDocument()
    })
  })

  it('copia el enlace al portapapeles', async () => {
    renderShareButton()

    fireEvent.click(screen.getByLabelText('Compartir'))
    fireEvent.click(screen.getByText('Copiar enlace'))

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('/posts/123')
      )
    })
    expect(toast.success).toHaveBeenCalledWith('Enlace copiado')
  })

  it('abre el modal de compartir por mensaje cuando esta autenticado', async () => {
    renderShareButton()

    fireEvent.click(screen.getByLabelText('Compartir'))
    fireEvent.click(screen.getByText('Enviar por mensaje'))

    await waitFor(() => {
      expect(screen.getByTestId('share-modal')).toBeInTheDocument()
      expect(screen.getByTestId('share-content')).toHaveTextContent('Titulo del post')
    })
  })

  it('redirige a login si no esta autenticado al compartir por mensaje', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      currentUser: null
    })

    renderShareButton()

    fireEvent.click(screen.getByLabelText('Compartir'))
    fireEvent.click(screen.getByText('Enviar por mensaje'))

    expect(toast.error).toHaveBeenCalledWith('Inicia sesion para compartir por mensaje')
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('cierra el modal de compartir', async () => {
    renderShareButton()

    fireEvent.click(screen.getByLabelText('Compartir'))
    fireEvent.click(screen.getByText('Enviar por mensaje'))

    await waitFor(() => {
      expect(screen.getByTestId('share-modal')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Cerrar modal'))

    await waitFor(() => {
      expect(screen.queryByTestId('share-modal')).not.toBeInTheDocument()
    })
  })

  it('aplica clases de tamano correctas para sm', () => {
    renderShareButton({ size: 'sm' })
    expect(screen.getByLabelText('Compartir')).toHaveClass('p-1.5')
  })

  it('aplica clases de tamano correctas para md', () => {
    renderShareButton({ size: 'md' })
    expect(screen.getByLabelText('Compartir')).toHaveClass('p-2')
  })
})

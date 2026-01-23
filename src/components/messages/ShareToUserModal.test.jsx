import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import ShareToUserModal from './ShareToUserModal'
import messageService from '../../services/messageService'
import userService from '../../services/userService'
import toast from 'react-hot-toast'

vi.mock('../../services/messageService', () => ({
  default: {
    getConversations: vi.fn(),
    sendMessage: vi.fn()
  }
}))

vi.mock('../../services/userService', () => ({
  default: {
    searchUsers: vi.fn()
  }
}))

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
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

const mockConversations = [
  {
    participantId: 1,
    participantUsername: 'usuario_reciente',
    participantAvatarUrl: ''
  },
  {
    participantId: 2,
    participantUsername: 'otro_usuario',
    participantAvatarUrl: ''
  }
]

const mockUsers = [
  { id: 3, username: 'usuario_busqueda', avatarUrl: '' },
  { id: 4, username: 'otro_resultado', avatarUrl: '' }
]

const mockShareContent = {
  postId: 123,
  title: 'Viaje a Barcelona',
  url: 'http://localhost/posts/123'
}

const renderModal = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    shareContent: mockShareContent
  }
  return render(
    <MemoryRouter>
      <ShareToUserModal {...defaultProps} {...props} />
    </MemoryRouter>
  )
}

describe('ShareToUserModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    messageService.getConversations.mockResolvedValue(mockConversations)
    messageService.sendMessage.mockResolvedValue({ id: 1, content: 'test' })
    userService.searchUsers.mockResolvedValue({ content: mockUsers })
  })

  it('no renderiza cuando isOpen es false', () => {
    renderModal({ isOpen: false })
    expect(screen.queryByText('Compartir publicacion')).not.toBeInTheDocument()
  })

  it('renderiza el modal cuando isOpen es true', () => {
    renderModal()
    expect(screen.getByText('Compartir publicacion')).toBeInTheDocument()
  })

  it('muestra la vista previa del contenido a compartir', () => {
    renderModal()
    expect(screen.getByText('Compartiendo:')).toBeInTheDocument()
    expect(screen.getByText('Viaje a Barcelona')).toBeInTheDocument()
  })

  it('muestra las pestanas de Recientes y Buscar', () => {
    renderModal()
    expect(screen.getByText('Recientes')).toBeInTheDocument()
    expect(screen.getByText('Buscar')).toBeInTheDocument()
  })

  it('muestra conversaciones recientes por defecto', async () => {
    renderModal()

    await waitFor(() => {
      expect(screen.getByText('usuario_reciente')).toBeInTheDocument()
      expect(screen.getByText('otro_usuario')).toBeInTheDocument()
    })
  })

  it('cambia a la pestana de busqueda', async () => {
    renderModal()

    fireEvent.click(screen.getByText('Buscar'))

    expect(screen.getByPlaceholderText('Buscar usuario...')).toBeInTheDocument()
  })

  it('busca usuarios cuando se escribe en el campo de busqueda', async () => {
    renderModal()

    fireEvent.click(screen.getByText('Buscar'))

    const input = screen.getByPlaceholderText('Buscar usuario...')
    fireEvent.change(input, { target: { value: 'us' } })

    await waitFor(() => {
      expect(userService.searchUsers).toHaveBeenCalledWith('us', 0, 10)
    }, { timeout: 500 })
  })

  it('envia mensaje al seleccionar un usuario de recientes', async () => {
    const onClose = vi.fn()
    renderModal({ onClose })

    await waitFor(() => {
      expect(screen.getByText('usuario_reciente')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('usuario_reciente'))

    await waitFor(() => {
      expect(messageService.sendMessage).toHaveBeenCalledWith(
        1,
        expect.stringContaining('Viaje a Barcelona')
      )
    })

    expect(toast.success).toHaveBeenCalledWith('Contenido compartido con usuario_reciente')
    expect(onClose).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/messages/1')
  })

  it('envia mensaje al seleccionar un usuario de busqueda', async () => {
    const onClose = vi.fn()
    renderModal({ onClose })

    fireEvent.click(screen.getByText('Buscar'))

    const input = screen.getByPlaceholderText('Buscar usuario...')
    fireEvent.change(input, { target: { value: 'usuario' } })

    await waitFor(() => {
      expect(screen.getByText('usuario_busqueda')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('usuario_busqueda'))

    await waitFor(() => {
      expect(messageService.sendMessage).toHaveBeenCalledWith(
        3,
        expect.stringContaining('Viaje a Barcelona')
      )
    })
  })

  it('llama a onClose cuando se hace clic en el boton cerrar', () => {
    const onClose = vi.fn()
    renderModal({ onClose })

    fireEvent.click(screen.getByLabelText('Cerrar'))
    expect(onClose).toHaveBeenCalled()
  })

  it('muestra mensaje cuando no hay conversaciones recientes', async () => {
    messageService.getConversations.mockResolvedValue([])
    renderModal()

    await waitFor(() => {
      expect(screen.getByText('No hay conversaciones recientes')).toBeInTheDocument()
    })
  })

  it('muestra error toast cuando falla el envio', async () => {
    messageService.sendMessage.mockRejectedValue(new Error('Error de red'))
    renderModal()

    await waitFor(() => {
      expect(screen.getByText('usuario_reciente')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('usuario_reciente'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al compartir')
    })
  })

  it('indica caracteres minimos para busqueda', async () => {
    renderModal()

    fireEvent.click(screen.getByText('Buscar'))

    const input = screen.getByPlaceholderText('Buscar usuario...')
    fireEvent.change(input, { target: { value: 'a' } })

    await waitFor(() => {
      expect(screen.getByText('Escribe al menos 2 caracteres para buscar')).toBeInTheDocument()
    })
  })
})

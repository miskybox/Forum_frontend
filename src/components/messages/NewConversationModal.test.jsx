import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import NewConversationModal from './NewConversationModal'
import userService from '../../services/userService'

vi.mock('../../services/userService', () => ({
  default: {
    getAllUsers: vi.fn(),
    searchUsers: vi.fn()
  }
}))

const mockUsers = [
  {
    id: 1,
    username: 'usuario1',
    avatarUrl: '',
    bio: 'Bio del usuario 1'
  },
  {
    id: 2,
    username: 'usuario2',
    avatarUrl: '',
    bio: 'Bio del usuario 2'
  }
]

const renderModal = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSelectUser: vi.fn()
  }
  return render(
    <MemoryRouter>
      <NewConversationModal {...defaultProps} {...props} />
    </MemoryRouter>
  )
}

describe('NewConversationModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    userService.getAllUsers.mockResolvedValue({ content: mockUsers })
    userService.searchUsers.mockResolvedValue({ content: mockUsers })
  })

  it('no renderiza cuando isOpen es false', () => {
    renderModal({ isOpen: false })
    expect(screen.queryByText('Nueva conversacion')).not.toBeInTheDocument()
  })

  it('renderiza el modal cuando isOpen es true', async () => {
    renderModal({ isOpen: true })
    expect(screen.getByText('Nueva conversacion')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Buscar usuario por nombre...')).toBeInTheDocument()
  })

  it('muestra usuarios sugeridos al abrir', async () => {
    renderModal()

    await waitFor(() => {
      expect(screen.getByText('usuario1')).toBeInTheDocument()
      expect(screen.getByText('usuario2')).toBeInTheDocument()
    })
  })

  it('llama a onSelectUser cuando se selecciona un usuario', async () => {
    const onSelectUser = vi.fn()
    const onClose = vi.fn()
    renderModal({ onSelectUser, onClose })

    await waitFor(() => {
      expect(screen.getByText('usuario1')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('usuario1'))
    expect(onSelectUser).toHaveBeenCalledWith(1)
    expect(onClose).toHaveBeenCalled()
  })

  it('llama a onClose cuando se hace clic en el boton cerrar', () => {
    const onClose = vi.fn()
    renderModal({ onClose })

    fireEvent.click(screen.getByLabelText('Cerrar'))
    expect(onClose).toHaveBeenCalled()
  })

  it('muestra mensaje cuando no hay resultados de busqueda', async () => {
    userService.searchUsers.mockResolvedValue({ content: [] })
    renderModal()

    const input = screen.getByPlaceholderText('Buscar usuario por nombre...')
    fireEvent.change(input, { target: { value: 'usuario_inexistente' } })

    await waitFor(() => {
      expect(screen.getByText('No se encontraron usuarios')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('muestra indicador de caracteres minimos', () => {
    renderModal()

    const input = screen.getByPlaceholderText('Buscar usuario por nombre...')
    fireEvent.change(input, { target: { value: 'a' } })

    expect(screen.getByText('Escribe al menos 2 caracteres para buscar')).toBeInTheDocument()
  })

  it('busca usuarios cuando se escriben al menos 2 caracteres', async () => {
    renderModal()

    const input = screen.getByPlaceholderText('Buscar usuario por nombre...')
    fireEvent.change(input, { target: { value: 'us' } })

    await waitFor(() => {
      expect(userService.searchUsers).toHaveBeenCalledWith('us', 0, 10)
    }, { timeout: 500 })
  })

  it('muestra usuarios sugeridos texto cuando no hay busqueda', () => {
    renderModal()

    expect(screen.getByText('Usuarios sugeridos')).toBeInTheDocument()
  })
})

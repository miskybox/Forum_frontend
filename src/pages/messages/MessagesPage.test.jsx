import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import MessagesPage from './MessagesPage'
import messageService from '../../services/messageService'

vi.mock('../../services/messageService', () => ({
  default: {
    getUnreadCount: vi.fn(),
    getConversations: vi.fn()
  }
}))

// Mock del modal de nueva conversacion
vi.mock('../../components/messages/NewConversationModal', () => ({
  default: function MockNewConversationModal({ isOpen, onClose, onSelectUser }) {
    if (!isOpen) return null
    return (
      <div data-testid="new-conversation-modal">
        <span>Nueva conversacion modal</span>
        <button onClick={onClose}>Cerrar</button>
        <button onClick={() => onSelectUser(5)}>Seleccionar usuario</button>
      </div>
    )
  }
}))

// Mock de ChatWindow
vi.mock('../../components/messages/ChatWindow', () => ({
  default: function MockChatWindow({ userId, onBack }) {
    return (
      <div data-testid="chat-window">
        Chat con usuario {userId}
        <button onClick={onBack}>Volver</button>
      </div>
    )
  }
}))

// Mock de ConversationList
vi.mock('../../components/messages/ConversationList', () => ({
  default: function MockConversationList({ onSelectConversation, selectedUserId }) {
    return (
      <div data-testid="conversation-list">
        <button onClick={() => onSelectConversation(2)}>usuario2</button>
        {selectedUserId && <span>Seleccionado: {selectedUserId}</span>}
      </div>
    )
  }
}))

describe('MessagesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    messageService.getUnreadCount.mockResolvedValue(0)
    messageService.getConversations.mockResolvedValue([])
  })

  it('muestra el titulo de Mensajes', async () => {
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>
    )
    expect(await screen.findByText('Mensajes')).toBeInTheDocument()
  })

  it('muestra el contador de no leidos cuando hay mensajes', async () => {
    messageService.getUnreadCount.mockResolvedValue(5)
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  it('muestra boton de nueva conversacion', async () => {
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>
    )

    // Buscar boton con texto Nueva conversacion (puede ser visible u oculto en mobile)
    const buttons = screen.getAllByRole('button')
    const newConvButton = buttons.find(btn =>
      btn.textContent.includes('Nueva conversacion') ||
      btn.getAttribute('aria-label')?.includes('Nueva conversacion')
    )
    expect(newConvButton).toBeTruthy()
  })

  it('abre el modal de nueva conversacion al hacer clic', async () => {
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>
    )

    // Buscar y hacer clic en el boton de nueva conversacion
    const button = screen.getByText('Nueva conversacion')
    fireEvent.click(button)

    expect(screen.getByTestId('new-conversation-modal')).toBeInTheDocument()
  })

  it('cierra el modal de nueva conversacion', async () => {
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>
    )

    // Abrir modal
    const button = screen.getByText('Nueva conversacion')
    fireEvent.click(button)
    expect(screen.getByTestId('new-conversation-modal')).toBeInTheDocument()

    // Cerrar modal
    fireEvent.click(screen.getByText('Cerrar'))
    await waitFor(() => {
      expect(screen.queryByTestId('new-conversation-modal')).not.toBeInTheDocument()
    })
  })

  it('muestra boton de iniciar conversacion cuando no hay seleccion', async () => {
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>
    )

    // En la vista sin conversacion seleccionada debe mostrar el boton
    expect(await screen.findByText('Iniciar nueva conversacion')).toBeInTheDocument()
  })

  it('muestra la lista de conversaciones', () => {
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('conversation-list')).toBeInTheDocument()
  })

  it('muestra descripcion de la pagina', () => {
    render(
      <MemoryRouter>
        <MessagesPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Conversaciones privadas con otros viajeros')).toBeInTheDocument()
  })
})

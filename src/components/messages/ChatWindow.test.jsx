import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import ChatWindow from './ChatWindow'
import { LanguageProvider } from '../../contexts/LanguageContext'

// Mock del servicio de mensajes
vi.mock('../../services/messageService', () => ({
  default: {
    getConversation: vi.fn().mockResolvedValue([]),
    markConversationAsRead: vi.fn().mockResolvedValue(),
    sendMessage: vi.fn().mockResolvedValue({}),
    deleteMessage: vi.fn().mockResolvedValue()
  }
}))

// Mock de react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock de scrollIntoView para JSDOM
Element.prototype.scrollIntoView = vi.fn()

describe('ChatWindow', () => {
  it('renderiza el componente correctamente', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <ChatWindow userId={2} onBack={vi.fn()} />
        </MemoryRouter>
      </LanguageProvider>
    )

    // El componente debería mostrar el input de mensaje
    expect(await screen.findByPlaceholderText('Escribe un mensaje...')).toBeInTheDocument()
  })

  it('muestra el boton de enviar', async () => {
    render(
      <LanguageProvider>
        <MemoryRouter>
          <ChatWindow userId={2} onBack={vi.fn()} />
        </MemoryRouter>
      </LanguageProvider>
    )

    expect(await screen.findByLabelText('Enviar mensaje')).toBeInTheDocument()
  })
})

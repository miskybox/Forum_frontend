import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ConversationList from './ConversationList'

// Mock del servicio de mensajes
vi.mock('../../services/messageService', () => ({
  default: {
    getConversations: vi.fn().mockResolvedValue([])
  }
}))

describe('ConversationList', () => {
  it('muestra mensaje cuando no hay conversaciones', async () => {
    render(
      <ConversationList
        onSelectConversation={vi.fn()}
        selectedUserId={null}
      />
    )
    // Espera a que cargue y muestre el mensaje de sin conversaciones
    expect(await screen.findByText('Sin conversaciones')).toBeInTheDocument()
  })
})

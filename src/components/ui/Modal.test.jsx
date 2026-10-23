import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Modal from './Modal'

describe('Modal', () => {
  it('is an accessible dialog labelled by its title', () => {
    render(<Modal title="Partida en progreso"><button type="button">Continuar</button></Modal>)
    const dialog = screen.getByRole('dialog', { name: 'Partida en progreso' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('moves focus inside on open', () => {
    render(<Modal title="Título"><button type="button">Primero</button></Modal>)
    expect(screen.getByRole('button', { name: 'Primero' })).toHaveFocus()
  })

  it('closes with Escape', () => {
    const onClose = vi.fn()
    render(<Modal title="Título" onClose={onClose}><button type="button">Ok</button></Modal>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('keeps Tab focus inside the dialog', () => {
    render(
      <Modal title="Título">
        <button type="button">Uno</button>
        <button type="button">Dos</button>
      </Modal>
    )
    screen.getByRole('button', { name: 'Dos' }).focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(screen.getByRole('button', { name: 'Uno' })).toHaveFocus()
  })
})

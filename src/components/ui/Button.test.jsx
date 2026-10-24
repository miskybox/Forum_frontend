import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import { MdAdd } from 'react-icons/md'
import Button from './Button'

describe('Button', () => {
  it('renders a primary button by default', () => {
    render(<Button>Publicar</Button>)
    const button = screen.getByRole('button', { name: 'Publicar' })
    expect(button).toHaveClass('btn', 'btn-primary')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('applies secondary, ghost and size classes', () => {
    const { rerender } = render(<Button variant="secondary" size="sm">Filtro</Button>)
    expect(screen.getByRole('button', { name: 'Filtro' })).toHaveClass('btn-secondary', 'btn-sm')

    rerender(<Button variant="ghost" size="lg">Descartar</Button>)
    expect(screen.getByRole('button', { name: 'Descartar' })).toHaveClass('btn-ghost', 'btn-lg')
  })

  it('renders an icon-only button labelled for assistive tech', () => {
    render(
      <Button variant="icon" aria-label="Añadir" icon={MdAdd} />
    )
    const button = screen.getByRole('button', { name: 'Añadir' })
    expect(button).toHaveClass('btn-icon')
  })

  it('blocks clicks while loading and exposes aria-busy', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button loading onClick={onClick}>Guardar</Button>)
    const button = screen.getByRole('button', { name: 'Guardar' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders a React Router link when `to` is set', () => {
    render(
      <MemoryRouter>
        <Button to="/forums">Explorar</Button>
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: 'Explorar' })
    expect(link).toHaveAttribute('href', '/forums')
    expect(link).toHaveClass('btn-primary')
  })

  it('does not navigate when a link button is disabled', () => {
    render(
      <MemoryRouter>
        <Button to="/forums" disabled>Explorar</Button>
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: 'Explorar' })
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).not.toHaveAttribute('href')
  })
})

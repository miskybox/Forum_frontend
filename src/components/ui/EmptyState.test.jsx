import { render, screen } from '@testing-library/react'
import { MdMap } from 'react-icons/md'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('shows the title, description and action', () => {
    render(
      <EmptyState
        icon={MdMap}
        title="Sin rutas"
        description="Todavía no hay diarios con fotos."
        action={<button type="button">Crear publicación</button>}
      />
    )
    expect(screen.getByRole('heading', { name: 'Sin rutas' })).toBeInTheDocument()
    expect(screen.getByText('Todavía no hay diarios con fotos.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear publicación' })).toBeInTheDocument()
  })
})

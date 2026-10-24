import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'

describe('Breadcrumb', () => {
  it('links ancestors and marks the last item as the current page', () => {
    render(
      <MemoryRouter>
        <Breadcrumb
          label="Ruta de navegación"
          items={[
            { to: '/', label: 'Inicio' },
            { to: '/forums', label: 'Foros' },
            { label: 'Alpes' },
          ]}
        />
      </MemoryRouter>
    )

    expect(screen.getByRole('navigation', { name: 'Ruta de navegación' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Foros' })).toHaveAttribute('href', '/forums')
    expect(screen.queryByRole('link', { name: 'Alpes' })).not.toBeInTheDocument()
    expect(screen.getByText('Alpes').closest('li')).toHaveAttribute('aria-current', 'page')
  })
})

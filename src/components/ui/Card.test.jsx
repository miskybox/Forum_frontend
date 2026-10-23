import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Card from './Card'

describe('Card', () => {
  it('renders an article with the card surface class', () => {
    render(<Card>Contenido</Card>)
    expect(screen.getByText('Contenido').closest('article')).toHaveClass('card')
  })

  it('can skip the hover elevation', () => {
    render(<Card hover={false}>Fijo</Card>)
    expect(screen.getByText('Fijo').closest('article')).toHaveClass('card-static')
  })

  it('renders as a router link when `to` is set', () => {
    render(
      <MemoryRouter>
        <Card to="/forums">Foros</Card>
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: 'Foros' })).toHaveAttribute('href', '/forums')
  })
})

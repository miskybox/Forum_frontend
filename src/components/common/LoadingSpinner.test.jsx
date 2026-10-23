import { render, screen } from '@testing-library/react'
import LoadingSpinner from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('announces a busy loading state', () => {
    render(<LoadingSpinner />)
    const status = screen.getByText('Cargando').closest('output')
    expect(status).toHaveAttribute('aria-busy', 'true')
    expect(status).toHaveAttribute('aria-live', 'polite')
  })
})

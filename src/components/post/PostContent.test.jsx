import { render, screen } from '@testing-library/react'
import PostContent from './PostContent'

describe('PostContent', () => {
  it('renders one paragraph per block of text', () => {
    render(<PostContent post={{ content: 'Texto\n\nMás texto' }} />)
    expect(screen.getByText('Texto')).toBeInTheDocument()
    expect(screen.getByText('Más texto')).toBeInTheDocument()
  })

  it('renders nothing for empty content', () => {
    const { container } = render(<PostContent post={{ content: '' }} />)
    expect(container.querySelectorAll('p')).toHaveLength(0)
  })
})

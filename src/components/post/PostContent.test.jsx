import { render, screen, fireEvent } from '@testing-library/react'
import PostContent from './PostContent'
import { LanguageProvider } from '../../contexts/LanguageContext'

const wrap = (ui) => render(<LanguageProvider>{ui}</LanguageProvider>)

describe('PostContent', () => {
  it('renders one paragraph per block of text', () => {
    wrap(<PostContent post={{ content: 'Texto\n\nMás texto' }} />)
    expect(screen.getByText('Texto')).toBeInTheDocument()
    expect(screen.getByText('Más texto')).toBeInTheDocument()
  })

  it('renders nothing for empty content', () => {
    const { container } = wrap(<PostContent post={{ content: '' }} />)
    expect(container.querySelectorAll('p')).toHaveLength(0)
  })

  it('opens the lightbox from a gallery image', () => {
    wrap(<PostContent post={{ content: 'Ruta', imageUrls: ['https://example.com/a.jpg', 'https://example.com/b.jpg'] }} />)
    fireEvent.click(screen.getByRole('button', { name: /abrir imagen 1/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })
})

import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import Lightbox from './Lightbox'

const images = [
  { url: 'https://example.com/a.jpg', alt: 'Primera' },
  { url: 'https://example.com/b.jpg', alt: 'Segunda' },
]
const labels = { close: 'Cerrar', previous: 'Anterior', next: 'Siguiente', image: 'Imagen' }

describe('Lightbox', () => {
  it('shows the current image in a dialog', () => {
    render(
      <Lightbox images={images} index={0} onClose={vi.fn()} onIndexChange={vi.fn()} labels={labels} />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Primera' })).toHaveAttribute('src', images[0].url)
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
  })

  it('closes with Escape', () => {
    const onClose = vi.fn()
    render(
      <Lightbox images={images} index={0} onClose={onClose} onIndexChange={vi.fn()} labels={labels} />
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('moves to the next image with the arrow key', () => {
    const onIndexChange = vi.fn()
    render(
      <Lightbox images={images} index={0} onClose={vi.fn()} onIndexChange={onIndexChange} labels={labels} />
    )
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(onIndexChange).toHaveBeenCalledWith(1)
  })
})

import { render } from '@testing-library/react'
import Skeleton from './Skeleton'

describe('Skeleton', () => {
  it('renders the requested number of text lines', () => {
    const { container } = render(<Skeleton lines={3} />)
    expect(container.querySelectorAll('[aria-hidden="true"] span, [aria-hidden="true"].block').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.animate-pulse').length).toBe(3)
  })
})

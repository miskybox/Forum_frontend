import { render, screen } from '@testing-library/react'
import PageContainer from './PageContainer'

describe('PageContainer', () => {
  it('uses the wide max width by default', () => {
    render(<PageContainer>Home</PageContainer>)
    expect(screen.getByText('Home')).toHaveClass('max-w-7xl', 'px-gutter-sm')
  })

  it('can render a narrower editorial shell', () => {
    render(<PageContainer width="narrow">About</PageContainer>)
    expect(screen.getByText('About')).toHaveClass('max-w-3xl')
  })
})

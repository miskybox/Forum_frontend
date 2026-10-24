import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Chip, { FilterPill, Tag } from './Chip'

describe('Chip', () => {
  it('renders an inactive chip as a span when it is not clickable', () => {
    render(<Chip>Europa</Chip>)
    expect(screen.getByText('Europa').parentElement).toHaveClass('bg-surface-container-high/60')
  })

  it('toggles the active style and aria-pressed on a filter pill', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<FilterPill active onClick={onClick}>Senderismo</FilterPill>)
    const pill = screen.getByRole('button', { name: 'Senderismo' })
    expect(pill).toHaveAttribute('aria-pressed', 'true')
    expect(pill).toHaveClass('bg-secondary')
    await user.click(pill)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('calls onRemove without triggering onClick', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const onRemove = vi.fn()
    render(
      <Chip active onClick={onClick} onRemove={onRemove} removeLabel="Quitar Europa">
        Europa
      </Chip>
    )
    await user.click(screen.getByRole('button', { name: 'Quitar Europa' }))
    expect(onRemove).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('Tag', () => {
  it('renders a compact meta tag', () => {
    render(<Tag>#diario</Tag>)
    expect(screen.getByText('#diario')).toHaveClass('bg-secondary-fixed')
  })
})

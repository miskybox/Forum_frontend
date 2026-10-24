import { render, screen } from '@testing-library/react'
import Avatar, { AvatarStack } from './Avatar'

describe('Avatar', () => {
  it('shows initials when there is no image', () => {
    render(<Avatar name="Ana Ruiz" />)
    expect(screen.getByText('AR')).toBeInTheDocument()
  })

  it('shows a verified badge when requested', () => {
    render(<Avatar name="Ana" verified />)
    expect(screen.getByLabelText('Verificado')).toBeInTheDocument()
  })
})

describe('AvatarStack', () => {
  it('stacks avatars and shows the leftover count', () => {
    render(
      <AvatarStack
        people={[
          { name: 'Ana' },
          { name: 'Bruno' },
          { name: 'Carla' },
          { name: 'Diego' },
          { name: 'Elena' },
        ]}
        max={3}
      />
    )
    expect(screen.getByLabelText('Avatares')).toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
  })
})

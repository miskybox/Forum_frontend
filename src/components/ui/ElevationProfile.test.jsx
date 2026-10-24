import { render, screen } from '@testing-library/react'
import ElevationProfile from './ElevationProfile'

describe('ElevationProfile', () => {
  it('exposes the sparkline as an image with waypoint labels', () => {
    render(
      <ElevationProfile
        points={[200, 480, 350, 900]}
        labels={['km 0', 'Puerto', 'km 42']}
      />
    )
    expect(screen.getByRole('img', { name: 'Perfil de elevación' })).toBeInTheDocument()
    expect(screen.getByText('Puerto')).toBeInTheDocument()
  })
})

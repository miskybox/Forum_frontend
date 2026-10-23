import { render, screen } from '@testing-library/react'
import TelemetryStats from './TelemetryStats'

describe('TelemetryStats', () => {
  it('renders three metrics with units', () => {
    render(
      <TelemetryStats
        items={[
          { label: 'Distancia', value: '42', unit: 'km' },
          { label: 'Desnivel', value: '1.240', unit: 'm' },
          { label: 'Dificultad', value: 'Media' },
        ]}
      />
    )
    expect(screen.getByText('Distancia')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('km')).toBeInTheDocument()
    expect(screen.getByText('Media')).toBeInTheDocument()
  })
})

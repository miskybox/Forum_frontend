import { render, screen } from '@testing-library/react'
import { MdDirectionsBoat } from 'react-icons/md'
import RouteBadge from './RouteBadge'

describe('RouteBadge', () => {
  it('renders the label on the secondary half and the metric beside it', () => {
    render(<RouteBadge icon={MdDirectionsBoat} label="Ferry & Riel" metric="Nivel fácil" />)
    expect(screen.getByText('Ferry & Riel')).toBeInTheDocument()
    expect(screen.getByText('Nivel fácil')).toBeInTheDocument()
  })

  it('omits the metric half when no metric is given', () => {
    render(<RouteBadge label="Grupo de 4" />)
    expect(screen.getByText('Grupo de 4')).toBeInTheDocument()
    expect(screen.queryByText('Nivel fácil')).not.toBeInTheDocument()
  })
})

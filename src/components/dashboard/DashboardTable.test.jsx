import { render, screen } from '@testing-library/react'
import DashboardTable from './DashboardTable'

describe('DashboardTable', () => {
  it('renders headers and row cells', () => {
    render(
      <DashboardTable
        emptyTitle="No hay usuarios"
        rows={[{ id: 1, username: 'ana' }]}
        columns={[
          { key: 'user', header: 'Usuario', render: (row) => row.username },
        ]}
      />
    )
    expect(screen.getByRole('columnheader', { name: 'Usuario' })).toBeInTheDocument()
    expect(screen.getByText('ana')).toBeInTheDocument()
  })

  it('shows an empty state when there are no rows', () => {
    render(
      <DashboardTable
        emptyTitle="No hay foros"
        rows={[]}
        columns={[{ key: 'title', header: 'Título', render: () => null }]}
      />
    )
    expect(screen.getByRole('heading', { name: 'No hay foros' })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})

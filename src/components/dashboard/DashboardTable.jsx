import PropTypes from 'prop-types'
import EmptyState from '../ui/EmptyState'

const DashboardTable = ({ columns, rows, emptyIcon, emptyTitle }) => {
  if (!rows.length) {
    return <EmptyState icon={emptyIcon} title={emptyTitle} />
  }

  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-level-1 overflow-x-auto">
      <table className="w-full text-body-sm">
        <thead>
          <tr className="border-b border-outline-variant/40">
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-left px-space-md py-space-sm text-label-md text-on-surface-variant font-medium"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-outline-variant/20 last:border-0">
              {columns.map((column) => (
                <td key={column.key} className="px-space-md py-space-sm align-middle">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

DashboardTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    header: PropTypes.node.isRequired,
    render: PropTypes.func.isRequired,
  })).isRequired,
  rows: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  })).isRequired,
  emptyIcon: PropTypes.elementType,
  emptyTitle: PropTypes.string.isRequired,
}

export default DashboardTable

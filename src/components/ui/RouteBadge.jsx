import PropTypes from 'prop-types'

/**
 * Dual pill: icon + label on the secondary half, metric on the surface half
 * (e.g. "Ferry & Riel | Nivel fácil").
 */
const RouteBadge = ({ icon: Icon, label, metric, className = '' }) => (
  <span className={`inline-flex items-stretch max-w-full rounded-full overflow-hidden text-label-md font-semibold ${className}`}>
    <span className="inline-flex items-center gap-space-xs min-h-8 px-3 py-1 bg-secondary text-on-secondary">
      {Icon && <Icon className="text-body-sm shrink-0" aria-hidden="true" />}
      <span className="truncate">{label}</span>
    </span>
    {metric != null && metric !== '' && (
      <span className="inline-flex items-center min-h-8 px-3 py-1 bg-surface-container text-on-surface">
        {metric}
      </span>
    )}
  </span>
)

RouteBadge.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.node.isRequired,
  metric: PropTypes.node,
  className: PropTypes.string,
}

export default RouteBadge

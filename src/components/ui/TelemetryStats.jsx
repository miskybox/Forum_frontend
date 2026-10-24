import PropTypes from 'prop-types'

/**
 * Three-column route telemetry: uppercase caption + prominent metric.
 */
const TelemetryStats = ({ items = [], className = '' }) => (
  <dl className={`grid grid-cols-3 gap-space-sm bg-surface-container-low rounded-lg p-space-md ${className}`}>
    {items.map((item) => (
      <div key={item.label} className="min-w-0 text-center">
        <dt className="text-caption uppercase tracking-wider text-on-surface-variant">
          {item.label}
        </dt>
        <dd className="mt-space-xs text-title-md font-bold text-on-surface truncate">
          {item.value}
          {item.unit && (
            <span className="ml-1 text-label-md font-semibold text-on-surface-variant">
              {item.unit}
            </span>
          )}
        </dd>
      </div>
    ))}
  </dl>
)

TelemetryStats.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.node.isRequired,
      unit: PropTypes.string,
    })
  ),
  className: PropTypes.string,
}

export default TelemetryStats

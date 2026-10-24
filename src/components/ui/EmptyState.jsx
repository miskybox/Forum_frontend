import PropTypes from 'prop-types'

const EmptyState = ({ icon, title, description, action, className = '' }) => {
  const Icon = icon

  return (
    <div className={`bg-surface-container-lowest rounded-lg p-space-xl text-center shadow-level-1 ${className}`}>
      {Icon && (
        <span className="w-14 h-14 mx-auto mb-space-md rounded-full bg-surface-container flex items-center justify-center">
          <Icon className="text-headline-md text-secondary" aria-hidden="true" />
        </span>
      )}
      <h3 className="font-body text-title-md text-on-surface">{title}</h3>
      {description && <p className="mt-space-xs text-body-sm text-on-surface-variant">{description}</p>}
      {action && <div className="mt-space-lg flex justify-center">{action}</div>}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
}

export default EmptyState

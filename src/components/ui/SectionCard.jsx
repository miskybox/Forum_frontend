import PropTypes from 'prop-types'

/**
 * White rail widget with a title row (title, optional icon and action).
 */
const SectionCard = ({ title, icon: Icon, action, children, className = '', as = 'section' }) => {
  const Tag = as

  return (
    <Tag className={`bg-surface-container-lowest rounded-lg p-space-md shadow-level-1 ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-space-sm mb-space-sm">
          <h2 className="font-body text-title-md text-on-surface font-bold">{title}</h2>
          {action || (Icon && <Icon className="text-title-md text-on-surface-variant" aria-hidden="true" />)}
        </div>
      )}
      {children}
    </Tag>
  )
}

SectionCard.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.elementType,
  action: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  as: PropTypes.elementType,
}

export default SectionCard

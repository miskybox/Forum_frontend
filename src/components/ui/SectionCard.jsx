import PropTypes from 'prop-types'

const TONE_CLASS = {
  default: 'bg-surface-container-lowest shadow-level-1 ring-1 ring-outline-variant/35',
  sage: 'bg-secondary-fixed/55 shadow-level-1 ring-1 ring-secondary/20',
  clay: 'bg-primary-fixed/50 shadow-level-1 ring-1 ring-primary/20',
  forest: 'bg-tertiary-fixed/45 shadow-level-1 ring-1 ring-tertiary/20',
  mist: 'bg-surface-container-low shadow-level-1 ring-1 ring-outline-variant/50',
}

/**
 * Rail widget with a title row. `tone` tints the background so neighbouring
 * sections stay visually distinct.
 */
const SectionCard = ({ title, icon: Icon, action, children, className = '', as = 'section', tone = 'default' }) => {
  const Tag = as

  return (
    <Tag className={`rounded-lg p-space-md ${TONE_CLASS[tone] || TONE_CLASS.default} ${className}`}>
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
  tone: PropTypes.oneOf(['default', 'sage', 'clay', 'forest', 'mist']),
}

export default SectionCard

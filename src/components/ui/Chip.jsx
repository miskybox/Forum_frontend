import PropTypes from 'prop-types'
import { MdClose } from 'react-icons/md'

/**
 * Filter pill / chip: inactive, active, and optionally removable.
 * `FilterPill` is an alias for the same component.
 */
const Chip = ({
  active = false,
  onClick,
  onRemove,
  removeLabel = 'Quitar',
  children,
  className = '',
  type = 'button',
}) => {
  const tone = active
    ? 'bg-secondary text-on-secondary'
    : 'bg-surface-container-high/60 text-on-surface hover:bg-surface-container-highest'

  const body = (
    <>
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onRemove(event)
          }}
          className="inline-flex items-center justify-center w-6 h-6 -mr-1 rounded-full hover:bg-black/10"
          aria-label={removeLabel}
        >
          <MdClose className="text-body-sm" aria-hidden="true" />
        </button>
      )}
    </>
  )

  const classes = `inline-flex items-center gap-space-xs min-h-8 px-3 py-1 rounded-full text-label-md font-semibold ${tone} ${className}`

  if (onClick) {
    return (
      <button
        type={type}
        onClick={onClick}
        aria-pressed={active}
        className={classes}
      >
        {body}
      </button>
    )
  }

  return (
    <span className={classes}>
      {body}
    </span>
  )
}

Chip.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
  removeLabel: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
}

export const FilterPill = Chip

export const Tag = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-label-md font-semibold ${className}`}
  >
    {children}
  </span>
)

Tag.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default Chip

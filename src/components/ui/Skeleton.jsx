import PropTypes from 'prop-types'

const VARIANT = {
  text: 'h-4 w-full rounded-base',
  title: 'h-6 w-2/3 rounded-base',
  rect: 'h-32 w-full rounded-lg',
  circle: 'rounded-full w-10 h-10',
}

/**
 * Loading placeholder that respects prefers-reduced-motion via global CSS.
 */
const Skeleton = ({ variant = 'text', className = '', lines = 1 }) => {
  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-space-sm ${className}`} aria-hidden="true">
        {Array.from({ length: lines }, (_, index) => (
          <span
            key={index}
            className={`block bg-surface-container-high animate-pulse ${VARIANT.text} ${index === lines - 1 ? 'w-3/4' : ''}`}
          />
        ))}
      </div>
    )
  }

  return (
    <span
      className={`block bg-surface-container-high animate-pulse ${VARIANT[variant] || VARIANT.text} ${className}`}
      aria-hidden="true"
    />
  )
}

Skeleton.propTypes = {
  variant: PropTypes.oneOf(Object.keys(VARIANT)),
  className: PropTypes.string,
  lines: PropTypes.number,
}

export default Skeleton

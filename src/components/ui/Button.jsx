import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  icon: 'btn-icon',
}

const SIZES = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}

const Spinner = () => (
  <span
    className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
    aria-hidden="true"
  />
)

/**
 * Shared button: primary, secondary, ghost and icon variants, with sizes
 * and a loading state. Renders a React Router Link when `to` is set, or an
 * anchor when `href` is set.
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  to,
  href,
  target,
  rel,
  icon: Icon,
  iconPosition = 'left',
  children,
  className = '',
  onClick,
  ...props
}) => {
  const isDisabled = disabled || loading
  const classes = [
    'btn',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || '',
    className,
  ].filter(Boolean).join(' ')

  const content = (
    <>
      {loading && <Spinner />}
      {!loading && Icon && iconPosition === 'left' && (
        <Icon className="text-body-md shrink-0" aria-hidden="true" />
      )}
      {variant === 'icon'
        ? (!Icon && !loading ? children : null)
        : children}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon className="text-body-md shrink-0" aria-hidden="true" />
      )}
    </>
  )

  const shared = {
    className: classes,
    'aria-busy': loading || undefined,
    'aria-disabled': isDisabled || undefined,
    ...props,
  }

  if (to) {
    if (isDisabled) {
      return (
        <span {...shared} role="link" aria-disabled="true">
          {content}
        </span>
      )
    }
    return (
      <Link to={to} onClick={onClick} {...shared}>
        {content}
      </Link>
    )
  }

  if (href) {
    if (isDisabled) {
      return (
        <span {...shared} role="link" aria-disabled="true">
          {content}
        </span>
      )
    }
    return (
      <a href={href} target={target} rel={rel} onClick={onClick} {...shared}>
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      {...shared}
    >
      {content}
    </button>
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  size: PropTypes.oneOf(Object.keys(SIZES)),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  to: PropTypes.string,
  href: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
}

export default Button

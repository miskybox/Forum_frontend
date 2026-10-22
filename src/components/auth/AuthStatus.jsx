import PropTypes from 'prop-types'

const TONES = {
  success: 'bg-secondary-container text-on-secondary-fixed',
  error: 'bg-error-container text-on-error-container',
  info: 'bg-primary-fixed text-on-primary-fixed',
}

/**
 * Result card for auth flows (email sent, invalid link, password changed).
 */
const AuthStatus = ({ icon, tone = 'info', title, children, actions }) => {
  const Icon = icon

  return (
    <div className="text-center" role="status">
      <span className={`w-16 h-16 mx-auto mb-space-md rounded-full flex items-center justify-center ${TONES[tone]}`}>
        <Icon className="text-headline-md" aria-hidden="true" />
      </span>
      <h2 className="font-headline text-headline-sm text-on-surface">{title}</h2>
      <div className="mt-space-sm text-body-sm text-on-surface-variant space-y-space-xs">{children}</div>
      {actions && <div className="mt-space-lg flex flex-col gap-space-sm">{actions}</div>}
    </div>
  )
}

AuthStatus.propTypes = {
  icon: PropTypes.elementType.isRequired,
  tone: PropTypes.oneOf(Object.keys(TONES)),
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  actions: PropTypes.node,
}

export default AuthStatus

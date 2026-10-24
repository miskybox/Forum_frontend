import PropTypes from 'prop-types'

const TONES = {
  success: 'bg-success-light text-success-dark',
  warning: 'bg-warning-light text-warning-dark',
  error: 'bg-error-light text-error-dark',
  tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  muted: 'bg-surface-container text-on-surface',
}

const StatusChip = ({ tone = 'muted', children }) => (
  <span className={`inline-flex px-2 py-0.5 text-label-sm rounded-full font-medium ${TONES[tone] || TONES.muted}`}>
    {children}
  </span>
)

StatusChip.propTypes = {
  tone: PropTypes.oneOf(Object.keys(TONES)),
  children: PropTypes.node.isRequired,
}

export default StatusChip

import PropTypes from 'prop-types'

const SIZES = {
  small: 'h-6 w-6 border-2',
  medium: 'h-10 w-10 border-[3px]',
  large: 'h-16 w-16 border-4',
}

/**
 * Accessible loading indicator in the Tierra & Rumbo palette.
 */
const LoadingSpinner = ({ size = 'medium', label = 'Cargando' }) => (
  <output
    className="flex flex-col justify-center items-center p-space-lg"
    aria-live="polite"
    aria-busy="true"
  >
    <span
      className={`${SIZES[size] || SIZES.medium} border-primary border-t-transparent rounded-full animate-spin`}
      aria-hidden="true"
    />
    <span className="mt-space-md text-label-md uppercase tracking-wider text-primary">
      {label}
    </span>
  </output>
)

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(Object.keys(SIZES)),
  label: PropTypes.string,
}

export default LoadingSpinner

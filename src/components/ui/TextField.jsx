import PropTypes from 'prop-types'

/**
 * Labeled input or textarea with an accessible error message.
 */
const TextField = ({ id, label, error, multiline = false, hint, className = '', ...inputProps }) => {
  const Input = multiline ? 'textarea' : 'input'
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined

  return (
    <div className={className}>
      <label htmlFor={id} className="block mb-space-xs text-label-lg text-on-surface">
        {label}
      </label>
      <Input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`bg-surface-container-low ${error ? 'border-error' : ''} ${multiline ? 'resize-y' : ''}`}
        {...inputProps}
      />
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-caption text-on-surface-variant">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="mt-1 text-caption text-error">{error}</p>}
    </div>
  )
}

TextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  multiline: PropTypes.bool,
  className: PropTypes.string,
}

export default TextField

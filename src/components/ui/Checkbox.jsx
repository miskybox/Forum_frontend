import PropTypes from 'prop-types'

const Checkbox = ({
  id,
  label,
  error,
  hint,
  className = '',
  ...inputProps
}) => {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined

  return (
    <div className={className}>
      <label htmlFor={id} className="inline-flex items-start gap-space-sm cursor-pointer">
        <input
          id={id}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="choice-control"
          {...inputProps}
        />
        <span className="text-body-md text-on-surface pt-0.5">{label}</span>
      </label>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 ml-7 text-caption text-on-surface-variant">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 ml-7 text-caption text-error">{error}</p>
      )}
    </div>
  )
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  className: PropTypes.string,
}

export default Checkbox

import PropTypes from 'prop-types'

const describedByFor = (id, error, hint) =>
  [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined

const FieldChrome = ({ id, label, error, hint, className, children }) => (
  <div className={className}>
    {label && (
      <label htmlFor={id} className="block mb-space-xs text-label-lg text-on-surface">
        {label}
      </label>
    )}
    {children}
    {hint && !error && (
      <p id={`${id}-hint`} className="mt-1 text-caption text-on-surface-variant">{hint}</p>
    )}
    {error && (
      <p id={`${id}-error`} role="alert" className="mt-1 text-caption text-error">{error}</p>
    )}
  </div>
)

FieldChrome.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
}

const controlClass = (error, extra = '') =>
  `bg-surface-container-low ${error ? 'border-error' : ''} ${extra}`.trim()

export const Input = ({ id, label, error, hint, className = '', ...inputProps }) => (
  <FieldChrome id={id} label={label} error={error} hint={hint} className={className}>
    <input
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={describedByFor(id, error, hint)}
      className={controlClass(error)}
      {...inputProps}
    />
  </FieldChrome>
)

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  className: PropTypes.string,
}

export const Textarea = ({ id, label, error, hint, className = '', ...inputProps }) => (
  <FieldChrome id={id} label={label} error={error} hint={hint} className={className}>
    <textarea
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={describedByFor(id, error, hint)}
      className={controlClass(error, 'resize-y')}
      {...inputProps}
    />
  </FieldChrome>
)

Textarea.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  className: PropTypes.string,
}

export const Select = ({ id, label, error, hint, className = '', children, ...selectProps }) => (
  <FieldChrome id={id} label={label} error={error} hint={hint} className={className}>
    <select
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={describedByFor(id, error, hint)}
      className={controlClass(error)}
      {...selectProps}
    >
      {children}
    </select>
  </FieldChrome>
)

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  error: PropTypes.string,
  hint: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
}

export default Input

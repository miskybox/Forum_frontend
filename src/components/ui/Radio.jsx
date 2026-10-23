import PropTypes from 'prop-types'

export const Radio = ({
  id,
  name,
  label,
  className = '',
  ...inputProps
}) => (
  <label htmlFor={id} className={`inline-flex items-start gap-space-sm cursor-pointer ${className}`}>
    <input
      id={id}
      name={name}
      type="radio"
      className="choice-control"
      {...inputProps}
    />
    <span className="text-body-md text-on-surface pt-0.5">{label}</span>
  </label>
)

Radio.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.node.isRequired,
  className: PropTypes.string,
}

const RadioGroup = ({
  legend,
  name,
  value,
  onChange,
  options = [],
  error,
  className = '',
}) => (
  <fieldset className={className}>
    {legend && (
      <legend className="mb-space-xs text-label-lg text-on-surface">{legend}</legend>
    )}
    <div className="flex flex-col gap-space-sm">
      {options.map((option) => (
        <Radio
          key={option.value}
          id={`${name}-${option.value}`}
          name={name}
          label={option.label}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
        />
      ))}
    </div>
    {error && (
      <p role="alert" className="mt-1 text-caption text-error">{error}</p>
    )}
  </fieldset>
)

RadioGroup.propTypes = {
  legend: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.node.isRequired,
    })
  ),
  error: PropTypes.string,
  className: PropTypes.string,
}

export default RadioGroup

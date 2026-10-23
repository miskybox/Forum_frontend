import PropTypes from 'prop-types'
import { Input, Textarea } from './Input'

/**
 * Labeled input or textarea with an accessible error message.
 * Prefer `Input` / `Textarea` / `Select` for new code; this stays as a
 * compatibility wrapper for existing forms.
 */
const TextField = ({ multiline = false, ...props }) => (
  multiline ? <Textarea {...props} /> : <Input {...props} />
)

TextField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  hint: PropTypes.string,
  multiline: PropTypes.bool,
  className: PropTypes.string,
}

export default TextField

import PropTypes from 'prop-types'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  danger = false,
}) => {
  if (!open) return null

  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <p className="mt-space-md text-body-md text-on-surface-variant text-center">{message}</p>
      <div className="mt-space-lg flex justify-end gap-space-sm">
        <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          className={danger ? 'bg-error hover:opacity-90' : undefined}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  cancelLabel: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  danger: PropTypes.bool,
}

export default ConfirmDialog

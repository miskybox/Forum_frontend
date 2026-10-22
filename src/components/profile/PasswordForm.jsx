import { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-hot-toast'
import userService from '../../services/userService'
import { useLanguage } from '../../contexts/LanguageContext'
import TextField from '../ui/TextField'

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' }
const SPECIAL_CHARACTER = /[!@#$%^&*(),.?":{}|<>]/

const isStrongPassword = (value) =>
  value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && SPECIAL_CHARACTER.test(value)

const PasswordForm = ({ userId }) => {
  const { t } = useLanguage()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.currentPassword) next.currentPassword = t('profile.errors.currentPasswordRequired')
    if (!form.newPassword) next.newPassword = t('profile.errors.newPasswordRequired')
    else if (!isStrongPassword(form.newPassword)) next.newPassword = t('profile.errors.passwordRules')
    if (form.newPassword !== form.confirmPassword) next.confirmPassword = t('profile.errors.passwordsMismatch')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await userService.changePassword(userId, form.currentPassword, form.newPassword)
      setForm(EMPTY)
      toast.success(t('profile.passwordUpdated'))
    } catch (error) {
      console.error('Error updating password:', error)
      const message = error.response?.data?.message?.toLowerCase() || ''
      if (error.response?.status === 400 && message.includes('current')) {
        setErrors((prev) => ({ ...prev, currentPassword: t('profile.errors.currentPasswordWrong') }))
      } else {
        toast.error(t('profile.errors.passwordError'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-surface-container-lowest rounded-lg p-space-md sm:p-space-lg shadow-level-1 space-y-space-md">
      <h2 className="font-body text-headline-sm text-on-surface">{t('profile.password')}</h2>
      <TextField id="current-password" name="currentPassword" type="password" label={t('profile.currentPassword')} value={form.currentPassword} onChange={handleChange} error={errors.currentPassword} autoComplete="current-password" />
      <TextField id="new-password" name="newPassword" type="password" label={t('profile.newPassword')} value={form.newPassword} onChange={handleChange} error={errors.newPassword} hint={t('profile.errors.passwordRules')} autoComplete="new-password" />
      <TextField id="confirm-password" name="confirmPassword" type="password" label={t('profile.confirmPassword')} value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? t('profile.updating') : t('profile.updatePassword')}
        </button>
      </div>
    </form>
  )
}

PasswordForm.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}

export default PasswordForm

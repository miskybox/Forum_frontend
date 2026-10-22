import { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-hot-toast'
import userService from '../../services/userService'
import { useLanguage } from '../../contexts/LanguageContext'
import TextField from '../ui/TextField'

const EMAIL_PATTERN = /\S+@\S+\.\S+/

const ProfileEditForm = ({ user, onSaved }) => {
  const { t } = useLanguage()
  const [form, setForm] = useState({
    username: user.username || '',
    fullName: user.fullName || '',
    email: user.email || '',
    location: user.location || '',
    biography: user.biography || '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next = {}
    const username = form.username.trim()
    if (!username) next.username = t('profile.errors.usernameRequired')
    else if (username.length < 3 || username.length > 20) next.username = t('profile.errors.usernameLength')
    if (!form.fullName.trim()) next.fullName = t('profile.errors.fullNameRequired')
    if (!form.email.trim()) next.email = t('profile.errors.emailRequired')
    else if (!EMAIL_PATTERN.test(form.email)) next.email = t('profile.errors.emailInvalid')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      // Field names match the backend UserRequestDTO
      await userService.updateUser(user.id, {
        username: form.username.trim(),
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        location: form.location.trim(),
        biography: form.biography.trim(),
      })
      toast.success(t('profile.profileUpdated'))
      await onSaved?.()
    } catch (error) {
      console.error('Error updating profile:', error)
      const backendErrors = error.response?.data?.errors
      if (error.response?.status === 400 && backendErrors && typeof backendErrors === 'object') {
        setErrors((prev) => ({ ...prev, ...backendErrors }))
      } else {
        toast.error(error.response?.data?.message || t('profile.errors.updateError'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-surface-container-lowest rounded-lg p-space-md sm:p-space-lg shadow-level-1 space-y-space-md">
      <h2 className="font-body text-headline-sm text-on-surface">{t('profile.personalInfo')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        <TextField id="profile-username" name="username" label={t('profile.username')} value={form.username} onChange={handleChange} error={errors.username} autoComplete="username" required />
        <TextField id="profile-fullName" name="fullName" label={t('profile.fullName')} value={form.fullName} onChange={handleChange} error={errors.fullName} autoComplete="name" required />
        <TextField id="profile-email" name="email" type="email" label={t('profile.email')} value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" required />
        <TextField id="profile-location" name="location" label={t('profile.location')} placeholder={t('profile.locationPlaceholder')} value={form.location} onChange={handleChange} error={errors.location} maxLength={100} />
      </div>
      <TextField
        id="profile-biography"
        name="biography"
        label={t('profile.bio')}
        placeholder={t('profile.bioPlaceholder')}
        value={form.biography}
        onChange={handleChange}
        error={errors.biography}
        multiline
        rows={4}
        maxLength={1000}
        hint={`${form.biography.length}/1000`}
      />
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? t('profile.updating') : t('profile.updateProfile')}
        </button>
      </div>
    </form>
  )
}

ProfileEditForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    username: PropTypes.string,
    fullName: PropTypes.string,
    email: PropTypes.string,
    location: PropTypes.string,
    biography: PropTypes.string,
  }).isRequired,
  onSaved: PropTypes.func,
}

export default ProfileEditForm

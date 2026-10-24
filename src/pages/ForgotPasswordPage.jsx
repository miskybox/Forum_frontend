import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MdInfoOutline, MdMarkEmailRead } from 'react-icons/md'
import { useLanguage } from '../contexts/LanguageContext'
import authService from '../services/authService'
import AuthLayout from '../components/auth/AuthLayout'
import AuthStatus from '../components/auth/AuthStatus'
import TextField from '../components/ui/TextField'

const ForgotPasswordPage = () => {
  const { t } = useLanguage()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error(t('auth.passwordReset.emailLabel'))
      return
    }

    setIsLoading(true)
    try {
      await authService.forgotPassword(email)
    } catch (error) {
      // Same answer either way so we never reveal whether the email exists
      console.error('Error requesting password reset:', error)
    } finally {
      setEmailSent(true)
      toast.success(t('auth.passwordReset.checkEmailDescription'))
      setIsLoading(false)
    }
  }

  const demoNote = (
    <p className="flex items-start gap-space-xs rounded-lg p-space-md bg-primary-fixed text-on-primary-fixed text-body-sm">
      <MdInfoOutline className="text-title-md flex-shrink-0" aria-hidden="true" />
      {t('auth.passwordReset.demoNote')}
    </p>
  )

  const footer = (
    <p className="text-center">
      <Link to="/login" className="inline-flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary">
        <span aria-hidden="true">←</span> {t('auth.passwordReset.backToLogin')}
      </Link>
    </p>
  )

  return (
    <AuthLayout title={t('auth.passwordReset.title')} subtitle={t('auth.passwordReset.subtitle')} before={demoNote} after={footer}>
      {emailSent ? (
        <AuthStatus
          icon={MdMarkEmailRead}
          tone="success"
          title={t('auth.passwordReset.checkEmail')}
          actions={
            <>
              <Link to="/login" className="btn btn-primary w-full">{t('auth.passwordReset.backToLogin')}</Link>
              <button
                type="button"
                className="btn btn-outline w-full"
                onClick={() => {
                  setEmailSent(false)
                  setEmail('')
                }}
              >
                {t('auth.passwordReset.tryAnotherEmail')}
              </button>
            </>
          }
        >
          <p>{t('auth.passwordReset.checkEmailDescription')}</p>
          <p>{t('auth.passwordReset.linkExpiry')}</p>
        </AuthStatus>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-space-md" noValidate>
          <TextField
            id="email"
            type="email"
            label={t('auth.passwordReset.emailLabel')}
            placeholder={t('auth.passwordReset.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} className="btn btn-primary w-full" aria-busy={isLoading}>
            {isLoading ? t('auth.passwordReset.sending') : t('auth.passwordReset.sendButton')}
          </button>
        </form>
      )}
    </AuthLayout>
  )
}

export default ForgotPasswordPage

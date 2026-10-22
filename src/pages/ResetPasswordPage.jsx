import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MdCheckCircle, MdLinkOff, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { useLanguage } from '../contexts/LanguageContext'
import authService from '../services/authService'
import AuthLayout from '../components/auth/AuthLayout'
import AuthStatus from '../components/auth/AuthStatus'
import TextField from '../components/ui/TextField'

const ResetPasswordPage = () => {
  const { t } = useLanguage()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isValidToken, setIsValidToken] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setIsValidating(false)
        setIsValidToken(false)
        return
      }
      try {
        await authService.validateResetToken(token)
        setIsValidToken(true)
      } catch (error) {
        console.error('Error validating reset token:', error)
        setIsValidToken(false)
        toast.error(t('auth.passwordReset.invalidLinkExpired'))
      } finally {
        setIsValidating(false)
      }
    }
    validateToken()
  }, [token, t])

  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error(t('auth.passwordReset.passwordsNotMatch'))
      return
    }
    setIsLoading(true)
    try {
      await authService.resetPassword(token, newPassword)
      setResetSuccess(true)
      toast.success(t('auth.passwordReset.successTitle'))
    } catch (error) {
      toast.error(error.response?.data?.message || t('auth.errors.genericError'))
    } finally {
      setIsLoading(false)
    }
  }

  let content
  if (isValidating) {
    content = (
      <output className="block text-center py-space-lg" aria-live="polite">
        <span className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-fixed border-t-primary" aria-hidden="true" />
        <span className="block mt-space-sm text-body-sm text-on-surface-variant">{t('auth.passwordReset.validatingLink')}</span>
      </output>
    )
  } else if (!isValidToken) {
    content = (
      <AuthStatus
        icon={MdLinkOff}
        tone="error"
        title={t('auth.passwordReset.invalidLink')}
        actions={
          <>
            <Link to="/forgot-password" className="btn btn-primary w-full">{t('auth.passwordReset.requestNewLink')}</Link>
            <Link to="/login" className="btn btn-outline w-full">{t('auth.passwordReset.backToLogin')}</Link>
          </>
        }
      >
        <p>{token ? t('auth.passwordReset.invalidLinkExpired') : t('auth.passwordReset.invalidLinkNoToken')}</p>
      </AuthStatus>
    )
  } else if (resetSuccess) {
    content = (
      <AuthStatus
        icon={MdCheckCircle}
        tone="success"
        title={t('auth.passwordReset.successTitle')}
        actions={<Link to="/login" className="btn btn-primary w-full">{t('auth.loginTitle')}</Link>}
      >
        <p>{t('auth.passwordReset.successMessage')}</p>
      </AuthStatus>
    )
  } else {
    content = (
      <form onSubmit={handleSubmit} className="space-y-space-md" noValidate>
        <div className="relative">
          <TextField
            id="newPassword"
            type={showPassword ? 'text' : 'password'}
            label={t('auth.passwordReset.newPassword')}
            hint={t('auth.passwordReset.passwordHint')}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
            disabled={isLoading}
            className="[&_input]:pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-[2.1rem] w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            aria-pressed={showPassword}
          >
            {showPassword ? <MdVisibilityOff aria-hidden="true" /> : <MdVisibility aria-hidden="true" />}
          </button>
        </div>
        <TextField
          id="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          label={t('auth.passwordReset.confirmNewPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={passwordsMismatch ? t('auth.passwordReset.passwordsNotMatch') : undefined}
          autoComplete="new-password"
          required
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || passwordsMismatch} className="btn btn-primary w-full" aria-busy={isLoading}>
          {isLoading ? t('auth.passwordReset.resetting') : t('auth.passwordReset.resetButton')}
        </button>
      </form>
    )
  }

  const footer = (
    <p className="text-center">
      <Link to="/login" className="inline-flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary">
        <span aria-hidden="true">←</span> {t('auth.passwordReset.backToLogin')}
      </Link>
    </p>
  )

  return (
    <AuthLayout title={t('auth.passwordReset.newPasswordTitle')} subtitle={t('auth.passwordReset.newPasswordSubtitle')} after={footer}>
      {content}
    </AuthLayout>
  )
}

export default ResetPasswordPage

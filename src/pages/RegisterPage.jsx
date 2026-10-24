import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdWarningAmber } from 'react-icons/md'
import RegisterForm from '../components/auth/RegisterForm'
import AuthLayout from '../components/auth/AuthLayout'
import useAuth from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'

const RegisterPage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const footer = (
    <div className="space-y-space-md">
      <div className="rounded-lg p-space-md bg-primary-fixed text-on-primary-fixed" data-testid="demo-disclaimer">
        <p className="flex items-center gap-space-xs text-label-lg uppercase tracking-wider">
          <MdWarningAmber className="text-title-md" aria-hidden="true" />
          {t('demo.disclaimerTitle')}
        </p>
        <p className="mt-1 text-body-sm">{t('demo.disclaimerRegister')}</p>
        <p className="mt-1 text-caption">{t('demo.existingAccounts')}</p>
      </div>
      <div className="text-center space-y-space-sm">
        <p className="text-body-sm text-on-surface-variant">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="font-semibold">{t('auth.loginButton')}</Link>
        </p>
        <Link to="/" className="inline-flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary">
          <span aria-hidden="true">←</span> {t('common.back')}
        </Link>
      </div>
    </div>
  )

  return (
    <AuthLayout title={t('auth.registerTitle')} subtitle={t('auth.registerSubtitle')} after={footer}>
      <RegisterForm />
    </AuthLayout>
  )
}

export default RegisterPage

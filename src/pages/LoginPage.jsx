import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MdInfoOutline } from 'react-icons/md'
import LoginForm from '../components/auth/LoginForm'
import AuthLayout from '../components/auth/AuthLayout'
import useAuth from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import { getSafeRedirectPath } from '../utils/sanitize'

// Public demo account (USER role, no privileges) so visitors can try the app
// without registering. Can be overridden with environment variables.
const demoUsername = import.meta.env.VITE_DEMO_USERNAME || 'viajero_demo'
const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'Demo1234!'
const showDemoCredentials = import.meta.env.VITE_SHOW_DEMO_CREDENTIALS !== 'false'

const LoginPage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()

  useEffect(() => {
    if (isAuthenticated) {
      // Security: validate redirect path to prevent open redirects
      const from = getSafeRedirectPath(location.state?.from?.pathname, '/')
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const demoBanner = showDemoCredentials && (
    <div className="rounded-lg p-space-md bg-secondary-container text-on-secondary-fixed" data-testid="demo-banner">
      <div className="flex items-start gap-space-sm">
        <MdInfoOutline className="text-title-md flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="min-w-0">
          <h2 className="font-body text-label-lg uppercase tracking-wider">{t('demo.title')}</h2>
          <p className="mt-1 text-body-sm">{t('demo.description')}</p>
          <p className="mt-space-sm flex flex-wrap items-center justify-between gap-space-xs p-space-sm rounded-base bg-surface-container-lowest/70 text-body-sm">
            <span className="font-semibold">{t('demo.roleUser')}</span>
            <code className="font-mono text-on-surface">{demoUsername} / {demoPassword}</code>
          </p>
          <p className="mt-space-xs text-caption italic">{t('demo.disclaimer')}</p>
        </div>
      </div>
    </div>
  )

  const footer = (
    <div className="text-center space-y-space-sm">
      <p className="text-body-sm text-on-surface-variant">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="font-semibold">{t('auth.registerButton')}</Link>
      </p>
      <Link to="/" className="inline-flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary">
        <span aria-hidden="true">←</span> {t('common.back')}
      </Link>
    </div>
  )

  return (
    <AuthLayout title={t('auth.loginTitle')} subtitle={t('auth.loginSubtitle')} before={demoBanner} after={footer}>
      <LoginForm />
    </AuthLayout>
  )
}

export default LoginPage

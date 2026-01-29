import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import useAuth from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import { getSafeRedirectPath } from '../utils/sanitize'

/**
 * LoginPage con tema Adventure Explorer Retro
 */
const LoginPage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  
  useEffect(() => {
    if (isAuthenticated) {
      // Security: Validate redirect path to prevent open redirect attacks
      const from = getSafeRedirectPath(location.state?.from?.pathname, '/')
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])
  
  return (
    <div className="py-8 sm:py-12 relative overflow-hidden">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6 animate-fade-in">
            <h1 className="text-2xl md:text-3xl font-bold text-text-darkest tracking-normal mb-2">
              {t('auth.loginTitle')}
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-accent-dark to-transparent"></div>
          </div>
          
          {/* Formulario */}
          <div className="card border-ocean-600 animate-slide-in relative z-50">
            <LoginForm />
          </div>
          
          {/* Links adicionales */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm font-bold text-text-dark">
              {t('auth.noAccount')}
            </p>
            <Link
              to="/register"
              className="inline-block btn btn-outline text-midnight border-midnight hover:bg-golden hover:border-golden hover:text-midnight px-6 py-3 transition-all"
            >
              <span className="flex items-center space-x-2">
                <span>{t('auth.registerButton')}</span>
              </span>
            </Link>
            <div className="pt-4">
              <Link
                to="/"
                className="text-sm font-bold text-text-dark hover:text-accent-dark transition-colors inline-flex items-center space-x-2"
              >
                <span>←</span>
                <span>{t('common.back')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

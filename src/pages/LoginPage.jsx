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

          {/* Banner Demo */}
          <div className="mb-6 animate-fade-in" data-testid="demo-banner">
            <div className="bg-gradient-to-br from-ocean-900/90 to-midnight/90 border-2 border-ocean-500/50 rounded-xl p-5 shadow-lg backdrop-blur-sm">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-ocean-500/20 rounded-lg p-2 flex-shrink-0">
                  <svg className="w-5 h-5 text-ocean-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ocean-300 uppercase tracking-wider mb-1">
                    {t('demo.title')}
                  </h3>
                  <p className="text-xs text-ocean-100/80 leading-relaxed">
                    {t('demo.description')}
                  </p>
                </div>
              </div>
              <div className="bg-dark/40 rounded-lg p-3 space-y-2 border border-ocean-600/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ocean-200/70 font-medium">{t('demo.roleUser')}</span>
                  <code className="text-ocean-300 font-mono bg-ocean-900/50 px-2 py-0.5 rounded">viajero_demo / Demo1234!</code>
                </div>
                <div className="border-t border-ocean-700/30"></div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ocean-200/70 font-medium">{t('demo.roleMod')}</span>
                  <code className="text-ocean-300 font-mono bg-ocean-900/50 px-2 py-0.5 rounded">moderador_demo / Demo1234!</code>
                </div>
                <div className="border-t border-ocean-700/30"></div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ocean-200/70 font-medium">{t('demo.roleAdmin')}</span>
                  <code className="text-ocean-300 font-mono bg-ocean-900/50 px-2 py-0.5 rounded">admin_demo / Demo1234!</code>
                </div>
              </div>
              <p className="text-xs text-ocean-200/50 mt-3 text-center italic">
                {t('demo.disclaimer')}
              </p>
            </div>
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

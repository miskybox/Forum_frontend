import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RegisterForm from '../components/auth/RegisterForm'
import useAuth from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * RegisterPage con tema Adventure Explorer Retro
 */
const RegisterPage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])
  
  return (
    <div className="min-h-screen py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      {/* Efectos de fondo sutiles */}
      {/* Background subtle effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 30 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-primary-400 rounded-full opacity-60 animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="mb-6">
              <div className="text-6xl mb-4">🗺️</div>
              <h1 className="text-4xl md:text-5xl font-display text-primary-500 font-bold tracking-wider mb-2">
                {t('auth.registerTitle')}
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary-400 to-transparent mb-4"></div>
              <p className="text-sm font-bold text-secondary-500 opacity-80 uppercase tracking-wider">
                {t('auth.registerTitle')}
              </p>
            </div>
          </div>
          
          {/* Formulario */}
          <div className="card border-primary-600 animate-slide-in">
            <RegisterForm />
          </div>
          
          {/* Links adicionales */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm font-bold text-primary-400 opacity-70">
              {t('auth.hasAccount')}
            </p>
            <Link
              to="/login"
              className="inline-block btn btn-outline text-primary-400 border-primary-600 px-6 py-3"
            >
              <span className="flex items-center space-x-2">
                <span>🗺️</span>
                <span>{t('auth.loginButton')}</span>
              </span>
            </Link>
            <div className="pt-4">
              <Link
                to="/"
                className="text-sm font-bold text-secondary-500 hover:text-primary-400 transition-colors inline-flex items-center space-x-2"
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

export default RegisterPage

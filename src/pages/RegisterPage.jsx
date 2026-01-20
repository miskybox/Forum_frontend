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
                  className="absolute w-1 h-1 bg-ocean-400 rounded-full opacity-60 animate-float"
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
              <div className="w-20 h-20 mx-auto mb-4 bg-aqua rounded-full flex items-center justify-center shadow-lg border-2 border-midnight">
                <svg className="w-10 h-10 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-midnight tracking-normal mb-2">
                {t('auth.registerTitle')}
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-ocean-400 to-transparent mb-4"></div>
              <p className="text-sm font-bold text-terracotta-500 opacity-80 uppercase tracking-normal">
                {t('auth.registerTitle')}
              </p>
            </div>
          </div>
          
          {/* Formulario */}
          <div className="card border-ocean-600 animate-slide-in">
            <RegisterForm />
          </div>
          
          {/* Links adicionales */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm font-bold text-ocean-400 opacity-70">
              {t('auth.hasAccount')}
            </p>
            <Link
              to="/login"
              className="inline-block btn btn-outline text-midnight border-midnight hover:bg-aqua px-6 py-3 transition-all"
            >
              <span className="flex items-center space-x-2">
                <span>{t('auth.loginButton')}</span>
              </span>
            </Link>
            <div className="pt-4">
              <Link
                to="/"
                className="text-sm font-bold text-terracotta-500 hover:text-ocean-400 transition-colors inline-flex items-center space-x-2"
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

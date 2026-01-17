import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import useAuth from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'

// Generar estrellas una sola vez fuera del componente
const generateStars = () => 
  Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2,
  }))

const STARS = generateStars()

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
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])
  
  return (
    <div className="min-h-screen py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      {/* Efectos de fondo sutiles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-ocean-400 rounded-full opacity-60 animate-float"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-golden rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-darkest tracking-normal mb-2">
                {t('auth.loginTitle')}
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-accent-dark to-transparent mb-4"></div>
              <p className="text-sm font-bold text-text-dark uppercase tracking-normal">
                {t('auth.loginTitle')}
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

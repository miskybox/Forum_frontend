import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import LoginForm from '../components/auth/LoginForm'
import useAuth from '../hooks/useAuth'

/**
 * LoginPage con tema Space/Alien retro
 */
const LoginPage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])
  
  return (
    <div className="theme-space min-h-screen py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      {/* Efectos de fondo espacial */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-space-neon rounded-full opacity-60 animate-float"
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
              <div className="text-6xl mb-4 animate-pulse-neon">👽</div>
              <h1 className="text-4xl md:text-5xl font-display text-space-neon neon-text mb-2">
                ACCESO
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-space-neon to-transparent mb-4"></div>
              <p className="text-sm font-retro text-space-green opacity-80 uppercase tracking-wider">
                INGRESA A TU CUENTA
              </p>
            </div>
          </div>
          
          {/* Formulario */}
          <div className="card border-space-neon animate-slide-in">
            <LoginForm />
          </div>
          
          {/* Links adicionales */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-sm font-retro text-space-neon opacity-70">
              ¿No tienes cuenta?
            </p>
            <Link 
              to="/register"
              className="inline-block btn btn-outline text-space-neon border-space-neon px-6 py-3"
            >
              <span className="flex items-center space-x-2">
                <span>🚀</span>
                <span>CREAR CUENTA</span>
              </span>
            </Link>
            <div className="pt-4">
              <Link 
                to="/"
                className="text-sm font-retro text-space-green hover:text-space-neon transition-colors inline-flex items-center space-x-2"
              >
                <span>←</span>
                <span>VOLVER AL INICIO</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Navbar con diseño accesible y selector de idioma
 */
const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const { theme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Configuración de temas
  const themeConfig = {
    retro: {
      bg: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900',
      border: 'border-cyan-500',
      text: 'text-cyan-400',
      hover: 'hover:text-cyan-300',
      icon: '🌎'
    },
    adventure: {
      bg: 'bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900',
      border: 'border-amber-400',
      text: 'text-amber-300',
      hover: 'hover:text-amber-200',
      icon: '🏺'
    },
    future: {
      bg: 'bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900',
      border: 'border-indigo-400',
      text: 'text-indigo-300',
      hover: 'hover:text-indigo-200',
      icon: '⚡'
    },
    jungle: {
      bg: 'bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900',
      border: 'border-emerald-400',
      text: 'text-emerald-300',
      hover: 'hover:text-emerald-200',
      icon: '🌴'
    },
    tech: {
      bg: 'bg-gradient-to-r from-rose-900 via-slate-900 to-rose-900',
      border: 'border-rose-400',
      text: 'text-rose-300',
      hover: 'hover:text-rose-200',
      icon: '🤖'
    },
    space: {
      bg: 'bg-gradient-to-r from-violet-900 via-slate-900 to-violet-900',
      border: 'border-violet-400',
      text: 'text-violet-300',
      hover: 'hover:text-violet-200',
      icon: '👽'
    }
  }

  const currentTheme = themeConfig[theme] || themeConfig.retro

  // Links de navegación
  const navLinks = [
    { to: '/', label: t('nav.home'), icon: '🏠' },
    { to: '/forums', label: t('nav.forums'), icon: '💬' },
    { to: '/trivia', label: t('nav.trivia'), icon: '🎯' },
    { to: '/travel', label: t('nav.map'), icon: '🗺️' },
    { to: '/profile', label: t('nav.profile'), icon: '👤', protected: true },
  ]

  return (
    <nav className={`${currentTheme.bg} border-b-2 ${currentTheme.border} sticky top-0 z-50 shadow-lg`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <span className="text-3xl sm:text-4xl">{currentTheme.icon}</span>
            <span className={`${currentTheme.text} text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide`}
                  style={{ fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif" }}>
              Forum<span className="text-white">Viajeros</span>
            </span>
          </Link>
          
          {/* Menú desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks
              .filter(link => !link.protected || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${currentTheme.text} ${currentTheme.hover} flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-medium transition-all duration-200 hover:bg-white/10`}
                  style={{ fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif" }}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
          </div>
          
          {/* Botones de usuario y selector de idioma */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Selector de idioma */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${currentTheme.text} hover:bg-white/10 transition-all duration-200`}
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              <span className="text-xl sm:text-2xl">
                {language === 'es' ? '🇪🇸' : '🇬🇧'}
              </span>
              <span className="hidden sm:inline text-sm font-medium uppercase">
                {language}
              </span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`${currentTheme.text} ${currentTheme.border} border-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base hover:bg-white/10 transition-all duration-200 flex items-center space-x-2`}
                  style={{ fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif" }}
                >
                  <span className="text-lg">👤</span>
                  <span className="hidden sm:inline">{currentUser?.username || 'Usuario'}</span>
                  <span className="text-xs">▼</span>
                </button>
                
                {/* Menú desplegable */}
                {isProfileMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-52 ${currentTheme.bg} ${currentTheme.border} border-2 rounded-lg p-2 space-y-1 shadow-xl`}>
                    <Link
                      to="/profile"
                      className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-white/10`}
                      onClick={() => setIsProfileMenuOpen(false)}
                      style={{ fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif" }}
                    >
                      👤 {t('nav.myProfile')}
                    </Link>
                    <Link
                      to="/forums/create"
                      className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-white/10`}
                      onClick={() => setIsProfileMenuOpen(false)}
                      style={{ fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif" }}
                    >
                      ✍️ {t('nav.createForum')}
                    </Link>
                    {currentUser?.roles?.includes('ROLE_MODERATOR') && (
                      <Link
                        to="/moderator/dashboard"
                        className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-white/10`}
                        onClick={() => setIsProfileMenuOpen(false)}
                        style={{ fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif" }}
                      >
                        🛡️ Panel Moderador
                      </Link>
                    )}
                    {currentUser?.roles?.includes('ROLE_ADMIN') && (
                      <Link
                        to="/admin/dashboard"
                        className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-white/10`}
                        onClick={() => setIsProfileMenuOpen(false)}
                        style={{ fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif" }}
                      >
                        ⚙️ Panel Admin
                      </Link>
                    )}
                    <div className="border-t border-current opacity-30 my-1"></div>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        handleLogout()
                      }}
                      className={`block w-full text-left ${currentTheme.text} ${currentTheme.hover} px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-white/10`}
                      style={{ fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif" }}
                    >
                      🚪 {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`${currentTheme.text} ${currentTheme.border} border-2 px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base hover:bg-white/10 transition-all duration-200`}
                  style={{ fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif" }}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className={`bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg font-medium text-sm sm:text-base hover:from-cyan-400 hover:to-blue-400 transition-all duration-200 shadow-md`}
                  style={{ fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif" }}
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
            
            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden ${currentTheme.text} p-2 rounded-lg hover:bg-white/10 transition-all duration-200`}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className={`lg:hidden ${currentTheme.bg} border-t ${currentTheme.border} py-4 shadow-lg`}>
          <div className="container mx-auto px-4 space-y-2">
            {navLinks
              .filter(link => !link.protected || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-3 rounded-lg font-medium text-base border-l-4 ${currentTheme.border} hover:bg-white/10 transition-all duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif" }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{link.icon}</span>
                    <span>{link.label}</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

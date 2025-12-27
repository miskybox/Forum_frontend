import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useTheme } from '../../contexts/ThemeContext'
import { useLanguage } from '../../contexts/LanguageContext'
import logo from '../../assets/logoFV.png'

/**
 * Navbar con diseño accesible WCAG AA/AAA compliant
 */
const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const { theme, isDarkMode, toggleDarkMode } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Configuración de tema ACCESIBLE - Colores con alto contraste WCAG AA/AAA
  const themeConfig = {
    retro: {
      bg: 'bg-primary-50',
      border: 'border-primary-600',
      text: 'text-primary-800 dark:text-primary-100',
      hover: 'hover:text-primary-600 dark:hover:text-primary-200',
      hoverBg: 'hover:bg-primary-100 dark:hover:bg-primary-800',
      icon: '🗺️'
    },
    adventure: {
      bg: 'bg-primary-50',
      border: 'border-primary-600',
      text: 'text-primary-800 dark:text-primary-100',
      hover: 'hover:text-primary-600 dark:hover:text-primary-200',
      hoverBg: 'hover:bg-primary-100 dark:hover:bg-primary-800',
      icon: '🏺'
    },
    future: {
      bg: 'bg-secondary-50',
      border: 'border-secondary-600',
      text: 'text-secondary-800 dark:text-secondary-100',
      hover: 'hover:text-secondary-600 dark:hover:text-secondary-200',
      hoverBg: 'hover:bg-secondary-100 dark:hover:bg-secondary-800',
      icon: '⚡'
    },
    jungle: {
      bg: 'bg-secondary-50',
      border: 'border-secondary-600',
      text: 'text-secondary-800 dark:text-secondary-100',
      hover: 'hover:text-secondary-600 dark:hover:text-secondary-200',
      hoverBg: 'hover:bg-secondary-100 dark:hover:bg-secondary-800',
      icon: '🌴'
    },
    tech: {
      bg: 'bg-accent-50',
      border: 'border-accent-700',
      text: 'text-accent-800 dark:text-accent-100',
      hover: 'hover:text-accent-600 dark:hover:text-accent-200',
      hoverBg: 'hover:bg-accent-100 dark:hover:bg-accent-800',
      icon: '🤖'
    },
    space: {
      bg: 'bg-primary-50',
      border: 'border-primary-600',
      text: 'text-primary-800 dark:text-primary-100',
      hover: 'hover:text-primary-600 dark:hover:text-primary-200',
      hoverBg: 'hover:bg-primary-100 dark:hover:bg-primary-800',
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
    <nav className={`${currentTheme.bg} border-b-2 ${currentTheme.border} sticky top-0 z-50 shadow-lg`} role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <img
              src={logo}
              alt="ForumViajeros - Travel Community"
              className="h-10 sm:h-12 lg:h-14 w-auto transition-transform duration-200"
            />
          </Link>

          {/* Menú desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks
              .filter(link => !link.protected || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${currentTheme.text} ${currentTheme.hover} ${currentTheme.hoverBg} flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-bold transition-all duration-200 tracking-wide min-h-[44px]`}
                >
                  <span className="text-xl" aria-hidden="true">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
          </div>

          {/* Botones de usuario y selector de idioma */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* Toggle Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className={`flex items-center px-3 py-2 rounded-lg ${currentTheme.text} ${currentTheme.hoverBg} transition-all duration-200 min-h-[44px] min-w-[44px] cursor-pointer hover:scale-110`}
              title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
              aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              <span className="text-xl sm:text-2xl" aria-hidden="true">
                {isDarkMode ? '☀️' : '🌙'}
              </span>
            </button>

            {/* Selector de idioma */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg ${currentTheme.text} ${currentTheme.hoverBg} transition-all duration-200 min-h-[44px] cursor-pointer hover:scale-110`}
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              {/* Bandera de España: rojo-amarillo-rojo */}
              {language === 'es' ? (
                <div className="flex flex-col w-6 h-4 rounded overflow-hidden border border-primary-400" aria-hidden="true">
                  <div className="h-1/4 bg-red-600"></div>
                  <div className="h-2/4 bg-yellow-400"></div>
                  <div className="h-1/4 bg-red-600"></div>
                </div>
              ) : (
                /* Bandera de Inglaterra: Cruz de San Jorge (fondo blanco + cruz roja) */
                <div className="flex items-center justify-center w-6 h-4 bg-white rounded overflow-hidden border border-primary-400 relative" aria-hidden="true">
                  <div className="absolute w-full h-1 bg-red-600"></div>
                  <div className="absolute h-full w-1 bg-red-600"></div>
                </div>
              )}
              <span className="text-sm font-bold uppercase">
                {language === 'es' ? 'ES' : 'EN'}
              </span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`${currentTheme.text} ${currentTheme.border} border-2 px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base ${currentTheme.hoverBg} transition-all duration-200 flex items-center space-x-2 min-h-[44px]`}
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <span className="text-lg" aria-hidden="true">👤</span>
                  <span className="hidden sm:inline">{currentUser?.username || t('nav.user')}</span>
                  <span className="text-xs" aria-hidden="true">▼</span>
                </button>

                {/* Menú desplegable */}
                {isProfileMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-52 ${currentTheme.bg} ${currentTheme.border} border-2 rounded-lg p-2 space-y-1 shadow-xl`} role="menu">
                    <Link
                      to="/profile"
                      className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${currentTheme.hoverBg} min-h-[44px] flex items-center`}
                      onClick={() => setIsProfileMenuOpen(false)}
                      role="menuitem"
                    >
                      <span aria-hidden="true">👤</span> <span className="ml-2">{t('nav.myProfile')}</span>
                    </Link>
                    <Link
                      to="/forums/create"
                      className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${currentTheme.hoverBg} min-h-[44px] flex items-center`}
                      onClick={() => setIsProfileMenuOpen(false)}
                      role="menuitem"
                    >
                      <span aria-hidden="true">✍️</span> <span className="ml-2">{t('nav.createForum')}</span>
                    </Link>
                    {currentUser?.roles?.includes('ROLE_MODERATOR') && (
                      <Link
                        to="/moderator/dashboard"
                        className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${currentTheme.hoverBg} min-h-[44px] flex items-center`}
                        onClick={() => setIsProfileMenuOpen(false)}
                        role="menuitem"
                      >
                        <span aria-hidden="true">🛡️</span> <span className="ml-2">{t('nav.moderator') || 'Panel Moderador'}</span>
                      </Link>
                    )}
                    {currentUser?.roles?.includes('ROLE_ADMIN') && (
                      <Link
                        to="/admin/dashboard"
                        className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${currentTheme.hoverBg} min-h-[44px] flex items-center`}
                        onClick={() => setIsProfileMenuOpen(false)}
                        role="menuitem"
                      >
                        <span aria-hidden="true">⚙️</span> <span className="ml-2">{t('nav.admin') || 'Panel Admin'}</span>
                      </Link>
                    )}
                    <div className="border-t border-current opacity-30 my-1"></div>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        handleLogout()
                      }}
                      className={`block w-full text-left ${currentTheme.text} ${currentTheme.hover} px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 ${currentTheme.hoverBg} min-h-[44px] flex items-center`}
                      role="menuitem"
                    >
                      <span aria-hidden="true">🚪</span> <span className="ml-2">{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`${currentTheme.text} ${currentTheme.border} border-2 px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base ${currentTheme.hoverBg} transition-all duration-200 min-h-[44px] flex items-center`}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm sm:text-base px-3 sm:px-4 py-2"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden ${currentTheme.text} p-2 rounded-lg ${currentTheme.hoverBg} transition-all duration-200 min-h-[44px] min-w-[44px]`}
              aria-label={isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="text-2xl" aria-hidden="true">{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          className={`lg:hidden ${currentTheme.bg} border-t ${currentTheme.border} py-4 shadow-lg`}
          role="menu"
          aria-label="Menú de navegación móvil"
        >
          <div className="container mx-auto px-4 space-y-2">
            {navLinks
              .filter(link => !link.protected || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-3 rounded-lg font-bold text-base border-l-4 ${currentTheme.border} ${currentTheme.hoverBg} transition-all duration-200 min-h-[44px]`}
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl" aria-hidden="true">{link.icon}</span>
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

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import logo from '../../assets/logoFV.png'

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const { language, toggleLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: '🏠' },
    { to: '/forums', label: t('nav.forums'), icon: '💬' },
    { to: '/trivia', label: t('nav.trivia'), icon: '🎯' },
    { to: '/travel', label: t('nav.map'), icon: '🗺️' },
    { to: '/profile', label: t('nav.profile'), icon: '👤', protected: true },
  ]

  return (
    <nav className="bg-transparent border-b-2 border-accent sticky top-0 z-50 shadow-lg" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <img
              src={logo}
              alt="Forum Viajeros"
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
                  className="text-[#14110D] hover:text-accent-dark hover:bg-primary-dark flex items-center space-x-2 px-4 py-2 rounded-lg text-base font-bold transition-all duration-200 tracking-wide min-h-[44px]"
                >
                  <span className="text-xl" aria-hidden="true">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
          </div>

          {/* Botones de usuario y selector de idioma */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* Selector de idioma */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#14110D] hover:bg-primary-dark transition-all duration-200 min-h-[44px] cursor-pointer hover:scale-110"
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              {language === 'es' ? (
                <div className="flex flex-col w-6 h-4 rounded overflow-hidden border border-accent" aria-hidden="true">
                  <div className="h-1/4 bg-red-600"></div>
                  <div className="h-2/4 bg-yellow-400"></div>
                  <div className="h-1/4 bg-red-600"></div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-6 h-4 bg-earth-50 rounded overflow-hidden border border-accent relative" aria-hidden="true">
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
                  className="text-[#14110D] border-[#231E18] border-2 px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base hover:bg-primary-dark transition-all duration-200 flex items-center space-x-2 min-h-[44px]"
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
                  <div className="absolute right-0 mt-2 w-52 bg-primary-light border-accent border-2 rounded-lg p-2 space-y-1 shadow-xl" role="menu">
                    <Link
                      to="/profile"
                      className="block text-[#14110D] hover:text-accent-dark px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:bg-primary-dark min-h-[44px] flex items-center"
                      onClick={() => setIsProfileMenuOpen(false)}
                      role="menuitem"
                    >
                      <span aria-hidden="true">👤</span> <span className="ml-2">{t('nav.myProfile')}</span>
                    </Link>
                    <Link
                      to="/forums/create"
                      className="block text-[#14110D] hover:text-accent-dark px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:bg-primary-dark min-h-[44px] flex items-center"
                      onClick={() => setIsProfileMenuOpen(false)}
                      role="menuitem"
                    >
                      <span aria-hidden="true">✍️</span> <span className="ml-2">{t('nav.createForum')}</span>
                    </Link>
                    {currentUser?.roles?.includes('ROLE_MODERATOR') && (
                      <Link
                        to="/moderator/dashboard"
                        className="block text-[#14110D] hover:text-accent-dark px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:bg-primary-dark min-h-[44px] flex items-center"
                        onClick={() => setIsProfileMenuOpen(false)}
                        role="menuitem"
                      >
                        <span aria-hidden="true">🛡️</span> <span className="ml-2">{t('nav.moderator') || 'Panel Moderador'}</span>
                      </Link>
                    )}
                    {currentUser?.roles?.includes('ROLE_ADMIN') && (
                      <Link
                        to="/admin/dashboard"
                        className="block text-[#14110D] hover:text-accent-dark px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:bg-primary-dark min-h-[44px] flex items-center"
                        onClick={() => setIsProfileMenuOpen(false)}
                        role="menuitem"
                      >
                        <span aria-hidden="true">⚙️</span> <span className="ml-2">{t('nav.admin') || 'Panel Admin'}</span>
                      </Link>
                    )}
                    <div className="border-t border-accent opacity-30 my-1"></div>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        handleLogout()
                      }}
                      className="block w-full text-left text-[#14110D] hover:text-accent-dark px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:bg-primary-dark min-h-[44px] flex items-center"
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
                  className="text-[#14110D] border-[#231E18] border-2 px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base hover:bg-primary-dark transition-all duration-200 min-h-[44px] flex items-center"
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
              className="lg:hidden text-[#14110D] p-2 rounded-lg hover:bg-primary-dark transition-all duration-200 min-h-[44px] min-w-[44px]"
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
          className="lg:hidden bg-transparent border-t border-accent py-4 shadow-lg"
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
                  className="block text-[#14110D] hover:text-accent-dark px-4 py-3 rounded-lg font-bold text-base border-l-4 border-accent hover:bg-primary-dark transition-all duration-200 min-h-[44px]"
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

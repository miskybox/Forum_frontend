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
    { to: '/', label: t('nav.home') },
    { to: '/forums', label: t('nav.forums') },
    { to: '/trivia', label: t('nav.trivia') },
    { to: '/travel', label: t('nav.map') },
    { to: '/profile', label: t('nav.profile'), protected: true },
  ]

  return (
    <nav className="bg-aqua border-b-2 border-midnight sticky top-0 z-50 shadow-lg" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <img
              src={logo}
              alt="Forum Viajeros"
              className="h-12 sm:h-16 lg:h-20 w-auto transition-transform duration-200"
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
                  className="group text-midnight hover:bg-golden px-4 py-2 rounded-lg text-base font-bold transition-all duration-200 tracking-wide min-h-[44px] flex items-center hover:scale-105"
                >
                  <span className="group-hover:text-white group-hover:[text-shadow:_1px_1px_0_#213638,_-1px_-1px_0_#213638,_1px_-1px_0_#213638,_-1px_1px_0_#213638] transition-all duration-200">{link.label}</span>
                </Link>
              ))}
          </div>

          {/* Botones de usuario y selector de idioma */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* Selector de idioma */}
            <button
              onClick={toggleLanguage}
              className="group flex items-center gap-2 px-3 py-2 rounded-lg text-midnight hover:bg-golden transition-all duration-200 min-h-[44px] cursor-pointer hover:scale-110"
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              aria-label={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            >
              {language === 'es' ? (
                <div className="flex flex-col w-6 h-4 rounded overflow-hidden border border-midnight" aria-hidden="true">
                  <div className="h-1/4 bg-red-600"></div>
                  <div className="h-2/4 bg-yellow-400"></div>
                  <div className="h-1/4 bg-red-600"></div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-6 h-4 bg-white rounded overflow-hidden border border-midnight relative" aria-hidden="true">
                  <div className="absolute w-full h-1 bg-red-600"></div>
                  <div className="absolute h-full w-1 bg-red-600"></div>
                </div>
              )}
              <span className="text-sm font-bold uppercase group-hover:text-white group-hover:[text-shadow:_1px_1px_0_#213638,_-1px_-1px_0_#213638,_1px_-1px_0_#213638,_-1px_1px_0_#213638] transition-all duration-200">
                {language === 'es' ? 'ES' : 'EN'}
              </span>
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="text-text border-text border-2 px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base hover:bg-primary-dark transition-all duration-200 flex items-center space-x-2 min-h-[44px]"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <span className="hidden sm:inline">{currentUser?.username || t('nav.user')}</span>
                  <span className="text-xs" aria-hidden="true">▼</span>
                </button>

                {/* Menú desplegable */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border-accent border-2 rounded-lg p-2 space-y-1 shadow-xl" role="menu">
                    <Link
                      to="/profile"
                      className="text-text hover:text-accent px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:bg-primary-dark min-h-[44px] flex items-center"
                      onClick={() => setIsProfileMenuOpen(false)}
                      role="menuitem"
                    >
                      {t('nav.myProfile')}
                    </Link>
                    <Link
                      to="/forums/create"
                      className="text-text hover:text-accent px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:bg-primary-dark min-h-[44px] flex items-center"
                      onClick={() => setIsProfileMenuOpen(false)}
                      role="menuitem"
                    >
                      {t('nav.createForum')}
                    </Link>
                    {currentUser?.roles?.includes('ROLE_MODERATOR') && (
                      <Link
                        to="/moderator/dashboard"
                        className="text-text hover:text-accent px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:bg-primary-dark min-h-[44px] flex items-center"
                        onClick={() => setIsProfileMenuOpen(false)}
                        role="menuitem"
                      >
                        {t('nav.moderator') || 'Panel Moderador'}
                      </Link>
                    )}
                    {currentUser?.roles?.includes('ROLE_ADMIN') && (
                      <Link
                        to="/admin/dashboard"
                        className="text-text hover:text-accent px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:bg-primary-dark min-h-[44px] flex items-center"
                        onClick={() => setIsProfileMenuOpen(false)}
                        role="menuitem"
                      >
                        {t('nav.admin') || 'Panel Admin'}
                      </Link>
                    )}
                    <div className="border-t border-accent opacity-30 my-1"></div>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full text-left text-text hover:text-accent px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 hover:bg-primary-dark min-h-[44px] flex items-center"
                      role="menuitem"
                    >
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="group text-midnight border-midnight border-2 px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base hover:bg-golden hover:border-golden hover:scale-105 transition-all duration-200 min-h-[44px] flex items-center"
                >
                  <span className="group-hover:text-white group-hover:[text-shadow:_1px_1px_0_#213638,_-1px_-1px_0_#213638,_1px_-1px_0_#213638,_-1px_1px_0_#213638] transition-all duration-200">{t('nav.login')}</span>
                </Link>
                <Link
                  to="/register"
                  className="group bg-golden text-midnight border-2 border-midnight px-3 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base hover:bg-aqua hover:scale-105 transition-all duration-200 min-h-[44px] flex items-center"
                >
                  <span className="group-hover:text-white group-hover:[text-shadow:_1px_1px_0_#213638,_-1px_-1px_0_#213638,_1px_-1px_0_#213638,_-1px_1px_0_#213638] transition-all duration-200">{t('nav.register')}</span>
                </Link>
              </div>
            )}

            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-text p-2 rounded-lg hover:bg-primary-dark transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden bg-primary border-t border-accent py-4 shadow-lg"
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
                  className="group block text-midnight hover:bg-golden px-4 py-3 rounded-lg font-bold text-base border-l-4 border-golden transition-all duration-200 min-h-[44px]"
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                >
                  <span className="group-hover:text-white group-hover:[text-shadow:_1px_1px_0_#213638,_-1px_-1px_0_#213638,_1px_-1px_0_#213638,_-1px_1px_0_#213638] transition-all duration-200">{link.label}</span>
                </Link>
              ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

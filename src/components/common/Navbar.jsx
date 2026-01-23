import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import messageService from '../../services/messageService'
import notificationService from '../../services/notificationService'
import logo from '../../assets/logoFV.png'

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const { language, toggleLanguage, t } = useLanguage()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount()
      loadNotificationsCount()
      const interval = setInterval(() => {
        loadUnreadCount()
        loadNotificationsCount()
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  const loadUnreadCount = async () => {
    try {
      const count = await messageService.getUnreadCount()
      setUnreadMessages(count)
    } catch (err) {
      console.error('Error loading unread count:', err)
    }
  }

  const loadNotificationsCount = async () => {
    try {
      const count = await notificationService.getUnreadCount()
      setUnreadNotifications(count)
    } catch (err) {
      console.error('Error loading notifications count:', err)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Links públicos (visibles para todos)
  const publicLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/forums', label: t('nav.forums') },
    { to: '/trivia', label: t('nav.trivia') },
    { to: '/travel', label: t('nav.map') },
  ]

  // Links solo para usuarios logueados (estilo Instagram)
  const privateLinks = [
    { to: '/feed', label: t('nav.feed') },
  ]

  // Combinar links según autenticación
  const navLinks = isAuthenticated
    ? [...publicLinks.slice(0, 1), ...privateLinks, ...publicLinks.slice(1)]
    : publicLinks

  return (
    <nav className="bg-aqua sticky top-0 z-50 shadow-lg" role="navigation" aria-label="Main navigation">
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
            {navLinks.map((link) => (
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
              <div className="flex items-center gap-2">
                {/* Notifications icon */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg text-midnight hover:bg-golden transition-all duration-200 min-h-[44px] flex items-center justify-center"
                  aria-label={`Notificaciones${unreadNotifications > 0 ? ` (${unreadNotifications} sin leer)` : ''}`}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-terracota text-white text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* Messages icon */}
                <Link
                  to="/messages"
                  className="relative p-2 rounded-lg text-midnight hover:bg-golden transition-all duration-200 min-h-[44px] flex items-center justify-center"
                  aria-label={`Mensajes${unreadMessages > 0 ? ` (${unreadMessages} sin leer)` : ''}`}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 bg-terracota text-white text-xs font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </span>
                  )}
                </Link>

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
            {navLinks.map((link) => (
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

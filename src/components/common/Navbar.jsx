import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  MdAddCircleOutline,
  MdChatBubbleOutline,
  MdClose,
  MdExpandMore,
  MdMenu,
  MdDarkMode,
  MdLightMode,
  MdNotificationsNone,
} from 'react-icons/md'
import useAuth from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import messageService from '../../services/messageService'
import notificationService from '../../services/notificationService'
import Avatar from '../ui/Avatar'
import SearchPalette from '../search/SearchPalette'
import { useTheme } from '../../contexts/ThemeContext'
import logo from '../../assets/logo-bubble_FV.webp'

const desktopLinkClass = ({ isActive }) =>
  `px-4 py-1.5 rounded-full text-label-lg transition-colors whitespace-nowrap ${
    isActive
      ? 'bg-secondary text-on-secondary hover:text-on-secondary'
      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
  }`

const mobileLinkClass = ({ isActive }) =>
  `flex items-center min-h-[44px] px-4 rounded-base text-body-md font-semibold transition-colors ${
    isActive
      ? 'bg-secondary text-on-secondary hover:text-on-secondary'
      : 'text-on-surface hover:bg-surface-container-low hover:text-on-surface'
  }`

const iconButtonClass =
  'relative w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors'

const guestAuthLinkClass =
  'inline-flex items-center justify-center px-space-md py-2 rounded-full text-label-lg whitespace-nowrap text-secondary hover:text-on-secondary-fixed-variant hover:bg-surface-container-low border-[1.5px] border-secondary transition-colors'

const menuItemClass =
  'w-full flex items-center min-h-[44px] px-4 rounded-base text-body-sm font-semibold text-on-surface hover:bg-surface-container-low hover:text-on-surface transition-colors text-left'

const CountBadge = ({ count }) => {
  if (count <= 0) return null
  return (
    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-on-primary text-caption font-bold flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </span>
  )
}

const SpainFlag = () => (
  <svg className="w-5 h-[14px] rounded-sm flex-shrink-0" viewBox="0 0 60 40" aria-hidden="true">
    <rect width="60" height="40" fill="#AA151B" />
    <rect y="10" width="60" height="20" fill="#F1BF00" />
  </svg>
)

const UkFlag = () => (
  <svg className="w-5 h-[14px] rounded-sm flex-shrink-0" viewBox="0 0 60 30" aria-hidden="true">
    <clipPath id="navbar-gb-clip">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <g clipPath="url(#navbar-gb-clip)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L30,15 M60,0 L30,15 M0,30 L30,15 M60,30 L30,15" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
)

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const { language, setLanguage, t } = useLanguage()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const profileMenuRef = useRef(null)

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

  // Close menus when the route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setIsProfileMenuOpen(false)
  }, [location.pathname])

  // Close the profile menu on outside click or Escape
  useEffect(() => {
    if (!isProfileMenuOpen) return
    const handleClick = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
    }
    const handleKey = (event) => {
      if (event.key === 'Escape') setIsProfileMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isProfileMenuOpen])

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

  const publicLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/forums', label: t('nav.forums') },
    { to: '/feed?tab=photos', label: t('nav.diaries') },
    { to: '/trivia', label: t('nav.trivia') },
    { to: '/travel', label: t('nav.map') },
  ]

  const privateLinks = [
    { to: '/feed', label: t('nav.feed') },
  ]

  const navLinks = isAuthenticated
    ? [...publicLinks.slice(0, 1), ...privateLinks, ...publicLinks.slice(1)]
    : publicLinks

  const username = currentUser?.username || t('nav.user')

  // Post pages belong to the forums section even though their URL is /posts/...
  const isSectionActive = (to) => to === '/forums' && location.pathname.startsWith('/posts')

  return (
    <header className="sticky top-0 z-50 bg-surface-dim dark:bg-surface border-b border-outline-variant/50 dark:border-outline/30 shadow-[0_2px_12px_rgba(45,74,62,0.12)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.35)]">
      <nav role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto h-16 lg:h-20 px-gutter-sm lg:px-gutter-lg flex items-center justify-between gap-space-md">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-space-sm group flex-shrink-0">
            <img src={logo} alt="" className="h-9 w-auto object-contain" />
            <span className="flex flex-col leading-none">
              <span className="font-brand text-[0.62rem] sm:text-[0.72rem] text-primary group-hover:text-primary-container transition-colors">
                {t('nav.brand')}
              </span>
              <span className="hidden sm:block mt-0.5 text-caption uppercase tracking-widest text-on-surface-variant">
                {t('nav.tagline')}
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-space-xs p-1 bg-surface-container-lowest dark:bg-surface-container-low rounded-full">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => desktopLinkClass({ isActive: isActive || isSectionActive(link.to) })}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-space-sm">
            <SearchPalette />
            <button
              type="button"
              onClick={toggleDarkMode}
              className={iconButtonClass}
              aria-pressed={isDarkMode}
              aria-label={isDarkMode ? t('nav.lightMode') : t('nav.darkMode')}
            >
              {isDarkMode ? <MdLightMode aria-hidden="true" /> : <MdDarkMode aria-hidden="true" />}
            </button>

            {/* Language selector */}
            <div
              className="hidden sm:flex items-center gap-0.5 p-0.5 rounded-full bg-surface-container-lowest dark:bg-surface-container-low"
              role="group"
              aria-label="Selector de idioma / Language selector"
            >
              <button
                type="button"
                onClick={() => setLanguage('es')}
                aria-pressed={language === 'es'}
                title="Español"
                aria-label="Español"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  language === 'es' ? 'bg-surface-container-lowest shadow-level-1' : 'hover:bg-surface-container'
                }`}
              >
                <SpainFlag />
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                title="English"
                aria-label="English"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  language === 'en' ? 'bg-surface-container-lowest shadow-level-1' : 'hover:bg-surface-container'
                }`}
              >
                <UkFlag />
              </button>
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  to="/forums/create"
                  className="hidden md:inline-flex items-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary text-label-lg px-space-md py-2 rounded-full shadow-[0_2px_8px_-2px_rgba(45,74,62,0.12)] transition-colors active:scale-95"
                >
                  <MdAddCircleOutline className="text-title-md" aria-hidden="true" />
                  <span>{t('nav.createPost')}</span>
                </Link>

                <Link
                  to="/notifications"
                  className={iconButtonClass}
                  aria-label={`${t('nav.notifications')}${unreadNotifications > 0 ? ` (${unreadNotifications})` : ''}`}
                >
                  <MdNotificationsNone className="text-title-md" aria-hidden="true" />
                  <CountBadge count={unreadNotifications} />
                </Link>

                <Link
                  to="/messages"
                  className={`${iconButtonClass} hidden sm:flex`}
                  aria-label={`${t('nav.messages')}${unreadMessages > 0 ? ` (${unreadMessages})` : ''}`}
                >
                  <MdChatBubbleOutline className="text-title-md" aria-hidden="true" />
                  <CountBadge count={unreadMessages} />
                </Link>

                <div className="relative" ref={profileMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-space-xs pl-1 pr-2 py-1 rounded-full hover:bg-surface-container-low transition-colors"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    <Avatar name={currentUser?.username} src={currentUser?.profileImageUrl} size="sm" tone="primary" />
                    <span className="hidden sm:inline text-label-lg text-on-surface max-w-[8rem] truncate">{username}</span>
                    <MdExpandMore className={`text-title-md text-on-surface-variant transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>

                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 p-space-sm bg-surface-container-lowest rounded-lg shadow-level-3 border border-surface-container-high"
                      role="menu"
                    >
                      <Link to="/profile" className={menuItemClass} onClick={() => setIsProfileMenuOpen(false)} role="menuitem">
                        {t('nav.myProfile')}
                      </Link>
                      <Link to="/forums/create" className={menuItemClass} onClick={() => setIsProfileMenuOpen(false)} role="menuitem">
                        {t('nav.createForum')}
                      </Link>
                      {currentUser?.roles?.includes('ROLE_MODERATOR') && (
                        <Link to="/moderator/dashboard" className={menuItemClass} onClick={() => setIsProfileMenuOpen(false)} role="menuitem">
                          {t('nav.moderator') || 'Panel Moderador'}
                        </Link>
                      )}
                      {currentUser?.roles?.includes('ROLE_ADMIN') && (
                        <Link to="/admin/dashboard" className={menuItemClass} onClick={() => setIsProfileMenuOpen(false)} role="menuitem">
                          {t('nav.admin') || 'Panel Admin'}
                        </Link>
                      )}
                      <div className="my-space-xs border-t border-surface-container-high" role="separator" />
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false)
                          handleLogout()
                        }}
                        className={`${menuItemClass} text-primary hover:text-primary`}
                        role="menuitem"
                      >
                        {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-space-xs">
                <Link to="/login" className={guestAuthLinkClass}>
                  {t('nav.login')}
                </Link>
                <Link to="/register" className={guestAuthLinkClass}>
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden ${iconButtonClass}`}
              aria-label={isMenuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <MdClose className="text-title-md" aria-hidden="true" />
              ) : (
                <MdMenu className="text-title-md" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden bg-surface-container-lowest border-t border-surface-container-high shadow-level-2"
            role="menu"
            aria-label="Menú de navegación móvil"
          >
            <div className="max-w-7xl mx-auto px-gutter-sm py-space-md space-y-space-xs">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => mobileLinkClass({ isActive: isActive || isSectionActive(link.to) })}
                  onClick={() => setIsMenuOpen(false)}
                  role="menuitem"
                >
                  {link.label}
                </NavLink>
              ))}

              {isAuthenticated && (
                <div className="pt-space-sm mt-space-sm border-t border-surface-container-high space-y-space-xs">
                  <Link to="/forums/create" className={mobileLinkClass({ isActive: false })} onClick={() => setIsMenuOpen(false)} role="menuitem">
                    {t('nav.createPost')}
                  </Link>
                  <Link to="/messages" className={`sm:hidden ${mobileLinkClass({ isActive: false })}`} onClick={() => setIsMenuOpen(false)} role="menuitem">
                    {t('nav.messages')}
                  </Link>
                </div>
              )}

              <div className="sm:hidden pt-space-sm mt-space-sm border-t border-surface-container-high flex items-center gap-space-sm">
                <button
                  type="button"
                  onClick={() => setLanguage('es')}
                  aria-pressed={language === 'es'}
                  className={`flex-1 flex items-center justify-center gap-space-xs min-h-[44px] rounded-full text-label-lg ${
                    language === 'es' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-low text-on-surface'
                  }`}
                >
                  <SpainFlag /> ES
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  aria-pressed={language === 'en'}
                  className={`flex-1 flex items-center justify-center gap-space-xs min-h-[44px] rounded-full text-label-lg ${
                    language === 'en' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-low text-on-surface'
                  }`}
                >
                  <UkFlag /> EN
                </button>
              </div>

              {!isAuthenticated && (
                <div className="pt-space-sm mt-space-sm border-t border-surface-container-high flex flex-col gap-space-sm sm:hidden">
                  <Link
                    to="/login"
                    className="flex items-center justify-center min-h-[44px] rounded-full border-[1.5px] border-secondary text-secondary text-label-lg"
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center justify-center min-h-[44px] rounded-full bg-primary text-on-primary hover:text-on-primary text-label-lg"
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Navbar

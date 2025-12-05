import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useTheme } from '../../contexts/ThemeContext'
import logo from '../../assets/logo2.png'

/**
 * Navbar retro con temas por sección inspirados en películas de los 80s/90s
 */
const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const { theme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  // Temas por sección con iconos y colores
  const themeConfig = {
    retro: {
      bg: 'bg-gradient-to-r from-purple-900 via-black to-purple-900',
      border: 'border-neon-purple',
      text: 'text-neon-cyan',
      hover: 'hover:text-neon-pink',
      icon: '🎬'
    },
    adventure: {
      bg: 'bg-gradient-to-r from-adventure-dark via-adventure-brown to-adventure-dark',
      border: 'border-adventure-gold',
      text: 'text-adventure-gold',
      hover: 'hover:text-adventure-light',
      icon: '🏺'
    },
    future: {
      bg: 'bg-gradient-to-r from-future-dark via-future-blue to-future-dark',
      border: 'border-future-neon',
      text: 'text-future-neon',
      hover: 'hover:text-future-purple',
      icon: '⚡'
    },
    jungle: {
      bg: 'bg-gradient-to-r from-jungle-dark via-jungle-green to-jungle-dark',
      border: 'border-jungle-gold',
      text: 'text-jungle-leaf',
      hover: 'hover:text-jungle-gold',
      icon: '🌴'
    },
    tech: {
      bg: 'bg-gradient-to-r from-tech-dark via-black to-tech-dark',
      border: 'border-tech-red',
      text: 'text-tech-neon',
      hover: 'hover:text-tech-red',
      icon: '🤖'
    },
    space: {
      bg: 'bg-gradient-to-r from-space-dark via-space-blue to-space-dark',
      border: 'border-space-neon',
      text: 'text-space-neon',
      hover: 'hover:text-space-green',
      icon: '👽'
    }
  }

  const currentTheme = themeConfig[theme] || themeConfig.retro

  // Links de navegación con iconos temáticos
  const navLinks = [
    { to: '/', label: 'Inicio', icon: '🏠', theme: 'retro' },
    { to: '/forums', label: 'Foros', icon: '🏺', theme: 'adventure' },
    { to: '/trivia', label: 'Trivia', icon: '⚡', theme: 'space' },
    { to: '/travel', label: 'Mapa', icon: '🌴', theme: 'jungle' },
    { to: '/profile', label: 'Perfil', icon: '🤖', theme: 'tech', protected: true },
  ]

  return (
    <nav className={`${currentTheme.bg} border-b-4 ${currentTheme.border} sticky top-0 z-50 backdrop-blur-sm`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                className="h-14 w-auto filter drop-shadow-[0_0_10px_currentColor]"
                src={logo}
                alt="ForumViajeros"
                style={{ filter: `drop-shadow(0 0 10px ${currentTheme.text.replace('text-', '#')})` }}
              />
              <div className="absolute -top-1 -right-1 text-2xl animate-pulse-neon">
                {currentTheme.icon}
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`${currentTheme.text} font-display text-xl font-bold neon-text uppercase tracking-wider`}>
                ForumViajeros
              </span>
              <span className="text-xs text-neon-yellow font-retro opacity-80">
                {location.pathname === '/' ? 'RETRO 80s' : 
                 location.pathname.startsWith('/forums') ? 'ADVENTURE MODE' :
                 location.pathname.startsWith('/trivia') ? 'FUTURE MODE' :
                 location.pathname.startsWith('/travel') ? 'JUNGLE MODE' :
                 location.pathname.startsWith('/profile') ? 'TECH MODE' : 'EXPLORE'}
              </span>
            </div>
          </Link>
          
          {/* Menú desktop */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks
              .filter(link => !link.protected || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${currentTheme.text} ${currentTheme.hover} relative px-4 py-2 font-retro text-xs uppercase tracking-wider transition-all duration-300 group`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{link.icon}</span>
                    <span className="neon-text">{link.label}</span>
                  </div>
                  {link.subtitle && (
                    <div className="absolute top-full left-0 mt-1 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {link.subtitle}
                    </div>
                  )}
                  <div className={`absolute bottom-0 left-0 w-0 h-0.5 ${currentTheme.border.replace('border-', 'bg-')} group-hover:w-full transition-all duration-300`}></div>
                </Link>
              ))}
          </div>
          
          {/* Botones de usuario */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`${currentTheme.text} ${currentTheme.border} border-2 px-4 py-2 font-retro text-xs uppercase tracking-wider hover:bg-black/50 transition-all duration-300 flex items-center space-x-2`}
                >
                  <span className="text-lg">👤</span>
                  <span className="neon-text">{currentUser?.username || 'USER'}</span>
                  <span className="text-xs">▼</span>
                </button>
                
                {/* Menú desplegable */}
                {isProfileMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-56 ${currentTheme.bg} ${currentTheme.border} border-2 p-2 space-y-1 animate-slide-in`}>
                    <Link
                      to="/profile"
                      className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-2 font-retro text-xs uppercase tracking-wider transition-all duration-300 hover:bg-black/50`}
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      🤖 Mi Perfil
                    </Link>
                    <Link
                      to="/forums/create"
                      className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-2 font-retro text-xs uppercase tracking-wider transition-all duration-300 hover:bg-black/50`}
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      ✍️ Crear Foro
                    </Link>
                    <div className="border-t border-current opacity-30 my-1"></div>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        handleLogout()
                      }}
                      className={`block w-full text-left ${currentTheme.text} ${currentTheme.hover} px-4 py-2 font-retro text-xs uppercase tracking-wider transition-all duration-300 hover:bg-black/50`}
                    >
                      🚪 Salir
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`${currentTheme.text} ${currentTheme.border} border-2 px-4 py-2 font-retro text-xs uppercase tracking-wider hover:bg-black/50 transition-all duration-300`}
                >
                  👽 Login
                </Link>
                <Link
                  to="/register"
                  className={`bg-gradient-to-r from-neon-pink to-neon-cyan text-black px-4 py-2 font-retro text-xs uppercase tracking-wider border-2 border-neon-cyan hover:shadow-neon-lg transition-all duration-300`}
                >
                  🚀 Start
                </Link>
              </div>
            )}
            
            {/* Botón menú móvil */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden ${currentTheme.text} p-2 ${currentTheme.border} border-2`}
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className={`lg:hidden ${currentTheme.bg} ${currentTheme.border} border-t-2 py-4 animate-slide-in`}>
          <div className="container mx-auto px-4 space-y-2">
            {navLinks
              .filter(link => !link.protected || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block ${currentTheme.text} ${currentTheme.hover} px-4 py-3 font-retro text-sm uppercase tracking-wider border-l-4 ${currentTheme.border} hover:bg-black/50 transition-all duration-300`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{link.icon}</span>
                    <div>
                      <div>{link.label}</div>
                      {link.subtitle && (
                        <div className="text-xs opacity-70">{link.subtitle}</div>
                      )}
                    </div>
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

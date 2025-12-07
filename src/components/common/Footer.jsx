import { Link } from 'react-router-dom'

/**
 * Footer retro 80s/90s
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-r from-black via-purple-900 to-black border-t-4 border-neon-purple py-12 relative overflow-hidden">
      {/* Efecto de scanlines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.1) 2px, rgba(0,255,255,0.1) 4px)'
      }}></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4 group">
              <div className="text-4xl mr-3 group-hover:animate-pulse-neon">✈️</div>
              <div>
                <span className="text-2xl font-display font-bold text-neon-cyan neon-text block">
                  FORUM VIAJEROS
                </span>
                <span className="text-xs font-retro text-neon-yellow opacity-80">
                  RETRO TRAVEL EXPERIENCE
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 font-retro leading-relaxed max-w-md">
              Explora el mundo a través de las experiencias de otros viajeros. 
              Comparte tus aventuras y conecta con la comunidad global.
            </p>
          </div>
          
          {/* Enlaces útiles */}
          <div>
            <h3 className="text-sm font-display font-bold text-neon-pink neon-text uppercase tracking-wider mb-4">
              NAVEGACIÓN
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/categories', label: 'Continentes', icon: '🌍' },
                { to: '/forums', label: 'Foros', icon: '🏺' },
                { to: '/travel', label: 'Mi Mapa', icon: '🗺️' },
                { to: '/trivia', label: 'Trivia', icon: '⚡' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-neon-cyan transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <span className="text-lg group-hover:scale-125 transition-transform">{link.icon}</span>
                    <span className="font-retro text-xs uppercase tracking-wider">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-sm font-display font-bold text-neon-green neon-text uppercase tracking-wider mb-4">
              LEGAL
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/about', label: 'Acerca de', icon: 'ℹ️' },
                { to: '/contact', label: 'Contacto', icon: '📧' },
                { to: '/help', label: 'Ayuda', icon: '❓' },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-neon-green transition-colors duration-300 flex items-center space-x-2 group"
                  >
                    <span className="text-lg group-hover:scale-125 transition-transform">{link.icon}</span>
                    <span className="font-retro text-xs uppercase tracking-wider">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Línea divisoria */}
        <div className="border-t-2 border-neon-cyan opacity-30 my-8"></div>
        
        {/* Copyright y redes */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 font-retro text-xs mb-4 md:mb-0">
            <span className="text-neon-yellow">©</span> {currentYear} FORUM VIAJEROS
            <span className="text-neon-pink ml-2">|</span>
            <span className="ml-2">ALL RIGHTS RESERVED</span>
          </div>
          
          <div className="flex space-x-6">
            {[
              { href: 'https://facebook.com', icon: '📘', label: 'Facebook' },
              { href: 'https://instagram.com', icon: '📷', label: 'Instagram' },
              { href: 'https://twitter.com', icon: '🐦', label: 'Twitter' },
            ].map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl hover:scale-125 transition-transform duration-300 hover:drop-shadow-[0_0_10px_currentColor]"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        
        {/* Mensaje retro */}
        <div className="text-center mt-8">
          <p className="text-xs font-retro text-neon-cyan opacity-60 animate-pulse-neon">
            MADE WITH ❤️ IN THE 80s STYLE
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import { Link } from 'react-router-dom'
import logo from '../../assets/logoFV.png'

/**
 * Footer estilo Vintage Travel Map - Accesible WCAG AA/AAA
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-primary-50 to-primary-100 border-t-2 border-primary-600 py-12 relative" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4 group">
              <img
                src={logo}
                alt="ForumViajeros - Travel Community"
                className="h-12 w-auto transition-transform duration-200"
              />
            </Link>
            <p className="text-sm text-primary-950 font-sans leading-relaxed max-w-md">
              Explora el mundo a través de las experiencias de otros viajeros.
              Comparte tus aventuras y conecta con la comunidad global.
            </p>
          </div>

          {/* Enlaces útiles */}
          <div>
            <h3 className="text-sm font-bold text-primary-950 uppercase tracking-wide mb-4">
              Navegación
            </h3>
            <ul className="space-y-3">
              {[
                { to: '/categories', label: 'Continentes', icon: '🌍' },
                { to: '/forums', label: 'Foros', icon: '💬' },
                { to: '/travel', label: 'Mi Mapa', icon: '🗺️' },
                { to: '/trivia', label: 'Trivia', icon: '🎯' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-800 hover:text-primary-950 hover:underline transition-colors duration-200 flex items-center space-x-2 group min-h-[44px]"
                  >
                    <span className="text-base" aria-hidden="true">{link.icon}</span>
                    <span className="font-medium text-sm uppercase tracking-wide">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-bold text-primary-950 uppercase tracking-wide mb-4">
              Legal
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
                    className="text-primary-800 hover:text-primary-950 hover:underline transition-colors duration-200 flex items-center space-x-2 group min-h-[44px]"
                  >
                    <span className="text-base" aria-hidden="true">{link.icon}</span>
                    <span className="font-medium text-sm uppercase tracking-wide">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t-2 border-primary-400 my-8"></div>

        {/* Copyright y redes */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-primary-900 font-sans text-sm mb-4 md:mb-0">
            <span aria-hidden="true">©</span> {currentYear} FORUM VIAJEROS
            <span className="mx-2" aria-hidden="true">|</span>
            <span>ALL RIGHTS RESERVED</span>
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
                className="text-2xl hover:opacity-75 transition-opacity duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={social.label}
              >
                <span aria-hidden="true">{social.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Mensaje */}
        <div className="text-center mt-8">
          <p className="text-xs font-sans text-primary-800">
            Made with passion for travelers around the world
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

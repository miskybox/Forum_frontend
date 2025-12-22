import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import logo from '../../assets/logoFV.png'

/**
 * Footer estilo Vintage Travel Map - Accesible WCAG AA/AAA
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-primary-50 to-primary-100 border-t-2 border-primary-600 py-4 relative" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-1 group">
              <img
                src={logo}
                alt="ForumViajeros - Travel Community"
                className="h-8 w-auto transition-transform duration-200"
              />
            </Link>
            <p className="text-[11px] text-primary-950 font-sans leading-snug max-w-md">
              Explora el mundo a través de las experiencias de otros viajeros.
              Comparte tus aventuras y conecta con la comunidad global.
            </p>
          </div>

          {/* Enlaces útiles */}
          <div>
            <h3 className="text-[11px] font-bold text-primary-950 uppercase tracking-wide mb-1">
              Navegación
            </h3>
            <ul className="space-y-0.5">
              {[
                { to: '/categories', label: 'Continentes', icon: '🌍' },
                { to: '/forums', label: 'Foros', icon: '💬' },
                { to: '/travel', label: 'Mi Mapa', icon: '🗺️' },
                { to: '/trivia', label: 'Trivia', icon: '🎯' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-800 hover:text-primary-950 transition-colors duration-200 flex items-center space-x-1 group min-h-[32px]"
                  >
                    <span className="text-xs" aria-hidden="true">{link.icon}</span>
                    <span className="font-medium text-[11px] uppercase tracking-wide">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[11px] font-bold text-primary-950 uppercase tracking-wide mb-1">
              Legal
            </h3>
            <ul className="space-y-0.5">
              {[
                { to: '/about', label: 'Acerca de', icon: 'ℹ️' },
                { to: '/contact', label: 'Contacto', icon: '📧' },
                { to: '/help', label: 'Ayuda', icon: '❓' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-800 hover:text-primary-950 transition-colors duration-200 flex items-center space-x-1 group min-h-[32px]"
                  >
                    <span className="text-xs" aria-hidden="true">{link.icon}</span>
                    <span className="font-medium text-[11px] uppercase tracking-wide">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-primary-400 my-2"></div>

        {/* Copyright y redes */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-primary-900 font-sans text-[11px]">
            <span aria-hidden="true">©</span> {currentYear} <span className="font-semibold" style={{ textTransform: 'none' }}>ForumViajeros</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="text-[10px]">Todos los derechos reservados</span>
          </div>

          <div className="flex space-x-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 hover:text-blue-600 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Facebook"
            >
              <FaFacebook className="text-base" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 hover:text-pink-600 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram className="text-base" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 hover:text-sky-500 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Twitter"
            >
              <FaTwitter className="text-base" />
            </a>
          </div>
        </div>

        {/* Mensaje */}
        <div className="text-center mt-2">
          <p className="text-[10px] font-sans text-primary-800 leading-tight">
            Made with passion for travelers around the world
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

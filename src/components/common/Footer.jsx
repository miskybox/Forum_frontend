import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import logo from '../../assets/logoFV.png'

/**
 * Footer estilo Vintage Travel Map - Accesible WCAG AA/AAA
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-800 border-t-2 border-primary-600 dark:border-primary-400 py-6 relative" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo y descripción centrados */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center mb-3 group">
            <img
              src={logo}
              alt="ForumViajeros - Travel Community"
              className="h-12 w-auto transition-transform duration-200"
            />
          </Link>
          <p className="text-sm text-primary-950 dark:text-primary-100 font-sans leading-relaxed max-w-2xl mx-auto">
            Explora el mundo a través de las experiencias de otros viajeros.
            Comparte tus aventuras y conecta con la comunidad global.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 max-w-2xl mx-auto">

          {/* Enlaces útiles */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold text-primary-950 dark:text-primary-200 uppercase tracking-wide mb-2">
              Navegación
            </h3>
            <ul className="space-y-1 inline-block text-left">
              {[
                { to: '/categories', label: 'Continentes', icon: '🌍' },
                { to: '/forums', label: 'Foros', icon: '💬' },
                { to: '/travel', label: 'Mi Mapa', icon: '🗺️' },
                { to: '/trivia', label: 'Trivia', icon: '🎯' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-800 dark:text-primary-300 hover:text-primary-950 dark:hover:text-primary-100 transition-colors duration-200 flex items-center space-x-2 group min-h-[36px]"
                  >
                    <span className="text-sm" aria-hidden="true">{link.icon}</span>
                    <span className="font-medium text-xs uppercase tracking-wide">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold text-primary-950 dark:text-primary-200 uppercase tracking-wide mb-2">
              Legal
            </h3>
            <ul className="space-y-1 inline-block text-left">
              {[
                { to: '/about', label: 'Acerca de', icon: 'ℹ️' },
                { to: '/contact', label: 'Contacto', icon: '📧' },
                { to: '/help', label: 'Ayuda', icon: '❓' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-800 dark:text-primary-300 hover:text-primary-950 dark:hover:text-primary-100 transition-colors duration-200 flex items-center space-x-2 group min-h-[36px]"
                  >
                    <span className="text-sm" aria-hidden="true">{link.icon}</span>
                    <span className="font-medium text-xs uppercase tracking-wide">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-primary-400 dark:border-primary-600 my-4"></div>

        {/* Copyright y redes */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-primary-900 dark:text-primary-200 font-sans text-[11px]">
            <span aria-hidden="true">©</span> {currentYear} <span className="font-semibold" style={{ textTransform: 'none' }}>ForumViajeros</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="text-[10px]">Todos los derechos reservados</span>
          </div>

          <div className="flex space-x-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 dark:text-primary-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Facebook"
            >
              <FaFacebook className="text-base" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 dark:text-primary-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Instagram"
            >
              <FaInstagram className="text-base" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 dark:text-primary-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Twitter"
            >
              <FaTwitter className="text-base" />
            </a>
          </div>
        </div>

        {/* Mensaje */}
        <div className="text-center mt-2">
          <p className="text-[10px] font-sans text-primary-800 dark:text-primary-300 leading-tight">
            Made with passion for travelers around the world
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

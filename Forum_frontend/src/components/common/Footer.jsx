import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import { useLanguage } from '../../contexts/LanguageContext'
import logo from '../../assets/logoFV.png'

/**
 * Footer - Paleta del logo
 * --primary-terracota: #A67C52
 * --accent-teal: #5A8A7A
 * --dark-green: #3D5F54
 * --neutral-beige: #F5F0E8
 */
const Footer = () => {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t-2 border-accent py-6 relative" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo y descripción centrados */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center mb-3 group">
            <img
              src={logo}
              alt="Forum Viajeros"
              className="h-12 w-auto transition-transform duration-200"
            />
          </Link>
          <p className="text-sm text-text font-sans leading-relaxed max-w-2xl mx-auto font-medium">
            {t('footer.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 max-w-2xl mx-auto">

          {/* Enlaces útiles */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold text-text uppercase tracking-wide mb-2">
              {t('footer.navigation')}
            </h3>
            <ul className="space-y-1 inline-block text-left">
              {[
                { to: '/categories', label: t('footer.continents') },
                { to: '/forums', label: t('footer.forums') },
                { to: '/travel', label: t('footer.myMap') },
                { to: '/trivia', label: 'Trivia' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-text hover:text-secondary transition-colors duration-200 flex items-center group min-h-[36px] font-medium"
                  >
                    <span className="font-semibold text-xs uppercase tracking-wide">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold text-text uppercase tracking-wide mb-2">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-1 inline-block text-left">
              {[
                { to: '/about', label: t('footer.about') },
                { to: '/contact', label: t('footer.contact') },
                { to: '/help', label: t('footer.help') },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-text hover:text-secondary transition-colors duration-200 flex items-center group min-h-[36px] font-medium"
                  >
                    <span className="font-semibold text-xs uppercase tracking-wide">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-accent my-4"></div>

        {/* Copyright y redes */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-text font-sans text-xs font-medium">
            <span className="sr-only">Copyright </span>
            <span aria-hidden="true">©</span> {currentYear} <span className="font-bold" style={{ textTransform: 'none' }}>Forum Viajeros</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="text-xs">{t('footer.rights')}</span>
          </div>

          <nav className="flex space-x-3" aria-label={t('footer.socialNetworks')}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-secondary transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label={t('footer.visitFacebook')}
            >
              <FaFacebook className="text-lg" aria-hidden="true" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-secondary transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label={t('footer.visitInstagram')}
            >
              <FaInstagram className="text-lg" aria-hidden="true" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-secondary transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label={t('footer.visitTwitter')}
            >
              <FaTwitter className="text-lg" aria-hidden="true" />
            </a>
          </nav>
        </div>

        {/* Mensaje */}
        <div className="text-center mt-2">
          <p className="text-xs font-sans text-text-light leading-tight font-medium">
            {t('footer.madeWith')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

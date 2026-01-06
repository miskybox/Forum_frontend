import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import { useLanguage } from '../../contexts/LanguageContext'
import logo from '../../assets/logoFV.png'

/**
 * Footer - Paleta única #A0937D #E7D4B5 #F6E6CB #B6C7AA
 */
const Footer = () => {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent border-t-2 border-accent py-6 relative" role="contentinfo">
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
          <p className="text-sm text-text-light font-sans leading-relaxed max-w-2xl mx-auto font-medium">
            {t('footer.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 max-w-2xl mx-auto">

          {/* Enlaces útiles */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold text-text-lighter uppercase tracking-wide mb-2">
              {t('footer.navigation')}
            </h3>
            <ul className="space-y-1 inline-block text-left">
              {[
                { to: '/categories', label: t('footer.continents'), icon: '🌍' },
                { to: '/forums', label: t('footer.forums'), icon: '💬' },
                { to: '/travel', label: t('footer.myMap'), icon: '🗺️' },
                { to: '/trivia', label: 'Trivia', icon: '🎯' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-text hover:text-accent-dark transition-colors duration-200 flex items-center space-x-2 group min-h-[36px] font-medium"
                  >
                    <span className="text-sm" aria-hidden="true">{link.icon}</span>
                    <span className="font-semibold text-xs uppercase tracking-wide">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold text-text-lighter uppercase tracking-wide mb-2">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-1 inline-block text-left">
              {[
                { to: '/about', label: t('footer.about'), icon: 'ℹ️' },
                { to: '/contact', label: t('footer.contact'), icon: '📧' },
                { to: '/help', label: t('footer.help'), icon: '❓' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-text hover:text-accent-dark transition-colors duration-200 flex items-center space-x-2 group min-h-[36px] font-medium"
                  >
                    <span className="text-sm" aria-hidden="true">{link.icon}</span>
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
          <div className="text-text-light font-sans text-xs font-medium">
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
              className="text-text hover:text-accent-dark transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label={t('footer.visitFacebook')}
            >
              <FaFacebook className="text-lg" aria-hidden="true" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-accent-dark transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label={t('footer.visitInstagram')}
            >
              <FaInstagram className="text-lg" aria-hidden="true" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text hover:text-accent-dark transition-colors duration-200 min-h-[32px] min-w-[32px] flex items-center justify-center"
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

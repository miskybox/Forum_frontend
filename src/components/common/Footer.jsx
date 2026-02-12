import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import { useLanguage } from '../../contexts/LanguageContext'
import logo from '../../assets/logoFV.png'

const Footer = () => {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-aqua py-4" role="contentinfo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Fila principal: Logo + Enlaces + Redes */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Logo y enlaces */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="Forum Viajeros"
                className="h-14 w-auto"
              />
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                to="/about"
                className="text-midnight hover:text-golden transition-colors duration-200 font-semibold text-sm"
              >
                {t('footer.about')}
              </Link>
              <Link
                to="/contact"
                className="text-midnight hover:text-golden transition-colors duration-200 font-semibold text-sm"
              >
                {t('footer.contact')}
              </Link>
              <Link
                to="/help"
                className="text-midnight hover:text-golden transition-colors duration-200 font-semibold text-sm"
              >
                {t('footer.help')}
              </Link>
            </nav>
          </div>

          {/* Redes sociales */}
          <nav className="flex items-center gap-3" aria-label={t('footer.socialNetworks')}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-midnight hover:text-golden transition-colors duration-200"
              aria-label={t('footer.visitFacebook')}
            >
              <FaFacebook className="text-lg" aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/forumviajeros/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-midnight hover:text-golden transition-colors duration-200"
              aria-label={t('footer.visitInstagram')}
            >
              <FaInstagram className="text-lg" aria-hidden="true" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-midnight hover:text-golden transition-colors duration-200"
              aria-label={t('footer.visitTwitter')}
            >
              <FaTwitter className="text-lg" aria-hidden="true" />
            </a>
          </nav>
        </div>

        {/* Copyright y mensaje */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 mt-3 pt-3 border-t border-midnight/20">
          <div className="text-midnight font-sans text-xs font-medium">
            <span aria-hidden="true">©</span> {currentYear} <span className="font-bold">Forum Viajeros</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>{t('footer.rights')}</span>
          </div>
          <p className="text-xs font-sans text-midnight font-medium">
            {t('footer.madeWith')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

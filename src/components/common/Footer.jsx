import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { FaXTwitter, FaTiktok } from 'react-icons/fa6'
import { MdEco } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import logo from '../../assets/logo-bubble_FV.webp'

const linkClass = 'text-body-sm text-on-surface-variant hover:text-primary transition-colors'
const socialClass =
  'w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors'

const Footer = () => {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  const columns = [
    {
      title: t('footer.explore'),
      links: [
        { to: '/forums', label: t('footer.forums') },
        { to: '/categories', label: t('footer.continents') },
        { to: '/travel', label: t('footer.myMap') },
        { to: '/blog', label: t('footer.blog') },
      ],
    },
    {
      title: t('footer.community'),
      links: [
        { to: '/feed', label: t('footer.feed') },
        { to: '/usuarios', label: t('footer.users') },
        { to: '/trivia', label: t('footer.trivia') },
      ],
    },
    {
      title: t('footer.platform'),
      links: [
        { to: '/about', label: t('footer.about') },
        { to: '/contact', label: t('footer.contact') },
        { to: '/help', label: t('footer.help') },
      ],
    },
  ]

  return (
    <footer className="w-full bg-surface-container-low text-on-surface mt-margin-lg shadow-[0_-1px_8px_rgba(45,74,62,0.03)]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-gutter-sm lg:px-gutter-lg py-margin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter-lg">

          {/* Brand + manifesto */}
          <div className="lg:col-span-2 flex flex-col gap-space-lg lg:pr-space-lg">
            <div className="space-y-space-sm">
              <Link to="/" className="inline-flex items-center gap-space-sm">
                <img src={logo} alt="" className="h-8 w-auto object-contain" />
                <span className="font-headline text-headline-sm text-primary">Forum Viajeros</span>
              </Link>
              <p className="text-body-sm text-on-surface-variant max-w-sm">{t('footer.description')}</p>
            </div>

            <div className="p-space-md bg-surface-container rounded-lg">
              <p className="flex items-center gap-space-xs text-secondary text-label-md uppercase tracking-wide mb-space-xs">
                <MdEco className="text-title-md" aria-hidden="true" />
                {t('footer.manifestoTitle')}
              </p>
              <p className="text-caption text-on-surface-variant leading-relaxed">{t('footer.manifesto')}</p>
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="space-y-space-sm">
              <h2 className="font-body text-title-md text-on-surface">{column.title}</h2>
              <ul className="space-y-space-xs">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-margin px-space-md py-space-sm bg-surface-container-high/40 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-space-sm text-caption text-on-surface-variant">
          <p>
            <span aria-hidden="true">©</span> {currentYear} Forum Viajeros · {t('footer.rights')}
          </p>

          <nav className="flex items-center gap-space-xs" aria-label={t('footer.socialNetworks')}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label={t('footer.visitFacebook')}>
              <FaFacebook aria-hidden="true" />
            </a>
            <a href="https://www.instagram.com/forumviajeros/" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label={t('footer.visitInstagram')}>
              <FaInstagram aria-hidden="true" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label={t('footer.visitX')}>
              <FaXTwitter aria-hidden="true" />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label={t('footer.visitTikTok')}>
              <FaTiktok aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export default Footer

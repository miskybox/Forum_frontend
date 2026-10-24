import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { MdArrowBack } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Editorial shell for static pages (about, contact, help).
 */
const ContentPageLayout = ({ eyebrow, icon, title, lead, children }) => {
  const { t } = useLanguage()
  const Icon = icon

  return (
    <div className="flex flex-col w-full">
      <header className="relative overflow-hidden bg-gradient-to-b from-surface-container-high/80 via-surface-container-low to-background">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary-fixed/25 blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-gutter-sm pt-space-xl pb-space-lg">
          {eyebrow && (
            <p className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-md mb-space-sm">
              {Icon && <Icon className="text-title-md" aria-hidden="true" />}
              {eyebrow}
            </p>
          )}
          <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface">{title}</h1>
          {lead && <p className="mt-space-sm text-body-lg text-on-surface-variant">{lead}</p>}
        </div>
      </header>

      <div className="max-w-3xl mx-auto w-full px-gutter-sm py-margin space-y-space-lg">
        {children}
        <Link to="/" className="inline-flex items-center gap-1 text-label-lg">
          <MdArrowBack aria-hidden="true" />
          {t('help.backHome')}
        </Link>
      </div>
    </div>
  )
}

ContentPageLayout.propTypes = {
  eyebrow: PropTypes.string,
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  lead: PropTypes.string,
  children: PropTypes.node,
}

export default ContentPageLayout

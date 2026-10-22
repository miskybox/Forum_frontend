import PropTypes from 'prop-types'
import { MdExplore } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import coverImage from '../../assets/patagonia-américa.jpg'

/**
 * Two-column auth shell: editorial photo panel (desktop) and form card.
 */
const AuthLayout = ({ title, subtitle, children, before, after }) => {
  const { t } = useLanguage()

  return (
    <div className="max-w-7xl mx-auto w-full px-gutter-sm lg:px-gutter-lg py-margin">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-lg items-stretch">
        {/* Editorial panel */}
        <aside className="hidden lg:block relative rounded-lg overflow-hidden shadow-level-2 min-h-[36rem]" aria-hidden="true">
          <img src={coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-space-xl text-on-primary">
            <p className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-lowest/90 text-secondary text-label-md">
              <MdExplore aria-hidden="true" />
              {t('nav.tagline')}
            </p>
            <p className="mt-space-md font-headline text-headline-lg text-on-primary">
              {t('home.heroTitle')} <span className="italic font-normal text-primary-fixed-dim">{t('home.heroTitleAccent')}</span>
            </p>
            <p className="mt-space-sm text-body-md text-inverse-on-surface max-w-md">{t('home.heroSubtitle')}</p>
          </div>
        </aside>

        {/* Form column */}
        <div className="flex flex-col justify-center w-full max-w-md mx-auto lg:max-w-lg">
          <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface">{title}</h1>
          {subtitle && <p className="mt-space-xs text-body-md text-on-surface-variant">{subtitle}</p>}
          {before && <div className="mt-space-lg">{before}</div>}
          <div className="mt-space-lg bg-surface-container-lowest rounded-lg p-space-md sm:p-space-lg shadow-level-2">
            {children}
          </div>
          {after && <div className="mt-space-lg">{after}</div>}
        </div>
      </div>
    </div>
  )
}

AuthLayout.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  before: PropTypes.node,
  after: PropTypes.node,
}

export default AuthLayout

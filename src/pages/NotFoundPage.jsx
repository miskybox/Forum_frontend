import { Link } from 'react-router-dom'
import { MdExplore } from 'react-icons/md'
import { useLanguage } from '../contexts/LanguageContext'

const NotFoundPage = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-[70vh] flex items-center px-gutter-sm py-margin-lg">
      <div className="max-w-md mx-auto text-center">
        <span className="w-20 h-20 mx-auto mb-space-md rounded-full bg-secondary-container flex items-center justify-center">
          <MdExplore className="text-headline-lg text-secondary" aria-hidden="true" />
        </span>
        <p className="font-headline text-display-lg text-primary">404</p>
        <h1 className="mt-space-xs font-headline text-headline-md text-on-surface">{t('notFound.title')}</h1>
        <p className="mt-space-sm text-body-md text-on-surface-variant">{t('notFound.description')}</p>
        <div className="mt-space-lg flex flex-col sm:flex-row gap-space-sm justify-center">
          <Link to="/" className="btn btn-primary">{t('notFound.backHome')}</Link>
          <Link to="/forums" className="btn btn-outline">{t('notFound.exploreForums')}</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage

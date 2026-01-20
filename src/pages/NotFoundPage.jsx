// Archivo: src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const NotFoundPage = () => {
  const { t } = useLanguage()

  return (
    <div className="bg-earth-50 py-16 md:py-24 min-h-[70vh] flex items-center">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-9xl font-bold text-ocean-500 mb-2">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-earth-800 mb-4">
            {t('notFound.title')}
          </h2>
          <p className="text-earth-600 mb-8">
            {t('notFound.description')}
          </p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary"
            >
              {t('notFound.backHome')}
            </Link>
            <Link
              to="/forums"
              className="btn btn-outline"
            >
              {t('notFound.exploreForums')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
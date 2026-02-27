import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import SEO from '../components/common/SEO'

const AboutPage = () => {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8">
      <SEO
        title="Sobre nosotros"
        description="Conoce ForumViajeros, la comunidad de viajeros donde compartir experiencias, rutas y consejos de viaje de todo el mundo."
        url="/about"
      />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t('about.title')}</h1>
        <div className="prose prose-lg">
          <p className="text-lg mb-4">
            {t('about.description1')}
          </p>
          <p className="mb-4">
            {t('about.description2')}
          </p>
          <div className="mt-8">
            <Link to="/" className="btn btn-primary">
              {t('help.backHome')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage



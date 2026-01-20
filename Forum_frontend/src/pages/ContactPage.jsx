import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const ContactPage = () => {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t('contact.title')}</h1>
        <div className="prose prose-lg">
          <p className="text-lg mb-4">
            {t('contact.subtitle')}
          </p>
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">{t('contact.email')}</h2>
              <p>contacto@forumviajeros.com</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">{t('contact.socialNetworks')}</h2>
              <p>{t('contact.socialDescription')}</p>
            </div>
          </div>
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

export default ContactPage



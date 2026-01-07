import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const HelpPage = () => {
  const { t } = useLanguage()
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{t('help.title')}</h1>
        <div className="prose prose-lg">
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">{t('help.faqTitle')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{t('help.howCreateForum')}</h3>
                  <p>{t('help.howCreateForumAnswer')}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{t('help.howPlayTrivia')}</h3>
                  <p>{t('help.howPlayTriviaAnswer')}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{t('help.howEditProfile')}</h3>
                  <p>{t('help.howEditProfileAnswer')}</p>
                </div>
              </div>
            </section>
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

export default HelpPage



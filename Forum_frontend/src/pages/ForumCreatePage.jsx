// Archivo: src/pages/ForumCreatePage.jsx
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import ForumForm from '../components/forums/ForumForm'

const ForumCreatePage = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-ocean-500 mb-2 tracking-normal uppercase">
                {t('forums.createNew')}
              </h1>
              <p className="text-light-soft text-base sm:text-lg">
                {t('forums.createDescription')}
              </p>
            </div>

            <Link
              to="/forums"
              className="inline-flex items-center gap-2 px-4 py-2 text-ocean-400 hover:text-ocean-300 font-bold transition-colors border-2 border-ocean-600 hover:border-ocean-500 rounded-lg"
            >
              <span>←</span>
              <span>{t('forums.backToForums')}</span>
            </Link>
          </div>
        </div>

        {/* Form Card */}
        <div className="card max-w-4xl">
          <ForumForm />
        </div>

        {/* Tips Card */}
        <div className="card max-w-4xl mt-6 border-terracotta-600">
          <h3 className="text-xl font-bold text-terracotta-500 mb-4 tracking-normal uppercase">
            💡 {t('forums.tipsTitle')}
          </h3>
          <ul className="space-y-3 text-light-soft">
            <li className="flex items-start gap-3">
              <span className="text-ocean-500 text-xl">✓</span>
              <span>
                <strong className="text-ocean-400">{t('forums.tipDescriptiveTitle')}</strong> {t('forums.tipDescriptiveTitleText')}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ocean-500 text-xl">✓</span>
              <span>
                <strong className="text-ocean-400">{t('forums.tipFullDescription')}</strong> {t('forums.tipFullDescriptionText')}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ocean-500 text-xl">✓</span>
              <span>
                <strong className="text-ocean-400">{t('forums.tipAppropriateCategory')}</strong> {t('forums.tipAppropriateCategoryText')}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-ocean-500 text-xl">✓</span>
              <span>
                <strong className="text-ocean-400">{t('forums.tipBeSpecific')}</strong> {t('forums.tipBeSpecificText')}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ForumCreatePage
import { useParams } from 'react-router-dom'
import ForumList from '../components/forums/ForumList'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * ForumListPage con tema Adventure Explorer Retro
 * Paleta accesible WCAG AA
 */
const ForumListPage = () => {
  const { categoryId } = useParams()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen py-8 sm:py-12 relative overflow-hidden">
      {/* Efectos sutiles de aventura - partículas doradas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
            }}
          >
            {['🏺', '🗺️', '⚱️', '💎'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-6xl md:text-7xl mb-6">🏺</div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-500 mb-4 tracking-normal uppercase">
            {t('forums.title')}
          </h1>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-primary-500 to-transparent mb-4"></div>
          <p className="text-light-soft font-bold text-sm md:text-base tracking-normal">
            {t('forums.subtitle')}
          </p>
        </div>
        <ForumList categoryId={categoryId} />
      </div>
    </div>
  )
}

export default ForumListPage

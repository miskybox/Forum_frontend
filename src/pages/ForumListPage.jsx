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
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
              backgroundColor: ['#E5A13E', '#CFE7E5', '#213638'][Math.floor(Math.random() * 3)]
            }}
          />
        ))}
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-6 bg-golden rounded-full flex items-center justify-center shadow-xl border-4 border-midnight">
            <svg className="w-12 h-12 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-midnight mb-4 tracking-normal uppercase">
            {t('forums.title')}
          </h1>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-ocean-500 to-transparent mb-4"></div>
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

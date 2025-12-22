import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CategoryList from '../components/categories/CategoryList'
import ForumList from '../components/forums/ForumList'
import forumService from '../services/forumService'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * HomePage con diseño Adventure Explorer Retro 80s/90s
 * Paleta de colores accesibles (WCAG AA) - Golden/Brown/Green earth tones
 */
const HomePage = () => {
  const { t } = useLanguage()
  const [recentForums, setRecentForums] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentQuote, setCurrentQuote] = useState(0)

  const retroQuotes = [
    t('home.adventureAwaits') || "ADVENTURE AWAITS...",
    t('home.exploreUnknown') || "EXPLORE THE UNKNOWN...",
    t('home.timeToTravel') || "TIME TO TRAVEL...",
    t('home.discoverWorlds') || "DISCOVER NEW WORLDS...",
    t('home.journeyStarts') || "YOUR JOURNEY STARTS HERE..."
  ]
  
  useEffect(() => {
    const fetchRecentForums = async () => {
      try {
        const response = await forumService.getAllForums(0, 3)
        // Manejar tanto respuesta paginada como array directo
        const forums = Array.isArray(response) ? response : (response.content || [])
        setRecentForums(forums)
      } catch (error) {
        console.error("Error al cargar los foros recientes:", error)
        setRecentForums([]) // Asegurar que siempre sea un array
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecentForums()
    
    // Cambiar quote cada 3 segundos
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % retroQuotes.length)
    }, 3000)
    
    return () => clearInterval(quoteInterval)
  }, [])
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Efecto sutil de pergamino - partículas doradas apenas visibles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section - Adventure Explorer */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="container mx-auto text-center relative z-10">
          {/* Título principal estilo póster retro */}
          <div className="mb-8 animate-fade-in">
            <div className="text-6xl md:text-7xl mb-6">🗺️</div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-2 text-primary-500 tracking-wide uppercase">
              FORUM
            </h1>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-secondary-500 tracking-wide uppercase">
              VIAJEROS
            </h1>
            <p className="text-lg md:text-xl font-bold text-accent-500 tracking-wide mb-6">
              {t('home.demo')}
            </p>
            <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-primary-500 to-transparent mb-6"></div>
          </div>

          {/* Quote animado - Accesible */}
          <div className="mb-12 h-12 flex items-center justify-center">
            <p className="text-lg md:text-xl font-bold text-primary-400 animate-pulse tracking-normal">
              {retroQuotes[currentQuote]}
            </p>
          </div>

          {/* Botones de acción - Accesibles */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <Link
              to="/forums"
              className="bg-primary-600 text-light border-2 border-primary-800 px-8 py-4 rounded-lg font-bold tracking-wide text-base hover:bg-primary-700 hover:border-primary-900 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] w-64 flex items-center justify-center"
            >
              <span className="flex items-center space-x-2">
                <span className="text-2xl">🏺</span>
                <span>{t('home.exploreForum') || 'EXPLORAR FOROS'}</span>
              </span>
            </Link>

            <Link
              to="/trivia"
              className="bg-secondary-600 text-light border-2 border-secondary-800 px-8 py-4 rounded-lg font-bold tracking-wide text-base hover:bg-secondary-700 hover:border-secondary-900 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] w-64 flex items-center justify-center"
            >
              <span className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span>{t('home.playTrivia') || 'JUGAR TRIVIA'}</span>
              </span>
            </Link>

            <Link
              to="/travel"
              className="bg-accent-600 text-light border-2 border-accent-800 px-8 py-4 rounded-lg font-bold tracking-wide text-base hover:bg-accent-700 hover:border-accent-900 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] w-64 flex items-center justify-center"
            >
              <span className="flex items-center space-x-2">
                <span className="text-2xl">🗺️</span>
                <span>{t('home.myMap') || 'MI MAPA'}</span>
              </span>
            </Link>
          </div>

          {/* Grid de secciones - Estilo mapa del tesoro */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
            {[
              { to: '/forums', icon: '🏺', title: t('home.adventure'), color: 'text-primary-500' },
              { to: '/travel', icon: '🌴', title: t('home.jungle'), color: 'text-secondary-500' },
              { to: '/profile', icon: '👤', title: t('home.profile'), color: 'text-accent-500' },
              { to: '/trivia', icon: '⚡', title: t('home.trivia'), color: 'text-warning' },
            ].map((world, index) => (
              <Link
                key={world.to}
                to={world.to}
                className="card group hover:scale-105 hover:border-primary-500 transition-all duration-300"
              >
                <div className="text-center p-4 md:p-6">
                  <div className="text-4xl md:text-5xl mb-3 md:mb-4 transform group-hover:scale-110 transition-transform duration-300"
                       style={{ animationDelay: `${index * 0.2}s` }}>
                    {world.icon}
                  </div>
                  <h3 className={`text-xs md:text-sm lg:text-base ${world.color} font-bold tracking-normal uppercase`}>
                    {world.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Foros Recientes */}
      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">📜</div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-500 mb-4 tracking-normal uppercase">
            {t('home.latestAdventures')}
          </h2>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-primary-500 to-transparent"></div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin text-6xl">⏳</div>
            <p className="mt-4 text-primary-400 font-bold text-lg tracking-normal">
              {t('home.loading')}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {recentForums.length > 0 ? (
              recentForums.map((forum) => (
                <div key={forum.id} className="card group hover:border-primary-500">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-primary-400 mb-3 group-hover:text-primary-300 transition-colors tracking-normal uppercase">
                      {forum.title}
                    </h3>
                    <p className="text-sm text-light-soft mb-4 line-clamp-3">
                      {forum.description}
                    </p>
                    <Link
                      to={`/forums/${forum.id}`}
                      className="inline-flex items-center space-x-2 text-secondary-500 hover:text-secondary-400 transition-colors font-bold text-sm uppercase tracking-normal"
                    >
                      <span>{t('home.explore')}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-primary-400 font-bold text-lg tracking-normal">
                  {t('home.noForums')}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/forums"
            className="inline-block bg-primary-600 border-2 border-primary-800 text-light px-8 py-4 rounded-lg font-bold uppercase tracking-normal hover:bg-primary-700 hover:border-primary-900 transition-all duration-300 shadow-lg min-h-[48px]"
          >
            {t('home.viewAllForums')} →
          </Link>
        </div>
      </section>

      {/* Sección de Categorías */}
      <section className="container mx-auto px-4 py-12 pb-20 relative z-10">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">🌍</div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary-500 mb-4 tracking-normal uppercase">
            {t('home.continents')}
          </h2>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-secondary-500 to-transparent"></div>
        </div>
        <CategoryList />
      </section>
    </div>
  )
}

export default HomePage

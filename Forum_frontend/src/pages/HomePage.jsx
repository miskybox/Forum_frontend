import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CategoryList from '../components/categories/CategoryList'
import ForumList from '../components/forums/ForumList'
import forumService from '../services/forumService'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * HomePage - Paleta única #A0937D #E7D4B5 #F6E6CB #B6C7AA
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
            className="absolute w-1 h-1 bg-accent rounded-full animate-float"
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
      <section className="relative py-20 md:py-32 px-4" aria-labelledby="hero-title">
        <div className="container mx-auto text-center relative z-10">
          {/* Título principal estilo póster retro */}
          <div className="mb-8 animate-fade-in">
            <div className="text-6xl md:text-7xl mb-6" aria-hidden="true">🗺️</div>
            <h1 id="hero-title" className="text-4xl md:text-6xl lg:text-7xl font-display font-black mb-2 text-text tracking-wide">
              <span>Forum</span>
              <span className="sr-only"> - </span>
            </h1>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black mb-4 text-accent tracking-wide">
              <span className="sr-only">Comunidad de </span>Viajeros
            </h1>
            <p className="text-lg md:text-xl font-bold text-text tracking-wide mb-6">
              {t('home.demo')}
            </p>
            <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-accent to-transparent mb-6"></div>
          </div>

          {/* Quote animado - Accesible */}
          <div className="mb-12 h-12 flex items-center justify-center">
            <p className="text-lg md:text-xl font-bold text-text animate-pulse tracking-normal">
              {retroQuotes[currentQuote]}
            </p>
          </div>

          {/* Botones de acción - Accesibles */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <Link
              to="/forums"
              className="bg-secondary text-text border-2 border-secondary-dark px-8 py-4 rounded-lg font-bold tracking-wide text-base hover:bg-secondary-dark transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] w-64 flex items-center justify-center"
            >
              <span className="flex items-center space-x-2">
                <span className="text-2xl" aria-hidden="true">🏺</span>
                <span>{t('home.exploreForum') || 'EXPLORAR FOROS'}</span>
              </span>
            </Link>

            <Link
              to="/trivia"
              className="bg-accent text-primary-light border-2 border-accent-dark px-8 py-4 rounded-lg font-bold tracking-wide text-base hover:bg-accent-dark transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] w-64 flex items-center justify-center"
            >
              <span className="flex items-center space-x-2">
                <span className="text-2xl" aria-hidden="true">🎯</span>
                <span>{t('home.playTrivia') || 'JUGAR TRIVIA'}</span>
              </span>
            </Link>

            <Link
              to="/travel"
              className="bg-accent-light text-text border-2 border-accent px-8 py-4 rounded-lg font-bold tracking-wide text-base hover:bg-accent transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] w-64 flex items-center justify-center"
            >
              <span className="flex items-center space-x-2">
                <span className="text-2xl" aria-hidden="true">🗺️</span>
                <span>{t('home.myMap') || 'MI MAPA'}</span>
              </span>
            </Link>
          </div>

          {/* Grid de secciones - Estilo mapa del tesoro */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-xl mx-auto mb-6">
            {[
              { to: '/profile', icon: '👤', title: t('home.profile'), color: 'text-accent' },
              { to: '/trivia', icon: '⚡', title: t('home.trivia'), color: 'text-text' },
            ].map((world, index) => (
              <Link
                key={world.to}
                to={world.to}
                className="card group hover:scale-105 hover:border-accent transition-all duration-300"
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
      <section className="container mx-auto px-4 py-6 relative z-10">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">📜</div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-2 tracking-normal uppercase">
            {t('home.latestAdventures')}
          </h2>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-accent to-transparent"></div>
        </div>

        {loading ? (
          <div className="text-center py-20" role="status" aria-live="polite">
            <div className="inline-block animate-spin text-6xl" aria-hidden="true">⏳</div>
            <p className="mt-4 text-text font-bold text-lg tracking-normal">
              <span className="sr-only">Estado: </span>{t('home.loading')}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {recentForums.length > 0 ? (
              recentForums.map((forum) => (
                <div key={forum.id} className="card group hover:border-secondary">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-text mb-3 group-hover:text-accent transition-colors tracking-normal uppercase">
                      {forum.title}
                    </h3>
                    <p className="text-sm text-text-light mb-4 line-clamp-3">
                      {forum.description}
                    </p>
                    <Link
                      to={`/forums/${forum.id}`}
                      className="inline-flex items-center space-x-2 text-accent hover:text-accent-dark transition-colors font-bold text-sm uppercase tracking-normal"
                    >
                      <span>{t('home.explore')}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-text font-bold text-lg tracking-normal">
                  {t('home.noForums')}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-6">
          <Link
            to="/forums"
            className="inline-block bg-secondary border-2 border-secondary-dark text-text px-6 py-3 rounded-lg font-bold uppercase tracking-normal hover:bg-secondary-dark transition-all duration-300 shadow-lg min-h-[44px] text-sm"
          >
            {t('home.viewAllForums')} →
          </Link>
        </div>
      </section>

      {/* Sección de Categorías */}
      <section className="container mx-auto px-4 py-6 pb-24 relative z-10">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🌍</div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-accent mb-2 tracking-normal uppercase">
            {t('home.continents')}
          </h2>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-accent to-transparent"></div>
        </div>
        <CategoryList />
      </section>
    </div>
  )
}

export default HomePage

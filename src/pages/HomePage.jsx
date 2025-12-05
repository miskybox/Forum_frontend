import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import CategoryList from '../components/categories/CategoryList'
import ForumList from '../components/forums/ForumList'
import forumService from '../services/forumService'

/**
 * HomePage con diseño retro 80s/90s
 */
const HomePage = () => {
  const [recentForums, setRecentForums] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentQuote, setCurrentQuote] = useState(0)
  
  const retroQuotes = [
    "ADVENTURE AWAITS...",
    "EXPLORE THE UNKNOWN...",
    "TIME TO TRAVEL...",
    "DISCOVER NEW WORLDS...",
    "YOUR JOURNEY STARTS HERE..."
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
    <div className="theme-retro min-h-screen relative overflow-hidden">
      {/* Efecto de partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-neon-cyan rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section Retro */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="container mx-auto text-center relative z-10">
          {/* Título principal con efecto neon */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display mb-4 neon-text text-neon-cyan">
              FORUM
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display mb-4 neon-text text-neon-pink">
              VIAJEROS
            </h1>
            <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-neon-cyan to-transparent mb-6"></div>
          </div>

          {/* Quote animado */}
          <div className="mb-12 h-12 flex items-center justify-center">
            <p className="text-2xl md:text-3xl font-retro text-neon-yellow neon-text animate-pulse-neon">
              {retroQuotes[currentQuote]}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <Link
              to="/forums"
              className="btn btn-primary text-lg px-8 py-4 relative group"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span className="text-2xl">🏺</span>
                <span>EXPLORAR FOROS</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              to="/trivia"
              className="btn btn-secondary text-lg px-8 py-4 relative group"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span className="text-2xl">⚡</span>
                <span>JUGAR TRIVIA</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-yellow via-neon-orange to-neon-yellow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              to="/travel"
              className="btn btn-outline text-lg px-8 py-4 text-neon-green border-neon-green relative group"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span className="text-2xl">🌴</span>
                <span>MI MAPA</span>
              </span>
            </Link>
          </div>

          {/* Grid de mundos temáticos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto mb-16">
            {[
              { to: '/forums', icon: '🏺', title: 'AVENTURA', color: 'text-adventure-gold' },
              { to: '/travel', icon: '🌴', title: 'JUNGLA', color: 'text-jungle-gold' },
              { to: '/profile', icon: '🤖', title: 'TECH', color: 'text-tech-neon' },
              { to: '/trivia', icon: '⚡', title: 'ESPACIO', color: 'text-space-neon' },
            ].map((world, index) => (
              <Link
                key={world.to}
                to={world.to}
                className="card group hover:scale-110 transition-transform duration-300"
              >
                <div className="text-center p-3 md:p-6">
                  <div className="text-3xl md:text-5xl mb-2 md:mb-4 animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
                    {world.icon}
                  </div>
                  <h3 className={`font-display text-xs md:text-sm lg:text-base ${world.color} neon-text whitespace-nowrap`}>
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
          <h2 className="text-4xl md:text-5xl font-display text-neon-pink neon-text mb-4">
            ÚLTIMAS AVENTURAS
          </h2>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-neon-pink to-transparent"></div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin text-6xl">⚡</div>
            <p className="mt-4 text-neon-cyan font-retro">CARGANDO...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {recentForums.length > 0 ? (
              recentForums.map((forum) => (
                <div key={forum.id} className="card group">
                  <div className="p-6">
                    <h3 className="text-xl font-display text-neon-cyan mb-3 neon-text group-hover:text-neon-pink transition-colors">
                      {forum.title}
                    </h3>
                    <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                      {forum.description}
                    </p>
                    <Link
                      to={`/forums/${forum.id}`}
                      className="inline-flex items-center space-x-2 text-neon-yellow hover:text-neon-orange transition-colors font-retro text-xs uppercase tracking-wider"
                    >
                      <span>EXPLORAR</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-neon-cyan font-retro text-lg">
                  NO HAY FOROS DISPONIBLES
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/forums"
            className="btn btn-outline text-neon-cyan border-neon-cyan px-8 py-4"
          >
            VER TODOS LOS FOROS →
          </Link>
        </div>
      </section>

      {/* Sección de Categorías */}
      <section className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display text-neon-green neon-text mb-4">
            CONTINENTES
          </h2>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-neon-green to-transparent"></div>
        </div>
        <CategoryList />
      </section>
    </div>
  )
}

export default HomePage

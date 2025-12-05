import { useParams } from 'react-router-dom'
import ForumList from '../components/forums/ForumList'

/**
 * ForumListPage con tema Adventure
 */
const ForumListPage = () => {
  const { categoryId } = useParams()
  
  return (
    <div className="theme-adventure min-h-screen py-8 sm:py-12 relative overflow-hidden">
      {/* Efectos de fondo aventura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            {['🏺', '🗺️', '⚱️', '💎'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-6xl mb-4 animate-pulse-neon">🏺</div>
          <h1 className="text-4xl md:text-6xl font-display text-adventure-gold neon-text mb-4">
            FOROS DE AVENTURA
          </h1>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-adventure-gold to-transparent mb-4"></div>
          <p className="text-adventure-light font-retro text-sm uppercase tracking-wider opacity-80">
            EXPLORA EXPERIENCIAS DE VIAJEROS
          </p>
        </div>
        <ForumList categoryId={categoryId} />
      </div>
    </div>
  )
}

export default ForumListPage

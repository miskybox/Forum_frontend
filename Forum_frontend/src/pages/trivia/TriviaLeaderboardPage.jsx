import { useAuth } from '../../hooks/useAuth'
import TriviaLeaderboard from '../../components/trivia/TriviaLeaderboard'
import { Link } from 'react-router-dom'

/**
 * Página del ranking de trivia
 */
const TriviaLeaderboardPage = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
      {/* Header */}
      <div className="bg-black/20 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                to="/trivia"
                className="text-ocean-300 hover:text-light transition-colors text-sm mb-2 inline-block"
              >
                ← Volver al menú
              </Link>
              <h1 className="text-2xl font-bold text-light">🏆 Ranking de Trivia</h1>
            </div>
            <Link
              to="/trivia"
              className="px-6 py-3 bg-ocean-600 text-white rounded-xl font-bold hover:bg-ocean-700 transition-colors"
            >
              🎮 Jugar ahora
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <TriviaLeaderboard currentUserId={user?.id} />
      </div>
    </div>
  )
}

export default TriviaLeaderboardPage


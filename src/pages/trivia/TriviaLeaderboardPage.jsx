import { useAuth } from '../../hooks/useAuth'
import TriviaLeaderboard from '../../components/trivia/TriviaLeaderboard'
import { Link } from 'react-router-dom'

/**
 * Página del ranking de trivia
 */
const TriviaLeaderboardPage = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-teal-dark to-midnight">
      {/* Header */}
      <div className="bg-black/20 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                to="/trivia"
                className="text-aqua hover:text-white transition-colors text-sm mb-2 inline-block"
              >
                ← Volver al menú
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Ranking de Trivia</h1>
            </div>
            <Link
              to="/trivia"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-golden text-midnight rounded-xl font-bold hover:bg-golden-dark transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
            >
              Jugar ahora
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


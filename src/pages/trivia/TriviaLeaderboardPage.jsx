import { useAuth } from '../../hooks/useAuth'
import TriviaLeaderboard from '../../components/trivia/TriviaLeaderboard'
import { Link } from 'react-router-dom'

/**
 * Página del ranking de trivia
 */
const TriviaLeaderboardPage = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-surface-container-high/80 via-surface-container-low to-background py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                to="/trivia"
                className="text-on-surface-variant hover:text-primary transition-colors text-sm mb-2 inline-block"
              >
                ← Volver al menú
              </Link>
              <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface">Ranking de Trivia</h1>
            </div>
            <Link
              to="/trivia"
              className="px-4 py-2 sm:px-6 sm:py-3 bg-primary-fixed text-on-surface rounded-lg font-bold hover:bg-primary-fixed-dim transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
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


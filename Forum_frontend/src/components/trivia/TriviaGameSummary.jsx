import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Componente que muestra el resumen final de una partida
 */
const TriviaGameSummary = ({ game, onPlayAgain }) => {
  const { t } = useLanguage()
  const accuracy = game.totalQuestions > 0
    ? (game.correctAnswers / game.totalQuestions) * 100
    : 0

  const getGrade = () => {
    if (accuracy >= 90) return { grade: 'S', color: 'text-warning', message: t('trivia.summary.perfect') }
    if (accuracy >= 80) return { grade: 'A', color: 'text-success', message: t('trivia.summary.excellent') }
    if (accuracy >= 70) return { grade: 'B', color: 'text-info', message: t('trivia.summary.veryGood') }
    if (accuracy >= 60) return { grade: 'C', color: 'text-secondary-500', message: t('trivia.summary.wellDone') }
    if (accuracy >= 50) return { grade: 'D', color: 'text-warning-dark', message: t('trivia.summary.canImprove') }
    return { grade: 'F', color: 'text-error', message: t('trivia.summary.keepPracticing') }
  }

  const { grade, color, message } = getGrade()

  return (
    <div className="card overflow-hidden max-w-lg mx-auto">
      {/* Header con confeti si es partida perfecta */}
      <div className={`relative px-6 py-8 text-center ${
        game.perfectGame
          ? 'bg-gradient-to-br from-warning-dark via-warning to-warning'
          : 'bg-gradient-to-br from-primary-600 to-secondary-600'
      }`}>
        {game.perfectGame && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className="absolute animate-bounce text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                ✨
              </span>
            ))}
          </div>
        )}

        <div className="relative z-10">
          <span className={`text-8xl font-black ${color}`}>{grade}</span>
          <p className="text-white text-xl mt-2 font-bold">{message}</p>

          {game.perfectGame && (
            <div className="mt-4 bg-white/20 rounded-full px-4 py-2 inline-block">
              <span className="text-white font-bold">🏆 {t('trivia.summary.perfectGame')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatBox
            icon="🎯"
            value={game.score}
            label={t('trivia.score')}
          />
          <StatBox
            icon="✅"
            value={`${game.correctAnswers}/${game.totalQuestions}`}
            label={t('trivia.summary.correct')}
          />
          <StatBox
            icon="📊"
            value={`${accuracy.toFixed(0)}%`}
            label={t('trivia.precision')}
          />
          <StatBox
            icon="⏱️"
            value={formatTime(game.totalTimeSeconds)}
            label={t('trivia.summary.time')}
          />
        </div>

        {/* Barra de precisión */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-primary-800 dark:text-primary-100 mb-2 font-semibold">
            <span>{t('trivia.precision')}</span>
            <span className="font-bold">{accuracy.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-primary-200 dark:bg-primary-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                accuracy >= 80 ? 'bg-success' :
                accuracy >= 60 ? 'bg-info' :
                accuracy >= 40 ? 'bg-warning' : 'bg-error'
              }`}
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onPlayAgain}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-bold hover:from-primary-600 hover:to-secondary-600 transition-colors"
          >
            🎮 {t('trivia.summary.playAgainButton')}
          </button>

          <Link
            to="/trivia/leaderboard"
            className="w-full py-3 border-2 border-primary-400 dark:border-primary-500 rounded-xl font-bold text-primary-800 dark:text-primary-200 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors text-center"
          >
            🏆 {t('trivia.summary.viewRanking')}
          </Link>

          <Link
            to="/trivia"
            className="w-full py-3 text-primary-800 dark:text-primary-200 hover:text-primary-500 transition-colors text-center font-semibold"
          >
            ← {t('trivia.infinite.backToMenu')}
          </Link>
        </div>
      </div>
    </div>
  )
}

const StatBox = ({ icon, value, label }) => (
  <div className="bg-primary-100 dark:bg-primary-800 rounded-xl p-4 text-center">
    <span className="text-2xl">{icon}</span>
    <p className="text-2xl font-bold text-primary-900 dark:text-primary-100 mt-1">{value}</p>
    <p className="text-primary-800 dark:text-primary-200 text-sm font-semibold">{label}</p>
  </div>
)

StatBox.propTypes = {
  icon: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired
}

const formatTime = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

TriviaGameSummary.propTypes = {
  game: PropTypes.shape({
    score: PropTypes.number.isRequired,
    correctAnswers: PropTypes.number.isRequired,
    totalQuestions: PropTypes.number.isRequired,
    totalTimeSeconds: PropTypes.number,
    perfectGame: PropTypes.bool,
    accuracyPercentage: PropTypes.number
  }).isRequired,
  onPlayAgain: PropTypes.func.isRequired
}

export default TriviaGameSummary


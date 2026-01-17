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
    if (accuracy >= 60) return { grade: 'C', color: 'text-terracotta-500', message: t('trivia.summary.wellDone') }
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
          : 'bg-gradient-to-br from-secondary to-accent'
      }`}>
        {game.perfectGame && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className="absolute animate-bounce w-3 h-3 rounded-full bg-golden/60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10">
          <span className={`text-8xl font-black ${color}`}>{grade}</span>
          <p className="text-white text-xl mt-2 font-bold">{message}</p>

          {game.perfectGame && (
            <div className="mt-4 bg-golden/30 rounded-full px-4 py-2 inline-block border border-golden">
              <span className="text-white font-bold">{t('trivia.summary.perfectGame')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatBox
            icon={null}
            value={game.score}
            label={t('trivia.score')}
            bgColor="bg-golden/20"
          />
          <StatBox
            icon={null}
            value={`${game.correctAnswers}/${game.totalQuestions}`}
            label={t('trivia.summary.correct')}
            bgColor="bg-aqua/30"
          />
          <StatBox
            icon={null}
            value={`${accuracy.toFixed(0)}%`}
            label={t('trivia.precision')}
            bgColor="bg-midnight/30"
          />
          <StatBox
            icon={null}
            value={formatTime(game.totalTimeSeconds)}
            label={t('trivia.summary.time')}
            bgColor="bg-golden/20"
          />
        </div>

        {/* Barra de precisión */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-text mb-2 font-semibold">
            <span>{t('trivia.precision')}</span>
            <span className="font-bold">{accuracy.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-primary-dark rounded-full overflow-hidden">
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
            className="w-full py-3 bg-gradient-to-r from-secondary to-accent text-white rounded-xl font-bold hover:from-secondary-dark hover:to-accent-dark transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {t('trivia.summary.playAgainButton')}
          </button>

          <Link
            to="/trivia/leaderboard"
            className="w-full py-3 border-2 border-secondary rounded-xl font-bold text-text hover:bg-secondary-light transition-colors text-center flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
            {t('trivia.summary.viewRanking')}
          </Link>

          <Link
            to="/trivia"
            className="w-full py-3 text-text hover:text-accent transition-colors text-center font-semibold"
          >
            ← {t('trivia.infinite.backToMenu')}
          </Link>
        </div>
      </div>
    </div>
  )
}

const StatBox = ({ icon, value, label, bgColor = 'bg-secondary-light' }) => (
  <div className={`${bgColor} rounded-xl p-4 text-center`}>
    {icon && <span className="text-2xl">{icon}</span>}
    <p className="text-2xl font-bold text-text mt-1">{value}</p>
    <p className="text-text-light text-sm font-semibold">{label}</p>
  </div>
)

StatBox.propTypes = {
  icon: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  bgColor: PropTypes.string
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

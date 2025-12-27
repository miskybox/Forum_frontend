import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Componente que muestra las estadísticas de trivia del usuario
 */
const TriviaStats = ({ stats }) => {
  const { t } = useLanguage()
  
  if (!stats) return null

  const expProgress = stats.experienceToNextLevel > 0
    ? (stats.experiencePoints / stats.experienceToNextLevel) * 100
    : 0

  return (
    <div className="card p-6">
      {/* Header con nivel */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-2xl border-2 border-primary-500">
              {stats.profileImageUrl ? (
                <img
                  src={stats.profileImageUrl}
                  alt={stats.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : '🧠'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary-900 dark:text-primary-100">{stats.username}</h3>
              <p className="text-primary-800 dark:text-primary-200 text-sm font-semibold">{stats.playerTitle}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-primary-700 dark:text-primary-300">{t('trivia.level')} {stats.level}</span>
          {stats.globalRank && (
            <p className="text-primary-800 dark:text-primary-200 text-sm font-semibold">{t('trivia.rank')} #{stats.globalRank}</p>
          )}
        </div>
      </div>

      {/* Barra de experiencia */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 text-primary-800 dark:text-primary-200 font-semibold">
          <span>XP</span>
          <span>{stats.experiencePoints} / {stats.experienceToNextLevel} XP</span>
        </div>
        <div className="h-3 bg-primary-200 dark:bg-primary-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
            style={{ width: `${Math.min(expProgress, 100)}%` }}
          />
        </div>
      </div>

      {/* Grid de stats principales */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon="⭐"
          value={stats.totalScore?.toLocaleString() || 0}
          label={t('trivia.score')}
        />
        <StatCard
          icon="🎮"
          value={stats.totalGames || 0}
          label={t('trivia.questions')}
        />
        <StatCard
          icon="🎯"
          value={`${stats.accuracyPercentage?.toFixed(1) || 0}%`}
          label={t('trivia.correctAnswers')}
        />
        <StatCard
          icon="🔥"
          value={stats.bestStreak || 0}
          label={t('trivia.bestStreak')}
        />
      </div>

      {/* Tiempo promedio */}
      {stats.avgResponseTime && (
        <div className="bg-primary-100 dark:bg-primary-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary-800 dark:text-primary-200">
            ⚡ {(stats.avgResponseTime / 1000).toFixed(1)}s
          </p>
        </div>
      )}

      {/* Racha diaria */}
      {stats.dailyStreak > 0 && (
        <div className="mt-4 bg-accent-100 dark:bg-accent-900 rounded-xl p-3 text-center border-2 border-accent-500">
          <span className="text-xl">🔥</span>
          <span className="ml-2 font-bold text-accent-800 dark:text-accent-200">{stats.dailyStreak}</span>
        </div>
      )}
    </div>
  )
}

const StatCard = ({ icon, value, label }) => (
  <div className="bg-primary-100 dark:bg-primary-800 rounded-xl p-3 text-center">
    <span className="text-2xl">{icon}</span>
    <p className="text-xl font-bold text-primary-900 dark:text-primary-100 mt-1">{value}</p>
    <p className="text-primary-800 dark:text-primary-200 text-xs font-semibold">{label}</p>
  </div>
)

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired
}

const MiniStat = ({ label, value }) => (
  <div className="bg-primary-100 dark:bg-primary-800 rounded-lg p-2 text-center">
    <p className="text-primary-800 dark:text-primary-200 text-xs font-semibold">{label}</p>
    <p className="font-bold text-primary-900 dark:text-primary-100">{value}</p>
  </div>
)

MiniStat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

TriviaStats.propTypes = {
  stats: PropTypes.shape({
    username: PropTypes.string,
    profileImageUrl: PropTypes.string,
    playerTitle: PropTypes.string,
    level: PropTypes.number,
    globalRank: PropTypes.number,
    experiencePoints: PropTypes.number,
    experienceToNextLevel: PropTypes.number,
    totalScore: PropTypes.number,
    totalGames: PropTypes.number,
    accuracyPercentage: PropTypes.number,
    bestStreak: PropTypes.number,
    currentStreak: PropTypes.number,
    correctAnswers: PropTypes.number,
    totalQuestions: PropTypes.number,
    perfectGames: PropTypes.number,
    avgResponseTime: PropTypes.number,
    bestResponseTime: PropTypes.number,
    dailyStreak: PropTypes.number
  })
}

export default TriviaStats


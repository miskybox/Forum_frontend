import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * TriviaStats - Paleta única #A0937D #E7D4B5 #F6E6CB #B6C7AA
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
            <div className="w-14 h-14 bg-primary-dark rounded-full flex items-center justify-center text-2xl border-2 border-secondary">
              {stats.profileImageUrl ? (
                <img
                  src={stats.profileImageUrl}
                  alt={stats.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : '🧠'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-text">{stats.username}</h3>
              <p className="text-text-light text-sm font-semibold">{stats.playerTitle}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-accent">{t('trivia.level')} {stats.level}</span>
          {stats.globalRank && (
            <p className="text-text-light text-sm font-semibold">{t('trivia.rank')} #{stats.globalRank}</p>
          )}
        </div>
      </div>

      {/* Barra de experiencia */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 text-text font-semibold">
          <span>XP</span>
          <span>{stats.experiencePoints} / {stats.experienceToNextLevel} XP</span>
        </div>
        <div className="h-3 bg-primary-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-secondary to-secondary-dark rounded-full"
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
        <div className="bg-primary-dark rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-text">
            ⚡ {(stats.avgResponseTime / 1000).toFixed(1)}s
          </p>
        </div>
      )}

      {/* Racha diaria */}
      {stats.dailyStreak > 0 && (
        <div className="mt-4 bg-secondary-light rounded-xl p-3 text-center border-2 border-secondary">
          <span className="text-xl">🔥</span>
          <span className="ml-2 font-bold text-text">{stats.dailyStreak}</span>
        </div>
      )}
    </div>
  )
}

const StatCard = ({ icon, value, label }) => (
  <div className="bg-primary-dark rounded-xl p-3 text-center">
    <span className="text-2xl" aria-hidden="true">{icon}</span>
    <p className="text-xl font-bold text-text mt-1">{value}</p>
    <p className="text-text-light text-xs font-semibold">{label}</p>
  </div>
)

StatCard.propTypes = {
  icon: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired
}

const MiniStat = ({ label, value }) => (
  <div className="bg-primary-dark rounded-lg p-2 text-center">
    <p className="text-text-light text-xs font-semibold">{label}</p>
    <p className="font-bold text-text">{value}</p>
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

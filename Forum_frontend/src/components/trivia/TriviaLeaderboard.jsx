import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'
import triviaService from '../../services/triviaService'

/**
 * Componente de ranking/leaderboard de trivia
 */
const TriviaLeaderboard = ({ currentUserId }) => {
  const { t } = useLanguage()
  const [leaderboard, setLeaderboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('score')

  useEffect(() => {
    loadLeaderboard()
  }, [type])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const data = await triviaService.getLeaderboard(type, 0, 20)
      setLeaderboard(data)
    } catch (error) {
      console.error('Error cargando ranking:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-warning-dark to-warning text-white font-bold'
      case 2: return 'bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white font-bold'
      case 3: return 'bg-gradient-to-r from-ocean-500 to-ocean-600 text-white font-bold'
      default: return 'bg-accent text-primary-light font-semibold'
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return rank
    }
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-accent px-6 py-6">
        <h2 className="text-2xl font-bold text-white mb-4">🏆 {t('trivia.globalRanking')}</h2>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { value: 'score', label: `⭐ ${t('trivia.score')}` },
            { value: 'accuracy', label: `🎯 ${t('trivia.precision')}` },
            { value: 'streak', label: `🔥 ${t('trivia.streaks')}` }
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => setType(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                type === tab.value
                  ? 'bg-white text-text'
                  : 'bg-white/20 text-white/80 hover:bg-white/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="divide-y divide-primary-dark">
        {loading && (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent mx-auto" />
            <p className="text-text-light mt-4 font-semibold">{t('trivia.loadingRanking')}</p>
          </div>
        )}
        {!loading && leaderboard?.entries?.length === 0 && (
          <div className="p-12 text-center">
            <span className="text-6xl">🏜️</span>
            <p className="text-text-light mt-4 font-semibold">{t('trivia.noPlayersYet')}</p>
          </div>
        )}
        {!loading && leaderboard?.entries?.length > 0 && (
          leaderboard?.entries?.map((entry, _idx) => (
            <div
              key={entry.userId}
              className={`flex items-center gap-4 p-4 ${
                entry.userId === currentUserId ? 'bg-secondary-light' : ''
              }`}
            >
              {/* Rank */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankStyle(entry.rank)}`}>
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar y nombre */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {entry.profileImageUrl ? (
                      <img
                        src={entry.profileImageUrl}
                        alt={entry.username}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : '👤'}
                  </span>
                  <div>
                    <p className="font-bold text-text truncate">
                      {entry.username}
                      {entry.userId === currentUserId && (
                        <span className="ml-2 text-xs bg-secondary text-text px-2 py-0.5 rounded-full font-semibold">
                          {t('trivia.you')}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-text-light font-semibold">{entry.playerTitle}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <p className="text-xl font-bold text-text">
                  {type === 'score' && entry.score?.toLocaleString()}
                  {type === 'accuracy' && `${entry.accuracyPercentage?.toFixed(1)}%`}
                  {type === 'streak' && `🔥 ${entry.bestStreak}`}
                </p>
                <p className="text-xs text-text-light font-semibold">
                  {t('trivia.level')} {entry.level} • {entry.totalGames} {t('trivia.games')}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer con total */}
      {leaderboard && (
        <div className="bg-primary px-6 py-4 text-center text-text-light text-sm font-semibold">
          {leaderboard.totalPlayers?.toLocaleString()} {t('trivia.playersInRanking')}
        </div>
      )}
    </div>
  )
}

TriviaLeaderboard.propTypes = {
  currentUserId: PropTypes.number
}

export default TriviaLeaderboard

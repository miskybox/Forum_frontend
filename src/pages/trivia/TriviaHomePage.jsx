import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import TriviaStats from '../../components/trivia/TriviaStats'
import triviaService from '../../services/triviaService'
import toast from 'react-hot-toast'

/**
 * TriviaHomePage con tema Space
 */
const TriviaHomePage = () => {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      loadStats()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const loadStats = async () => {
    try {
      const data = await triviaService.getMyScore()
      setStats(data)
    } catch (error) {
      console.error('Error cargando stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const startGame = async (mode, options = {}) => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para jugar')
      navigate('/login')
      return
    }

    if (mode === 'INFINITE') {
      navigate('/trivia/infinite')
      return
    }

    setStarting(true)
    try {
      const game = await triviaService.startGame({
        gameMode: mode,
        totalQuestions: options.questions || 10,
        difficulty: options.difficulty,
        continent: options.continent
      })
      navigate(`/trivia/play/${game.id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar partida')
    } finally {
      setStarting(false)
    }
  }

  const gameModes = [
    {
      mode: 'QUICK',
      icon: '⚡',
      title: t('trivia.quick'),
      description: `10 ${t('trivia.randomQuestions')}`,
      questions: 10
    },
    {
      mode: 'CHALLENGE',
      icon: '🏆',
      title: t('trivia.challenge'),
      description: `20 ${t('trivia.challengingQuestions')}`,
      questions: 20
    },
    {
      mode: 'INFINITE',
      icon: '♾️',
      title: t('trivia.infinite'),
      description: t('trivia.unlimitedQuestions'),
      questions: '∞',
      special: true
    },
    {
      mode: 'DAILY',
      icon: '📅',
      title: t('trivia.daily'),
      description: t('trivia.dailySpecial'),
      questions: 15
    }
  ]

  const getContinentEmoji = (continent) => {
    const emojis = {
      'Europa': '🇪🇺',
      'América': '🌎',
      'Asia': '🌏',
      'África': '🌍',
      'Oceanía': '🏝️'
    }
    return emojis[continent] || '🌐'
  }

  return (
    <div className="theme-space min-h-screen py-8 relative overflow-hidden">
      {/* Efectos de fondo futurista */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-future-neon rounded-full opacity-40 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <div className="text-6xl mb-4 animate-pulse-neon">⚡</div>
          <h1 className="text-4xl md:text-6xl font-display text-future-neon neon-text mb-4">
            {t('trivia.title').toUpperCase()}
          </h1>
              <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-space-neon to-transparent mb-4"></div>
              <p className="text-space-green font-retro text-sm uppercase tracking-wider opacity-80">
                {t('trivia.spaceMode')}
              </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna principal - Modos de juego */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-display text-space-neon neon-text mb-6">
              {t('trivia.chooseMode').toUpperCase()}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {gameModes.map(mode => (
                <button
                  key={mode.mode}
                  onClick={() => startGame(mode.mode, { questions: mode.questions })}
                  disabled={starting}
                  className="card border-space-neon hover:border-space-purple group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="text-center p-6">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {mode.icon}
                    </div>
                    <h3 className="text-xl font-display text-space-neon neon-text mb-2 uppercase">
                      {mode.title}
                    </h3>
                    <p className="text-space-green font-retro text-xs mb-4 opacity-70">
                      {mode.description}
                    </p>
                    <div className="flex items-center justify-between text-space-green font-retro text-xs">
                      <span>{mode.questions} {t('trivia.questions')}</span>
                      <span className="text-space-neon group-hover:text-space-purple">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Filtros por continente */}
            <div className="card border-space-purple">
              <div className="p-6">
                <h3 className="text-lg font-display text-space-neon neon-text mb-4 uppercase">
                  🌎 {t('trivia.playByContinent').toUpperCase()}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['Europa', 'América', 'Asia', 'África', 'Oceanía'].map(continent => (
                    <button
                      key={continent}
                      onClick={() => startGame('CHALLENGE', { questions: 15, continent })}
                      disabled={starting}
                      className="btn btn-outline text-space-neon border-space-neon px-4 py-2 text-xs disabled:opacity-50"
                    >
                      {getContinentEmoji(continent)} {continent}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Links adicionales */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/trivia/leaderboard"
                className="card border-space-neon hover:border-space-purple group"
              >
                <div className="p-6 text-center">
                  <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">🏆</span>
                  <h3 className="text-lg font-display text-space-neon neon-text mb-2 uppercase">
                    {t('trivia.ranking').toUpperCase()}
                  </h3>
                  <p className="text-space-green font-retro text-xs opacity-70">
                    {t('trivia.competeWithOthers')}
                  </p>
                </div>
              </Link>

              <Link
                to="/travel"
                className="card border-space-neon hover:border-space-purple group"
              >
                <div className="p-6 text-center">
                  <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">🗺️</span>
                  <h3 className="text-lg font-display text-space-neon neon-text mb-2 uppercase">
                    {t('trivia.myMap').toUpperCase()}
                  </h3>
                  <p className="text-space-green font-retro text-xs opacity-70">
                    {t('trivia.registerTrips')}
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Columna lateral - Stats */}
          <div className="space-y-6">
            {loading ? (
              <div className="card border-space-neon text-center py-12">
                <div className="text-5xl mb-4 animate-spin">⚡</div>
                <p className="text-space-green font-retro text-xs uppercase">{t('trivia.loading').toUpperCase()}</p>
              </div>
            ) : isAuthenticated && stats ? (
              <TriviaStats stats={stats} />
            ) : (
              <div className="card border-space-neon text-center p-6">
                <span className="text-5xl mb-4 block">🎮</span>
                <h3 className="text-xl font-display text-space-neon neon-text mb-2 uppercase">
                  {t('trivia.join').toUpperCase()}
                </h3>
                <p className="text-space-green font-retro text-xs mb-4 opacity-70">
                  {t('trivia.loginToSaveProgress')}
                </p>
                <Link
                  to="/login"
                  className="btn btn-primary text-space-dark border-space-neon"
                >
                  <span className="flex items-center space-x-2">
                    <span>👽</span>
                    <span>{t('trivia.login')}</span>
                  </span>
                </Link>
              </div>
            )}

            {/* Tips */}
            <div className="card border-space-purple">
              <div className="p-6">
                <h3 className="text-lg font-display text-space-neon neon-text mb-4 uppercase">
                  💡 {t('trivia.tips.title').toUpperCase()}
                </h3>
                <ul className="space-y-3 text-space-green font-retro text-xs">
                  <li className="flex items-start gap-2">
                    <span>⚡</span>
                    <span>{t('trivia.tips.speedBonus')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🔥</span>
                    <span>{t('trivia.tips.keepStreak')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>📅</span>
                    <span>{t('trivia.tips.playDaily')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🏆</span>
                    <span>{t('trivia.tips.perfectGames')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TriviaHomePage

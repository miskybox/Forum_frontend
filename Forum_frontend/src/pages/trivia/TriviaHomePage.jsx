import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import TriviaStats from '../../components/trivia/TriviaStats'
import triviaService from '../../services/triviaService'
import toast from 'react-hot-toast'

// Generar partículas decorativas una sola vez
const PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 3 + Math.random() * 2,
}))

/**
 * TriviaHomePage con tema Adventure
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
      title: t('trivia.quickMode'),
      description: `10 ${t('trivia.randomQuestions')}`,
      questions: 10
    },
    {
      mode: 'CHALLENGE',
      icon: '🏆',
      title: t('trivia.challengeMode'),
      description: `20 ${t('trivia.challengingQuestions')}`,
      questions: 20
    },
    {
      mode: 'INFINITE',
      icon: '♾️',
      title: t('trivia.infinite.infiniteMode'),
      description: t('trivia.unlimitedQuestions'),
      questions: '∞',
      special: true
    },
    {
      mode: 'DAILY',
      icon: '📅',
      title: t('trivia.dailyMode'),
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
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Efectos de fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute w-2 h-2 bg-primary-500 rounded-full opacity-30 animate-float"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🧭</div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 dark:text-primary-100 mb-4 tracking-normal uppercase">
            {t('trivia.title')}
          </h1>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-primary-600 dark:via-primary-400 to-transparent mb-4"></div>
          <p className="text-primary-800 dark:text-primary-200 text-lg font-semibold tracking-normal">
            {t('trivia.chooseMode')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna principal - Modos de juego */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-100 mb-6 tracking-normal uppercase">
              🎮 {t('trivia.chooseMode')}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {gameModes.map(mode => (
                <button
                  key={mode.mode}
                  onClick={() => startGame(mode.mode, { questions: mode.questions })}
                  disabled={starting}
                  className="card hover:border-primary-500 group disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  <div className="text-center p-4">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {mode.icon}
                    </div>
                    <h3 className="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2 tracking-normal uppercase">
                      {mode.title}
                    </h3>
                    <p className="text-primary-800 dark:text-primary-200 text-sm mb-4">
                      {mode.description}
                    </p>
                    <div className="flex items-center justify-between text-primary-800 dark:text-primary-200 text-sm font-semibold">
                      <span>{mode.questions} {t('trivia.questions')}</span>
                      <span className="text-primary-700 dark:text-primary-300 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Filtros por continente */}
            <div className="card">
              <div className="p-4">
                <h3 className="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4 tracking-normal uppercase">
                  🌎 {t('trivia.playByContinent')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['Europa', 'América', 'Asia', 'África', 'Oceanía'].map(continent => (
                    <button
                      key={continent}
                      onClick={() => startGame('CHALLENGE', { questions: 15, continent })}
                      disabled={starting}
                      className="btn btn-outline px-4 py-2 text-sm disabled:opacity-50"
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
                className="card hover:border-primary-500 group"
              >
                <div className="p-4 text-center">
                  <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">🏆</span>
                  <h3 className="text-lg font-bold text-primary-900 dark:text-primary-100 mb-2 tracking-normal uppercase">
                    {t('trivia.ranking')}
                  </h3>
                  <p className="text-primary-800 dark:text-primary-200 text-sm">
                    {t('trivia.competeWithOthers')}
                  </p>
                </div>
              </Link>

              <Link
                to="/travel"
                className="card hover:border-secondary-500 group"
              >
                <div className="p-4 text-center">
                  <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">🗺️</span>
                  <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200 mb-2 tracking-normal uppercase">
                    {t('trivia.myMap')}
                  </h3>
                  <p className="text-primary-800 dark:text-primary-200 text-sm">
                    {t('trivia.registerTrips')}
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Columna lateral - Stats */}
          <div className="space-y-6">
            {loading && (
              <div className="card text-center py-12">
                <div className="text-5xl mb-4 animate-spin">🧭</div>
                <p className="text-primary-800 dark:text-primary-200 font-semibold">{t('trivia.loading')}</p>
              </div>
            )}
            {!loading && isAuthenticated && stats && (
              <TriviaStats stats={stats} />
            )}
            {!loading && (!isAuthenticated || !stats) && (
              <div className="card text-center p-6">
                <span className="text-5xl mb-4 block">🎮</span>
                <h3 className="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2 tracking-normal uppercase">
                  {t('trivia.join')}
                </h3>
                <p className="text-primary-800 dark:text-primary-200 text-sm mb-4">
                  {t('trivia.loginToSaveProgress')}
                </p>
                <Link
                  to="/login"
                  className="btn btn-primary"
                >
                  <span className="flex items-center space-x-2">
                    <span>🚀</span>
                    <span>{t('auth.loginButton')}</span>
                  </span>
                </Link>
              </div>
            )}

            {/* Tips */}
            <div className="card border-secondary-600">
              <div className="p-4">
                <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200 mb-4 tracking-normal uppercase">
                  💡 {t('trivia.tips.title')}
                </h3>
                <ul className="space-y-3 text-primary-800 dark:text-primary-200 text-sm">
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

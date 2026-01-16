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
 * TriviaHomePage - Paleta única #A0937D #E7D4B5 #F6E6CB #B6C7AA
 */
const TriviaHomePage = () => {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [activeGame, setActiveGame] = useState(null)
  const [showActiveGameModal, setShowActiveGameModal] = useState(false)
  const [pendingGameConfig, setPendingGameConfig] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const loadData = async () => {
    try {
      const [statsData, activeGameData] = await Promise.all([
        triviaService.getMyScore(),
        triviaService.getActiveGame()
      ])
      setStats(statsData)
      setActiveGame(activeGameData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const startGame = async (mode, options = {}) => {
    if (!isAuthenticated) {
      toast.error('🔐 Inicia sesión para jugar', {
        style: {
          background: '#1a1a2e',
          color: '#ff6b6b',
          border: '2px solid #ff6b6b'
        }
      })
      navigate('/login?redirect=/trivia')
      return
    }

    if (mode === 'INFINITE') {
      navigate('/trivia/infinite')
      return
    }

    // Verificar si hay partida activa
    if (activeGame) {
      setPendingGameConfig({ mode, options })
      setShowActiveGameModal(true)
      return
    }

    await createNewGame(mode, options)
  }

  const createNewGame = async (mode, options) => {
    setStarting(true)
    try {
      console.log('🎮 Iniciando partida:', { mode, options })
      const game = await triviaService.startGame({
        gameMode: mode,
        totalQuestions: options.questions || 10,
        difficulty: options.difficulty,
        continent: options.continent
      })
      console.log('✅ Partida creada:', game.id)
      navigate(`/trivia/play/${game.id}`)
    } catch (error) {
      console.error('❌ Error al iniciar partida:', error)

      let errorMessage = 'Error al iniciar partida'

      if (error.response) {
        const status = error.response.status

        if (status === 401) {
          errorMessage = '🔐 Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
          setTimeout(() => navigate('/login?redirect=/trivia'), 2000)
        } else if (status === 403) {
          errorMessage = '🚫 No tienes permisos para iniciar partidas.'
        } else if (status === 400) {
          errorMessage = error.response.data?.message || 'Configuración de partida inválida.'
        } else if (status === 500) {
          errorMessage = '⚠️ Error del servidor. Por favor, intenta más tarde.'
        } else {
          errorMessage = error.response.data?.message || errorMessage
        }
      } else if (error.request) {
        errorMessage = '🔌 No se pudo conectar con el servidor. Verifica tu conexión.'
      }

      toast.error(errorMessage, {
        duration: 5000,
        style: {
          background: '#1a1a2e',
          color: '#ff6b6b',
          border: '2px solid #ff6b6b'
        }
      })
    } finally {
      setStarting(false)
    }
  }

  const handleContinueActiveGame = () => {
    setShowActiveGameModal(false)
    navigate(`/trivia/play/${activeGame.id}`)
  }

  const handleAbandonAndStartNew = async () => {
    setShowActiveGameModal(false)
    setStarting(true)
    try {
      await triviaService.abandonGame(activeGame.id)
      setActiveGame(null)
      if (pendingGameConfig) {
        await createNewGame(pendingGameConfig.mode, pendingGameConfig.options)
      }
    } catch (error) {
      console.error('Error abandonando partida:', error)
      toast.error('Error al abandonar la partida', {
        style: {
          background: '#1a1a2e',
          color: '#ff6b6b',
          border: '2px solid #ff6b6b'
        }
      })
    } finally {
      setStarting(false)
      setPendingGameConfig(null)
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
            className="absolute w-2 h-2 bg-accent rounded-full opacity-30 animate-float"
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
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 tracking-normal uppercase">
            {t('trivia.title')}
          </h1>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-accent to-transparent mb-4"></div>
          <p className="text-text text-lg font-semibold tracking-normal">
            {t('trivia.chooseMode')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna principal - Modos de juego */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-text mb-6 tracking-normal uppercase">
              🎮 {t('trivia.chooseMode')}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {gameModes.map(mode => (
                <button
                  key={mode.mode}
                  onClick={() => startGame(mode.mode, { questions: mode.questions })}
                  disabled={starting}
                  className="card hover:border-secondary group disabled:opacity-50 disabled:cursor-not-allowed text-left"
                >
                  <div className="text-center p-4">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                      {mode.icon}
                    </div>
                    <h3 className="text-xl font-bold text-text mb-2 tracking-normal uppercase">
                      {mode.title}
                    </h3>
                    <p className="text-text-light text-sm mb-4">
                      {mode.description}
                    </p>
                    <div className="flex items-center justify-between text-text text-sm font-semibold">
                      <span>{mode.questions} {t('trivia.questions')}</span>
                      <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Filtros por continente */}
            <div className="card">
              <div className="p-4">
                <h3 className="text-lg font-bold text-text mb-4 tracking-normal uppercase">
                  🌎 {t('trivia.playByContinent')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: 'europe', apiValue: 'Europa' },
                    { key: 'america', apiValue: 'América' },
                    { key: 'asia', apiValue: 'Asia' },
                    { key: 'africa', apiValue: 'África' },
                    { key: 'oceania', apiValue: 'Oceanía' }
                  ].map(continent => (
                    <button
                      key={continent.key}
                      onClick={() => startGame('CHALLENGE', { questions: 15, continent: continent.apiValue })}
                      disabled={starting}
                      className="btn btn-outline px-4 py-2 text-sm disabled:opacity-50"
                    >
                      {getContinentEmoji(continent.apiValue)} {t(`continentsNames.${continent.key}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Links adicionales */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/trivia/leaderboard"
                className="card hover:border-secondary group"
              >
                <div className="p-4 text-center">
                  <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">🏆</span>
                  <h3 className="text-lg font-bold text-text mb-2 tracking-normal uppercase">
                    {t('trivia.ranking')}
                  </h3>
                  <p className="text-text-light text-sm">
                    {t('trivia.competeWithOthers')}
                  </p>
                </div>
              </Link>

              <Link
                to="/travel"
                className="card hover:border-accent group"
              >
                <div className="p-4 text-center">
                  <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">🗺️</span>
                  <h3 className="text-lg font-bold text-accent mb-2 tracking-normal uppercase">
                    {t('trivia.myMap')}
                  </h3>
                  <p className="text-text-light text-sm">
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
                <p className="text-text font-semibold">{t('trivia.loading')}</p>
              </div>
            )}
            {!loading && isAuthenticated && stats && (
              <TriviaStats stats={stats} />
            )}
            {!loading && (!isAuthenticated || !stats) && (
              <div className="card text-center p-6">
                <span className="text-5xl mb-4 block">🎮</span>
                <h3 className="text-xl font-bold text-text mb-2 tracking-normal uppercase">
                  {t('trivia.join')}
                </h3>
                <p className="text-text-light text-sm mb-4">
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
            <div className="card border-accent">
              <div className="p-4">
                <h3 className="text-lg font-bold text-accent mb-4 tracking-normal uppercase">
                  💡 {t('trivia.tips.title')}
                </h3>
                <ul className="space-y-3 text-text-light text-sm">
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

      {/* Modal de partida activa */}
      {showActiveGameModal && activeGame && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full p-6 animate-fadeIn">
            <div className="text-center">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-xl font-bold text-text mb-2 tracking-normal uppercase">
                {t('trivia.activeGame.title')}
              </h3>
              <p className="text-text-light mb-4">
                {t('trivia.activeGame.message')}
              </p>

              {/* Info de la partida activa */}
              <div className="bg-primary/20 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-light">{t('trivia.activeGame.progress')}</span>
                  <span className="text-accent font-bold">
                    {activeGame.currentQuestionIndex}/{activeGame.totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-text-light">{t('trivia.score')}</span>
                  <span className="text-accent font-bold">{activeGame.score} pts</span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleContinueActiveGame}
                  className="btn btn-primary w-full"
                >
                  ▶️ {t('trivia.activeGame.continueGame')}
                </button>
                <button
                  onClick={handleAbandonAndStartNew}
                  disabled={starting}
                  className="btn btn-outline w-full text-sm"
                >
                  {starting ? '...' : `🗑️ ${t('trivia.activeGame.abandonAndNew')}`}
                </button>
                <button
                  onClick={() => setShowActiveGameModal(false)}
                  className="text-text-light text-sm hover:text-text transition-colors"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TriviaHomePage

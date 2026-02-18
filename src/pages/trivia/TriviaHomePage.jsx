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
 * TriviaHomePage - Nueva paleta del logo
 * Teal (#4c7e75), Terracota (#A67C52), Dark Green (#37553b)
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
        Promise.resolve(triviaService.getActiveGame())
      ])
      setStats(statsData)
      if (activeGameData?.id) {
        if (import.meta.env.DEV) console.log('Partida activa encontrada:', activeGameData)
        setActiveGame(activeGameData)
        // Mostrar modal automáticamente si hay partida activa
        setShowActiveGameModal(true)
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const startGame = async (mode, options = {}) => {
    if (!isAuthenticated) {
      toast.error('Inicia sesion para jugar', {
        style: {
          background: '#ece4d8',
          color: '#37553b',
          border: '2px solid #a56732'
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
      if (import.meta.env.DEV) console.log('Iniciando partida:', { mode, options })
      const game = await triviaService.startGame({
        gameMode: mode,
        totalQuestions: options.questions || 10,
        difficulty: options.difficulty,
        continent: options.continent
      })
      if (import.meta.env.DEV) console.log('Partida creada:', game.id)
      navigate(`/trivia/play/${game.id}`)
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error al iniciar partida:', error)

      // Si el error es porque ya hay partida activa, recargar datos y mostrar modal
      if (error.response?.status === 400 &&
          error.response?.data?.message?.includes('partida en progreso')) {
        toast.error('Ya tienes una partida en curso', {
          style: { background: '#ece4d8', color: '#37553b', border: '2px solid #4c7e75' }
        })
        // Recargar para obtener la partida activa
        await loadData()
        return
      }

      let errorMessage = 'No se pudo iniciar la partida'

      if (error.response) {
        const status = error.response.status

        if (status === 401) {
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
          setTimeout(() => navigate('/login?redirect=/trivia'), 2000)
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para iniciar partidas.'
        } else if (status === 400) {
          const backendMsg = error.response.data?.message
          if (backendMsg?.includes('diaria')) {
            errorMessage = '¡Ya jugaste la trivia diaria! Vuelve mañana.'
          } else {
            errorMessage = 'Configuración de partida inválida.'
          }
        } else if (status === 500) {
          errorMessage = 'Error del servidor. Por favor, intenta más tarde.'
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.'
      }

      toast.error(errorMessage, {
        duration: 5000,
        style: { background: '#ece4d8', color: '#37553b', border: '2px solid #b91c1c' }
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
          background: '#ece4d8',
          color: '#b91c1c',
          border: '2px solid #b91c1c'
        }
      })
    } finally {
      setStarting(false)
      setPendingGameConfig(null)
    }
  }

  const getTextColorClass = (modeColor) => {
    if (modeColor === 'bg-midnight') {
      return 'text-golden'
    }
    return 'text-midnight'
  }

  const gameModes = [
    {
      mode: 'QUICK',
      title: t('trivia.quickMode'),
      description: `10 ${t('trivia.randomQuestions')}`,
      questions: 10,
      color: 'bg-golden'
    },
    {
      mode: 'CHALLENGE',
      title: t('trivia.challengeMode'),
      description: `20 ${t('trivia.challengingQuestions')}`,
      questions: 20,
      color: 'bg-midnight'
    },
    {
      mode: 'INFINITE',
      title: t('trivia.infinite.infiniteMode'),
      description: t('trivia.unlimitedQuestions'),
      questions: '∞',
      special: true,
      color: 'bg-aqua'
    },
    {
      mode: 'DAILY',
      title: t('trivia.dailyMode'),
      description: t('trivia.dailySpecial'),
      questions: 15,
      color: 'bg-secondary'
    }
  ]

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Efectos de fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute w-2 h-2 bg-secondary rounded-full opacity-30 animate-float"
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
          <h1 className="text-4xl md:text-5xl font-bold text-midnight mb-4 tracking-normal uppercase">
            {t('trivia.title')}
          </h1>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-golden to-transparent mb-4"></div>
          <p className="text-text text-lg font-semibold tracking-normal">
            {t('trivia.chooseMode')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna principal - Modos de juego */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-midnight mb-6 tracking-normal uppercase">
              {t('trivia.chooseMode')}
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {gameModes.map(mode => (
                <button
                  key={mode.mode}
                  onClick={() => startGame(mode.mode, { questions: mode.questions })}
                  disabled={starting}
                  className={`card hover:shadow-xl hover:scale-[1.02] group disabled:opacity-50 disabled:cursor-not-allowed text-left cursor-pointer transition-all duration-200 ${mode.color} ${mode.color === 'bg-midnight' ? 'border-midnight' : ''}`}
                >
                  <div className="text-center p-4">
                    <h3 className={`text-xl font-bold mb-2 tracking-normal uppercase ${getTextColorClass(mode.color)}`}>
                        {mode.title}
                      </h3>
                    <p className={`text-sm mb-4 ${mode.color === 'bg-midnight' ? 'text-aqua' : 'text-text'}`}>
                      {mode.description}
                    </p>
                    <div className={`flex items-center justify-between text-sm font-semibold ${mode.color === 'bg-midnight' ? 'text-white' : 'text-midnight'}`}>
                      <span>{mode.questions} {t('trivia.questions')}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Filtros por continente */}
            <div className="card bg-aqua">
              <div className="p-4">
                <h3 className="text-lg font-bold text-midnight mb-4 tracking-normal uppercase">
                  {t('trivia.playByContinent')}
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
                      className="bg-midnight text-white px-4 py-2 text-sm disabled:opacity-50 rounded-lg font-semibold hover:bg-secondary transition-colors"
                    >
                      {t(`continentsNames.${continent.key}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Links adicionales */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                to="/trivia/leaderboard"
                className="card hover:border-golden group bg-golden"
              >
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-midnight mb-2 tracking-normal uppercase">
                    {t('trivia.ranking')}
                  </h3>
                  <p className="text-midnight/70 text-sm">
                    {t('trivia.competeWithOthers')}
                  </p>
                </div>
              </Link>

              <Link
                to="/travel"
                className="card hover:border-secondary group bg-secondary"
              >
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-white mb-2 tracking-normal uppercase">
                    {t('trivia.myMap')}
                  </h3>
                  <p className="text-white/80 text-sm">
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
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-golden border-t-transparent mb-4"></div>
                <p className="text-text font-semibold">{t('trivia.loading')}</p>
              </div>
            )}
            {!loading && isAuthenticated && stats && (
              <TriviaStats stats={stats} />
            )}
            {!loading && (!isAuthenticated || !stats) && (
              <div className="card text-center p-6 bg-midnight">
                <h3 className="text-xl font-bold text-golden mb-2 tracking-normal uppercase">
                  {t('trivia.join')}
                </h3>
                <p className="text-aqua text-sm mb-4">
                  {t('trivia.loginToSaveProgress')}
                </p>
                <Link
                  to="/login"
                  className="btn bg-golden text-midnight font-bold hover:bg-golden-dark"
                >
                  {t('auth.loginButton')}
                </Link>
              </div>
            )}

            {/* Tips */}
            <div className="card border-golden bg-golden/10">
              <div className="p-4">
                <h3 className="text-lg font-bold text-midnight mb-4 tracking-normal uppercase">
                  {t('trivia.tips.title')}
                </h3>
                <ul className="space-y-3 text-text text-sm">
                  <li>{t('trivia.tips.speedBonus')}</li>
                  <li>{t('trivia.tips.keepStreak')}</li>
                  <li>{t('trivia.tips.playDaily')}</li>
                  <li>{t('trivia.tips.perfectGames')}</li>
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
              <h3 className="text-xl font-bold text-midnight mb-2 tracking-normal uppercase">
                {t('trivia.activeGame.title')}
              </h3>
              <p className="text-text-light mb-4">
                {t('trivia.activeGame.message')}
              </p>

              {/* Info de la partida activa */}
              <div className="bg-aqua rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-midnight">{t('trivia.activeGame.progress')}</span>
                  <span className="text-midnight font-bold">
                    {activeGame.currentQuestionIndex}/{activeGame.totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-midnight">{t('trivia.score')}</span>
                  <span className="text-midnight font-bold">{activeGame.score} pts</span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleContinueActiveGame}
                  className="btn bg-golden text-midnight font-bold hover:bg-golden-dark w-full"
                >
                  {t('trivia.activeGame.continueGame')}
                </button>
                <button
                  onClick={handleAbandonAndStartNew}
                  disabled={starting}
                  className="btn btn-outline w-full text-sm"
                >
                  {starting ? '...' : t('trivia.activeGame.abandonAndNew')}
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

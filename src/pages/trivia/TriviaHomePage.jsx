import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import TriviaStats from '../../components/trivia/TriviaStats'
import triviaService from '../../services/triviaService'
import toast from 'react-hot-toast'
import Seo from '../../components/common/SEO'
import { MdArrowForward, MdQuiz } from 'react-icons/md'
import Modal from '../../components/ui/Modal'


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
  const [showTimerModal, setShowTimerModal] = useState(false)
  const [pendingChallengeConfig, setPendingChallengeConfig] = useState(null)

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
      toast.error('Inicia sesion para jugar')
      navigate('/login?redirect=/trivia')
      return
    }

    if (mode === 'INFINITE') {
      navigate('/trivia/infinite')
      return
    }

    // CHALLENGE: pedir preferencia de cronómetro antes de crear la partida
    if (mode === 'CHALLENGE') {
      setPendingChallengeConfig({ mode, options })
      setShowTimerModal(true)
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

  const createNewGame = async (mode, options, withTimer = true) => {
    setStarting(true)
    try {
      const gamePayload = { gameMode: mode }
      if (mode !== 'DAILY') {
        gamePayload.totalQuestions = options.questions || 10
      }
      if (options.difficulty) {
        gamePayload.difficulty = options.difficulty
      }
      if (options.continent) {
        gamePayload.continent = options.continent
      }

      if (import.meta.env.DEV) console.log('Iniciando partida:', { mode, options, withTimer })
      const game = await triviaService.startGame(gamePayload)
      if (import.meta.env.DEV) console.log('Partida creada:', game.id)
      navigate(`/trivia/play/${game.id}`, { state: { withTimer } })
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error al iniciar partida:', error)

      // Si el error es porque ya hay partida activa, recargar datos y mostrar modal
      if (error.response?.status === 400 &&
          error.response?.data?.message?.includes('partida en progreso')) {
        toast.error('Ya tienes una partida en curso')
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
          if (/diari|daily/i.test(backendMsg || '')) {
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
        await createNewGame(pendingGameConfig.mode, pendingGameConfig.options, pendingGameConfig.withTimer)
      }
    } catch (error) {
      console.error('Error abandonando partida:', error)
      toast.error('Error al abandonar la partida')
    } finally {
      setStarting(false)
      setPendingGameConfig(null)
    }
  }

  const handleTimerChoice = async (withTimer) => {
    setShowTimerModal(false)
    const config = pendingChallengeConfig
    setPendingChallengeConfig(null)
    if (!config) return

    // Si hay partida activa, mostrar modal de partida activa en su lugar
    if (activeGame) {
      setPendingGameConfig({ ...config, withTimer })
      setShowActiveGameModal(true)
      return
    }
    await createNewGame(config.mode, config.options, withTimer)
  }

  const gameModes = [
    {
      mode: 'QUICK',
      title: t('trivia.quickMode'),
      description: `10 ${t('trivia.randomQuestions')}`,
      questions: 10,
      tone: { card: 'bg-primary-fixed', title: 'text-on-primary-fixed', text: 'text-on-primary-fixed-variant' }
    },
    {
      mode: 'CHALLENGE',
      title: t('trivia.challengeMode'),
      description: `20 ${t('trivia.challengingQuestions')}`,
      questions: 20,
      tone: { card: 'bg-inverse-surface', title: 'text-inverse-primary', text: 'text-inverse-on-surface' }
    },
    {
      mode: 'INFINITE',
      title: t('trivia.infinite.infiniteMode'),
      description: t('trivia.unlimitedQuestions'),
      questions: '∞',
      special: true,
      tone: { card: 'bg-secondary-container', title: 'text-on-secondary-container', text: 'text-on-secondary-container' }
    },
    {
      mode: 'DAILY',
      title: t('trivia.dailyMode'),
      description: t('trivia.dailySpecial'),
      questions: 15,
      tone: { card: 'bg-secondary', title: 'text-on-secondary', text: 'text-on-secondary-fixed-variant' }
    }
  ]

  return (
    <div className="flex flex-col w-full">
      <Seo
        title="Trivia de geografía y viajes"
        description="Pon a prueba tus conocimientos de geografía y viajes con la trivia de ForumViajeros. Compite con otros viajeros en el ranking mundial."
        url="/trivia"
      />
      <header className="relative overflow-hidden bg-gradient-to-b from-surface-container-high/80 via-surface-container-low to-background">
        <div className="relative max-w-7xl mx-auto px-gutter-sm lg:px-gutter-lg pt-space-xl pb-space-lg">
          <p className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-md mb-space-sm">
            <MdQuiz className="text-title-md" aria-hidden="true" />
            {t('nav.trivia')}
          </p>
          <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface">{t('trivia.title')}</h1>
          <p className="mt-space-xs text-body-lg text-on-surface">{t('trivia.chooseMode')}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-gutter-sm lg:px-gutter-lg py-margin">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal - Modos de juego */}
          <div className="lg:col-span-2 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameModes.map(mode => (
                <button
                  key={mode.mode}
                  type="button"
                  onClick={() => startGame(mode.mode, { questions: mode.questions })}
                  disabled={starting}
                  className={`rounded-lg p-space-lg text-left shadow-level-1 hover:shadow-level-2 transition-shadow group disabled:opacity-50 disabled:cursor-not-allowed ${mode.tone.card}`}
                >
                  <h3 className={`font-headline text-headline-sm ${mode.tone.title}`}>{mode.title}</h3>
                  <p className={`mt-space-xs text-body-sm ${mode.tone.text}`}>{mode.description}</p>
                  <div className={`mt-space-md flex items-center justify-between text-label-lg ${mode.tone.title}`}>
                    <span>{mode.questions} {t('trivia.questions')}</span>
                    <MdArrowForward className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </div>
                </button>
              ))}
            </div>

            {/* Filtros por continente */}
            <div className="card bg-secondary-container">
              <div className="p-4">
                <h3 className="text-lg font-bold text-on-secondary-container mb-4 ">
                  {t('trivia.playByContinent')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    { key: 'europe', apiValue: 'Europa' },
                    { key: 'america', apiValue: 'America' },
                    { key: 'asia', apiValue: 'Asia' },
                    { key: 'africa', apiValue: 'Africa' },
                    { key: 'oceania', apiValue: 'Oceania' }
                  ].map(continent => (
                    <button
                      key={continent.key}
                      onClick={() => startGame('QUICK', { questions: 15, continent: continent.apiValue })}
                      disabled={starting}
                      className="px-space-md py-2 rounded-full bg-surface-container-highest text-on-surface text-label-lg shadow-level-1 hover:bg-secondary hover:text-on-secondary disabled:opacity-50 transition-colors"
                    >
                      {t(`continentsNames.${continent.key}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Links adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/trivia/leaderboard"
                className="block rounded-lg p-space-lg bg-primary-fixed text-on-primary-fixed hover:text-on-primary-fixed shadow-level-1 hover:shadow-level-2 transition-shadow"
              >
                <div>
                  <h3 className="font-headline text-headline-sm">
                    {t('trivia.ranking')}
                  </h3>
                  <p className="mt-space-xs text-body-sm text-on-primary-fixed-variant">
                    {t('trivia.competeWithOthers')}
                  </p>
                </div>
              </Link>

              <Link
                to="/travel"
                className="block rounded-lg p-space-lg bg-secondary-container text-on-secondary-container hover:text-on-secondary-container shadow-level-1 hover:shadow-level-2 transition-shadow"
              >
                <div>
                  <h3 className="font-headline text-headline-sm">
                    {t('trivia.myMap')}
                  </h3>
                  <p className="mt-space-xs text-body-sm">
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
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-fixed-dim border-t-transparent mb-4"></div>
                <p className="text-on-surface font-semibold">{t('trivia.loading')}</p>
              </div>
            )}
            {!loading && isAuthenticated && stats && (
              <TriviaStats stats={stats} />
            )}
            {!loading && (!isAuthenticated || !stats) && (
              <div className="card text-center p-6 bg-inverse-surface">
                <h3 className="font-headline text-headline-sm text-inverse-primary mb-2">
                  {t('trivia.join')}
                </h3>
                <p className="text-inverse-on-surface text-sm mb-4">
                  {t('trivia.loginToSaveProgress')}
                </p>
                <Link
                  to="/login"
                  className="btn btn-primary font-bold"
                >
                  {t('auth.loginButton')}
                </Link>
              </div>
            )}

            {/* Tips */}
            <div className="card border-primary-fixed-dim bg-primary-fixed/10">
              <div className="p-4">
                <h3 className="text-lg font-bold text-on-surface mb-4 ">
                  {t('trivia.tips.title')}
                </h3>
                <ul className="space-y-3 text-on-surface text-sm">
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
        <Modal title={t('trivia.activeGame.title')} onClose={() => setShowActiveGameModal(false)}>
          <p className="mt-space-xs text-center text-body-md text-on-surface-variant">
            {t('trivia.activeGame.message')}
          </p>

          <dl className="bg-secondary-container rounded-base p-space-md my-space-lg space-y-space-xs text-body-sm text-on-surface">
            <div className="flex justify-between items-center">
              <dt>{t('trivia.activeGame.progress')}</dt>
              <dd className="font-bold">{activeGame.currentQuestionIndex}/{activeGame.totalQuestions}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt>{t('trivia.score')}</dt>
              <dd className="font-bold">{activeGame.score} pts</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-space-sm">
            <button type="button" onClick={handleContinueActiveGame} className="btn btn-primary w-full">
              {t('trivia.activeGame.continueGame')}
            </button>
            <button type="button" onClick={handleAbandonAndStartNew} disabled={starting} className="btn btn-outline w-full">
              {starting ? '...' : t('trivia.activeGame.abandonAndNew')}
            </button>
            <button
              type="button"
              onClick={() => setShowActiveGameModal(false)}
              className="min-h-10 rounded-full text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </Modal>
      )}

      {/* Timer choice (CHALLENGE only) */}
      {showTimerModal && (
        <Modal
          title={t('trivia.timerChoice.title')}
          size="sm"
          onClose={() => { setShowTimerModal(false); setPendingChallengeConfig(null) }}
        >
          <p className="mt-space-xs mb-space-lg text-center text-body-sm text-on-surface-variant">
            {t('trivia.timerChoice.description')}
          </p>
          <div className="flex flex-col gap-space-sm">
            <button type="button" onClick={() => handleTimerChoice(true)} disabled={starting} className="btn btn-primary w-full">
              ⏱️ {t('trivia.timerChoice.withTimer')}
            </button>
            <button type="button" onClick={() => handleTimerChoice(false)} disabled={starting} className="btn btn-secondary w-full">
              🌙 {t('trivia.timerChoice.withoutTimer')}
            </button>
            <button
              type="button"
              onClick={() => { setShowTimerModal(false); setPendingChallengeConfig(null) }}
              className="min-h-10 rounded-full text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
            >
              {t('common.cancel')}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default TriviaHomePage

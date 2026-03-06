import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import TriviaQuestion from '../../components/trivia/TriviaQuestion'
import TriviaResult from '../../components/trivia/TriviaResult'
import TriviaGameSummary from '../../components/trivia/TriviaGameSummary'
import triviaService from '../../services/triviaService'
import { useLanguage } from '../../contexts/LanguageContext'
import toast from 'react-hot-toast'

/**
 * Página de juego de trivia con tema Adventure
 */
const TriviaPlayPage = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const withTimer = location.state?.withTimer !== false
  
  const [game, setGame] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [result, setResult] = useState(null)
  const [gameFinished, setGameFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false)

  useEffect(() => {
    loadGame()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId])

  const loadGame = async () => {
    try {
      const data = await triviaService.getGameStatus(gameId)
      setGame(data)
      
      if (data.status === 'COMPLETED') {
        setGameFinished(true)
      } else if (data.firstQuestion) {
        setCurrentQuestion(data.firstQuestion)
      } else {
        // Obtener siguiente pregunta
        const question = await triviaService.getNextQuestion(gameId)
        setCurrentQuestion(question)
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error cargando partida:', error)
      toast.error('Error al cargar la partida')
      navigate('/trivia')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = async (answerData) => {
    try {
      if (import.meta.env.DEV) console.log('🎮 Enviando respuesta:', answerData)
      const response = await triviaService.answerQuestion({
        gameId: Number.parseInt(gameId),
        ...answerData
      })

      if (import.meta.env.DEV) console.log('✅ Respuesta del servidor:', response)

      setResult(response)

      // Actualizar estado del juego
      setGame(prev => ({
        ...prev,
        score: response.currentGameScore,
        correctAnswers: response.correctAnswersCount,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }))

      if (!response.hasNextQuestion) {
        // Finalizar partida después de mostrar el resultado
        setTimeout(async () => {
          const finalGame = await triviaService.finishGame(gameId)
          setGame(finalGame)
          setGameFinished(true)
        }, 100)
      }
    } catch (error) {
      console.error('❌ Error enviando respuesta:', error)
      console.error('📋 Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })

      let errorMessage = 'Error al enviar respuesta. Por favor, intenta de nuevo.'
      
      if (error.response) {
        const status = error.response.status
        
        if (status === 401) {
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
          setTimeout(() => navigate('/login?redirect=/trivia'), 2000)
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para esta partida.'
        } else if (status === 404) {
          errorMessage = 'La pregunta o partida no existe.'
        } else if (status === 400) {
          errorMessage = error.response.data?.message || 'Respuesta inválida.'
        } else if (status === 500) {
          errorMessage = 'Error del servidor. Por favor, intenta más tarde.'
        } else {
          errorMessage = error.response.data?.message || error.response.data?.error || errorMessage
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión.'
      }

      toast.error(errorMessage, { 
        duration: 5000,
        style: {
          background: '#1a1a2e',
          color: '#ff6b6b',
          border: '2px solid #ff6b6b'
        }
      })

      // Permitir continuar a pesar del error si hay siguiente pregunta
      if (result?.hasNextQuestion) {
        toast.info('Continuando con la siguiente pregunta...', { duration: 3000 })
        handleNext()
      }
    }
  }

  const handleNext = () => {
    if (result?.hasNextQuestion && result?.nextQuestion) {
      setCurrentQuestion(result.nextQuestion)
      setResult(null)
    } else {
      setGameFinished(true)
    }
  }

  const handlePlayAgain = async () => {
    try {
      const newGame = await triviaService.startGame({
        gameMode: game.gameMode,
        totalQuestions: game.totalQuestions,
        difficulty: game.difficulty
      })
      navigate(`/trivia/play/${newGame.id}`)
      // Reset state
      setGameFinished(false)
      setResult(null)
      setCurrentQuestion(newGame.firstQuestion)
      setGame(newGame)
    } catch (error) {
      console.error('❌ Error iniciando nueva partida:', error)
      
      let errorMessage = 'Error al iniciar nueva partida'
      
      if (error.response?.status === 401) {
        errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
        setTimeout(() => navigate('/login?redirect=/trivia'), 2000)
      } else if (error.response) {
        errorMessage = error.response.data?.message || errorMessage
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor.'
      }
      
      toast.error(errorMessage, { duration: 5000 })
    }
  }

  const handleAbandon = () => {
    setShowAbandonConfirm(true)
  }

  const handleAbandonConfirmed = async () => {
    setShowAbandonConfirm(false)
    try {
      await triviaService.abandonGame(gameId)
      navigate('/trivia')
    } catch (error) {
      console.error('Error abandonando:', error)
    }
  }

  const renderMainContent = () => {
    if (result) {
      return (
        <TriviaResult
          result={result}
          onNext={handleNext}
          isLastQuestion={!result.hasNextQuestion}
        />
      )
    }
    
    if (currentQuestion) {
      return (
        <TriviaQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          withTimer={withTimer}
        />
      )
    }
    
    return (
      <div className="text-center text-light py-12">
        <p>{t('trivia.loadingQuestion')}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-secondary border-t-transparent mx-auto" />
          <p className="text-text-light mt-4">{t('trivia.loadingQuestion')}</p>
        </div>
      </div>
    )
  }

  if (gameFinished && game) {
    return (
      <div className="min-h-screen py-12 px-4">
        <TriviaGameSummary game={game} onPlayAgain={handlePlayAgain} />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header con progreso */}
      <div className="bg-midnight py-4 border-b border-white/10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/trivia')}
              className="p-2 rounded-lg text-aqua hover:bg-aqua/20 transition-colors cursor-pointer"
              title={t('common.back')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="text-white">
              <span className="text-aqua text-sm">{t('trivia.score')}</span>
              <p className="text-2xl font-bold">{game?.score || 0}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center text-white">
              <span className="text-aqua text-sm">{t('trivia.correctAnswers')}</span>
              <p className="text-xl font-bold">{game?.correctAnswers || 0}/{game?.totalQuestions || 0}</p>
            </div>
            
            {showAbandonConfirm ? (
              <div className="flex items-center gap-2">
                <div className="bg-[#fee2e2] border border-[#b91c1c] px-3 py-1.5 rounded-lg">
                  <span
                    className="text-[#7f1d1d] text-sm font-semibold"
                    style={{ textShadow: '0 1px 0 rgba(255,255,255,0.75), 0 0 1px rgba(127,29,29,0.25)' }}
                  >
                    {t('trivia.abandonConfirm')}
                  </span>
                </div>
                <button
                  onClick={handleAbandonConfirmed}
                  className="px-3 py-1.5 bg-[#fecaca] text-[#7f1d1d] border border-[#b91c1c] rounded-lg hover:bg-[#fca5a5] transition-colors text-sm font-bold cursor-pointer"
                  style={{ textShadow: '0 1px 0 rgba(255,255,255,0.75), 0 0 1px rgba(127,29,29,0.25)' }}
                >
                  {t('common.yes')}
                </button>
                <button
                  onClick={() => setShowAbandonConfirm(false)}
                  className="px-3 py-1.5 bg-[#d1fae5] text-[#065f46] border border-[#047857] rounded-lg hover:bg-[#a7f3d0] transition-colors text-sm font-bold cursor-pointer"
                >
                  {t('common.no')}
                </button>
              </div>
            ) : (
              <button
                onClick={handleAbandon}
                className="px-4 py-2 bg-[#fee2e2] text-[#7f1d1d] border border-[#b91c1c] rounded-lg hover:bg-[#fecaca] transition-colors text-sm font-semibold cursor-pointer"
              >
                {t('trivia.abandon')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {renderMainContent()}
      </div>
    </div>
  )
}

export default TriviaPlayPage


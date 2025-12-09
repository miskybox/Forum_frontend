import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TriviaQuestion from '../../components/trivia/TriviaQuestion'
import TriviaResult from '../../components/trivia/TriviaResult'
import TriviaGameSummary from '../../components/trivia/TriviaGameSummary'
import triviaService from '../../services/triviaService'
import toast from 'react-hot-toast'

/**
 * Página de juego de trivia
 */
const TriviaPlayPage = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  
  const [game, setGame] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [result, setResult] = useState(null)
  const [gameFinished, setGameFinished] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGame()
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
      console.error('Error cargando partida:', error)
      toast.error('Error al cargar la partida')
      navigate('/trivia')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = async (answerData) => {
    try {
      console.log('Enviando respuesta:', answerData)
      const response = await triviaService.answerQuestion({
        gameId: parseInt(gameId),
        ...answerData
      })

      console.log('Respuesta del servidor:', response)

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
      console.error('Error enviando respuesta:', error)
      console.error('Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })

      // Mostrar mensaje de error específico
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          'Error al enviar respuesta. Por favor, intenta de nuevo.'

      toast.error(errorMessage, { duration: 5000 })

      // Permitir continuar a pesar del error
      // Si hay siguiente pregunta, cargarla
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
      toast.error('Error al iniciar nueva partida')
    }
  }

  const handleAbandon = async () => {
    if (!confirm('¿Seguro que quieres abandonar la partida?')) return
    
    try {
      await triviaService.abandonGame(gameId)
      navigate('/trivia')
    } catch (error) {
      console.error('Error abandonando:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent mx-auto" />
          <p className="text-purple-200 mt-4">Cargando pregunta...</p>
        </div>
      </div>
    )
  }

  if (gameFinished && game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 py-12 px-4">
        <TriviaGameSummary game={game} onPlayAgain={handlePlayAgain} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900">
      {/* Header con progreso */}
      <div className="bg-black/20 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="text-white">
            <span className="text-purple-300 text-sm">Puntuación</span>
            <p className="text-2xl font-bold">{game?.score || 0}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center text-white">
              <span className="text-purple-300 text-sm">Correctas</span>
              <p className="text-xl font-bold">{game?.correctAnswers || 0}/{game?.totalQuestions || 0}</p>
            </div>
            
            <button
              onClick={handleAbandon}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
            >
              Abandonar
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {result ? (
          // Mostrar SOLO el resultado cuando hay uno
          <TriviaResult
            result={result}
            onNext={handleNext}
            isLastQuestion={!result.hasNextQuestion}
          />
        ) : currentQuestion ? (
          // Mostrar SOLO la pregunta cuando no hay resultado
          <TriviaQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        ) : (
          <div className="text-center text-white py-12">
            <p>Cargando pregunta...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TriviaPlayPage


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../contexts/LanguageContext'
import restCountriesService from '../../services/restCountriesService'
import toast from 'react-hot-toast'

/**
 * Modo Trivia Infinita - Preguntas ilimitadas usando API RestCountries
 * Las preguntas nunca se repiten y son generadas dinámicamente
 */
const TriviaInfinitePage = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set())
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [lives, setLives] = useState(3)

  // Cargar preguntas iniciales
  useEffect(() => {
    loadQuestions()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const newQuestions = await restCountriesService.generateTriviaQuestions(
        10, 
        Array.from(usedQuestionIds)
      )

      if (newQuestions.length === 0) {
        // Si no hay preguntas pero tenemos algunas en memoria, continuar
        if (questions.length > 0) {
          toast('Continuando con preguntas disponibles', { 
            duration: 2000 
          })
          setLoading(false)
          return
        }
        toast.error('No hay preguntas disponibles. Revisa tu conexión a internet.')
        setGameOver(true)
        return
      }

      // Marcar preguntas como usadas
      const newIds = new Set(usedQuestionIds)
      newQuestions.forEach(q => newIds.add(q.id))
      setUsedQuestionIds(newIds)

      setQuestions(prev => [...prev, ...newQuestions])
      
      // Mostrar mensaje de éxito solo la primera vez
      if (questions.length === 0) {
        toast.success(`${newQuestions.length} preguntas cargadas`, { duration: 1500 })
      }
    } catch (error) {
      console.error('Error cargando preguntas:', error)
      
      // Si ya tenemos preguntas, continuar con ellas
      if (questions.length > 0) {
        toast('Modo offline - usando preguntas en memoria', {
          duration: 2000
        })
      } else {
        toast.error('Error de conexión. Usando modo offline con preguntas limitadas.', {
          duration: 3000
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Cargar más preguntas cuando quedan pocas
  useEffect(() => {
    if (questions.length - currentIndex <= 3 && !loading && !gameOver) {
      loadQuestions()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions.length, loading, gameOver])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (answer) => {
    if (answered || !currentQuestion) return
    
    setSelectedAnswer(answer)
    setAnswered(true)
    setTotalAnswered(prev => prev + 1)

    const isCorrect = answer === currentQuestion.correctAnswer

    if (isCorrect) {
      const streakBonus = Math.min(streak, 10) * 5
      const points = 100 + streakBonus
      setScore(prev => prev + points)
      setStreak(prev => prev + 1)
      setBestStreak(prev => Math.max(prev, streak + 1))
      setCorrectAnswers(prev => prev + 1)
      
      // Efecto visual de éxito
      toast.success(`+${points} ${t('trivia.infinite.pointsEarned')} ${streak + 1}`, {
        duration: 1500,
        style: { background: '#4c7e75', color: '#ffffff', border: '2px solid #2c4a33' },
        icon: '✅'
      })
    } else {
      setStreak(0)
      setLives(prev => prev - 1)

      if (lives <= 1) {
        setGameOver(true)
        toast.error(t('trivia.infinite.gameOverNoLives'), {
          duration: 3000,
          style: { background: '#a56732', color: '#ffffff', border: '2px solid #8B5A2B' },
          icon: '💀'
        })
      } else {
        toast.error(`${t('trivia.infinite.incorrectLives')} (${lives - 1})`, {
          duration: 1500,
          style: { background: '#a56732', color: '#ffffff', border: '2px solid #8B5A2B' },
          icon: '❌'
        })
      }
    }
  }

  const handleNext = () => {
    if (gameOver) return
    setCurrentIndex(prev => prev + 1)
    setAnswered(false)
    setSelectedAnswer(null)
  }

  const handleRestart = () => {
    setQuestions([])
    setCurrentIndex(0)
    setScore(0)
    setStreak(0)
    setBestStreak(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setUsedQuestionIds(new Set())
    setTotalAnswered(0)
    setCorrectAnswers(0)
    setGameOver(false)
    setLives(3)
    loadQuestions()
  }

  const OPTION_COLORS = [
    { tile: 'bg-midnight border-[#1a4d52] text-white hover:bg-[#2a5d62] hover:shadow-[0_0_16px_rgba(33,54,56,0.55)] hover:scale-[1.02]', badge: 'bg-white/25 text-white' },
    { tile: 'bg-accent border-accent-dark text-white hover:bg-accent-dark hover:shadow-[0_0_16px_rgba(165,103,50,0.55)] hover:scale-[1.02]', badge: 'bg-white/25 text-white' },
    { tile: 'bg-secondary border-secondary-dark text-white hover:bg-secondary-dark hover:shadow-[0_0_16px_rgba(76,126,117,0.55)] hover:scale-[1.02]', badge: 'bg-white/25 text-white' },
    { tile: 'bg-golden border-golden-dark text-midnight hover:bg-golden-dark hover:shadow-[0_0_16px_rgba(229,161,62,0.55)] hover:scale-[1.02]', badge: 'bg-midnight/20 text-midnight' },
  ]

  const getOptionStyle = (option, idx) => {
    if (!answered) return OPTION_COLORS[idx % 4].tile
    if (option === currentQuestion?.correctAnswer) return 'bg-[#d1fae5] border-[#047857] text-[#065F46] font-bold'
    if (option === selectedAnswer) return 'bg-[#fee2e2] border-[#b91c1c] text-[#991b1b] font-bold'
    return `${OPTION_COLORS[idx % 4].tile} opacity-30`
  }

  if (loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight via-teal-dark to-midnight flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-aqua border-t-transparent mx-auto" />
          <p className="text-aqua mt-4 font-semibold">{t('trivia.infinite.loadingQuestions')}</p>
          <p className="text-aqua/70 text-sm mt-2 font-medium">{t('trivia.infinite.generatingTrivia')}</p>
        </div>
      </div>
    )
  }

  if (gameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-midnight via-teal-dark to-midnight flex items-center justify-center p-4">
        <div className="bg-aqua/10 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full text-center border border-golden">
          <div className="w-20 h-20 mx-auto mb-4 bg-golden rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-3xl font-black text-white mb-2">{t('trivia.infinite.gameOver')}</h2>
          <p className="text-aqua mb-6 font-semibold">{t('trivia.infinite.infiniteMode')}</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-golden/20 rounded-xl p-4">
              <p className="text-aqua text-sm font-semibold">{t('trivia.infinite.scoreLabel')}</p>
              <p className="text-3xl font-bold text-white">{score}</p>
            </div>
            <div className="bg-aqua/20 rounded-xl p-4">
              <p className="text-aqua text-sm font-semibold">{t('trivia.infinite.bestStreakLabel')}</p>
              <p className="text-3xl font-bold text-white">{bestStreak}</p>
            </div>
            <div className="bg-midnight/50 rounded-xl p-4">
              <p className="text-aqua text-sm font-semibold">{t('trivia.infinite.questionsLabel')}</p>
              <p className="text-3xl font-bold text-white">{totalAnswered}</p>
            </div>
            <div className="bg-golden/20 rounded-xl p-4">
              <p className="text-aqua text-sm font-semibold">{t('trivia.infinite.precisionLabel')}</p>
              <p className="text-3xl font-bold text-white">
                {totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0}%
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRestart}
              className="w-full py-4 bg-golden text-midnight rounded-xl font-bold hover:bg-golden-dark transition-all"
            >
              {t('trivia.infinite.playAgain')}
            </button>
            <button
              onClick={() => navigate('/trivia')}
              className="w-full py-4 bg-aqua/20 text-white rounded-xl font-bold hover:bg-aqua/30 transition-all"
            >
              {t('trivia.infinite.backToMenu')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight via-teal-dark to-midnight">
      {/* Header */}
      <div className="bg-midnight py-4 sticky top-0 z-10 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-aqua text-xs font-bold uppercase tracking-wide">{t('trivia.infinite.scoreText')}</p>
                <p className="text-2xl font-black text-white">{score}</p>
              </div>
              <div>
                <p className="text-aqua text-xs font-bold uppercase tracking-wide">{t('trivia.infinite.streakText')}</p>
                <p className="text-2xl font-black text-golden">{streak}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-1" aria-label={`${lives} vidas restantes`}>
                <span className="text-xl leading-none" role="img" aria-hidden="true">{0 < lives ? '❤️' : '🖤'}</span>
                <span className="text-xl leading-none" role="img" aria-hidden="true">{1 < lives ? '❤️' : '🖤'}</span>
                <span className="text-xl leading-none" role="img" aria-hidden="true">{2 < lives ? '❤️' : '🖤'}</span>
              </div>
              <div className="text-golden text-sm font-bold bg-golden/20 px-2 py-1 rounded-md">
                #{totalAnswered + 1}
              </div>
              <button
                onClick={() => navigate('/trivia')}
                className="px-4 py-2 bg-golden text-midnight rounded-lg text-sm font-bold transition-all duration-200 hover:bg-golden-dark hover:scale-105 shadow-md cursor-pointer"
              >
                {t('trivia.infinite.exit')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pregunta */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {currentQuestion ? (
          <div className="bg-primary rounded-3xl p-6 md:p-8 shadow-2xl border border-golden/30">
            {/* Tipo de pregunta */}
            <div className="flex items-center mb-6">
              <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-semibold border border-secondary/30">
                {getQuestionTypeLabel(currentQuestion.type)}
              </span>
            </div>

            {/* Imagen de bandera si es pregunta de bandera */}
            {currentQuestion.type === 'FLAG' && currentQuestion.flagUrl && (
              <div className="mb-6 flex justify-center">
                <img
                  src={currentQuestion.flagUrl}
                  alt="Bandera"
                  className="h-32 md:h-40 object-contain rounded-lg shadow-lg border-4 border-secondary/30"
                />
              </div>
            )}

            {/* Pregunta */}
            <h2 className="text-xl md:text-2xl font-bold text-text text-center mb-8">
              {currentQuestion.question}
            </h2>

            {/* Opciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={answered}
                  className={`w-full px-4 py-4 rounded-xl border-2 text-left font-bold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed flex items-center gap-3 min-h-[64px] ${getOptionStyle(option, idx)}`}
                >
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black flex-shrink-0 ${answered ? 'bg-black/15 text-inherit' : OPTION_COLORS[idx % 4].badge}`}>
                    {['A','B','C','D'][idx]}
                  </span>
                  <span className="text-sm md:text-base leading-tight">{option}</span>
                </button>
              ))}
            </div>

            {/* Botón siguiente */}
            {answered && (
              <button
                onClick={handleNext}
                className="w-full mt-6 py-4 bg-golden text-midnight rounded-xl font-bold hover:bg-golden-dark transition-all cursor-pointer"
              >
                {t('trivia.infinite.nextQuestion')} →
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-aqua border-t-transparent mx-auto" />
            <p className="text-aqua mt-4 font-semibold">{t('trivia.infinite.loadingMore')}</p>
          </div>
        )}
      </div>

      {/* Footer con info */}
      <div className="fixed bottom-0 left-0 right-0 bg-midnight/80 py-2 text-center">
        <p className="text-aqua/70 text-xs font-medium">
          {t('trivia.infinite.modeInfo')} • {usedQuestionIds.size} {t('trivia.infinite.uniqueQuestions')}
        </p>
      </div>
    </div>
  )
}

const getQuestionTypeLabel = (type) => {
  const labels = {
    'CAPITAL': 'Capital',
    'FLAG': 'Bandera',
    'CURRENCY': 'Moneda',
    'LANGUAGE': 'Idioma',
    'POPULATION': 'Población',
    'CONTINENT': 'Continente',
    'AREA': 'Área'
  }
  return labels[type] || type
}

export default TriviaInfinitePage


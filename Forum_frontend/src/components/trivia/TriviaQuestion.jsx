import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Componente que muestra una pregunta de trivia
 */
const TriviaQuestion = ({ question, onAnswer, timeLimit = 15 }) => {
  const { t } = useLanguage()
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [answered, setAnswered] = useState(false)
  const [startTime] = useState(Date.now())

  // Timer
  useEffect(() => {
    if (answered) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [answered])

  // Reset cuando cambia la pregunta
  useEffect(() => {
    setSelectedAnswer(null)
    setAnswered(false)
    setTimeLeft(question.timeLimitSeconds || timeLimit)
  }, [question.id])

  const handleTimeout = useCallback(() => {
    if (answered) return
    setAnswered(true)
    onAnswer({
      questionId: Number(question.id),
      selectedAnswer: null,
      responseTimeMs: Number((question.timeLimitSeconds || timeLimit) * 1000),
      timedOut: true,
      hintUsed: false
    })
  }, [answered, question, onAnswer, timeLimit])

  const handleSelectAnswer = (answer) => {
    if (answered) return

    setSelectedAnswer(answer)
    setAnswered(true)

    const responseTime = Date.now() - startTime

    onAnswer({
      questionId: Number(question.id),
      selectedAnswer: answer,
      responseTimeMs: Number(Math.round(responseTime)),
      timedOut: false,
      hintUsed: false
    })
  }

  // Color del timer según tiempo restante (usando colores del tema)
  const getTimerColor = () => {
    if (timeLeft > 10) return 'text-success dark:text-success-light'
    if (timeLeft > 5) return 'text-warning dark:text-warning-light'
    return 'text-error dark:text-error-light animate-pulse'
  }

  // Porcentaje para barra de progreso
  const timerPercent = (timeLeft / (question.timeLimitSeconds || timeLimit)) * 100

  return (
    <div className="card overflow-hidden">
      {/* Header con progreso y timer */}
      <div className="bg-primary-100 dark:bg-primary-900/30 border-b-2 border-accent-600 px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-primary-800 dark:text-primary-300 text-sm font-semibold">
            {t('trivia.question')} {question.questionIndex} {t('trivia.of')} {question.totalQuestions}
          </span>
          <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${getTimerColor()}`}>
            <span>⏱️</span>
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Barra de tiempo */}
        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${timerPercent}%` }}
          />
        </div>

        {/* Puntos */}
        <div className="flex items-center justify-between mt-3 text-primary-800 dark:text-primary-400 text-sm font-semibold">
          <span>{question.countryFlag} {question.countryName}</span>
          <span>+{question.points} {t('trivia.points')}</span>
        </div>
      </div>

      {/* Pregunta */}
      <div className="p-6">
        {/* Imagen si existe */}
        {question.imageUrl && (
          <div className="mb-6 flex justify-center">
            <img
              src={question.imageUrl}
              alt="Pregunta"
              className="max-h-40 rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Texto de la pregunta */}
        <h2 className="text-xl md:text-2xl font-bold text-primary-800 dark:text-primary-200 text-center mb-8">
          {question.questionText}
        </h2>

        {/* Opciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, idx) => {
            const baseClasses = 'p-4 rounded-xl border-2 text-left font-semibold transition-all'
            let stateClasses
            if (answered) {
              if (selectedAnswer === option) {
                stateClasses = 'border-primary-500 bg-primary-500/20 text-primary-800 dark:text-primary-300'
              } else {
                stateClasses = 'border-accent-600/30 bg-gray-100 dark:bg-gray-800 text-primary-800 dark:text-primary-200'
              }
            } else {
              stateClasses = 'border-accent-600/50 hover:border-primary-500 hover:bg-primary-500/10 text-primary-800 dark:text-primary-200'
            }
            const buttonClass = `${baseClasses} ${stateClasses}`
            return (
              <button
                key={`${question.id}-${option}`}
                onClick={() => handleSelectAnswer(option)}
                disabled={answered}
                className={buttonClass}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-3 text-sm font-bold">
                  {String.fromCodePoint(65 + idx)}
                </span>
                {option}
              </button>
            )
          })}
        </div>

        {/* Indicador de dificultad */}
        <div className="mt-6 flex items-center justify-center gap-1">
          {[1, 2, 3, 4, 5].map(level => (
            <div
              key={level}
              className={`w-2 h-2 rounded-full ${
                level <= question.difficulty
                  ? 'bg-primary-500'
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
          <span className="text-primary-800 dark:text-primary-400 text-xs ml-2 font-semibold">
            {t('trivia.level')} {question.difficulty}
          </span>
        </div>
      </div>
    </div>
  )
}

TriviaQuestion.propTypes = {
  question: PropTypes.shape({
    id: PropTypes.number.isRequired,
    questionText: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    imageUrl: PropTypes.string,
    difficulty: PropTypes.number,
    points: PropTypes.number,
    timeLimitSeconds: PropTypes.number,
    questionIndex: PropTypes.number,
    totalQuestions: PropTypes.number,
    countryName: PropTypes.string,
    countryFlag: PropTypes.string
  }).isRequired,
  onAnswer: PropTypes.func.isRequired,
  timeLimit: PropTypes.number
}

export default TriviaQuestion


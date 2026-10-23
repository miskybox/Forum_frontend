import { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Componente que muestra una pregunta de trivia
 */
const TriviaQuestion = ({ question, onAnswer, timeLimit = 15, withTimer = true }) => {
  const { t } = useLanguage()
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [answered, setAnswered] = useState(false)
  const [startTime] = useState(Date.now())

  // Timer — solo si withTimer está activo
  useEffect(() => {
    if (!withTimer || answered) return

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answered, withTimer])

  // Reset cuando cambia la pregunta
  useEffect(() => {
    setSelectedAnswer(null)
    setAnswered(false)
    setTimeLeft(question.timeLimitSeconds || timeLimit)
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Color del timer según tiempo restante
  const getTimerColor = () => {
    if (timeLeft > 10) return 'text-success'
    if (timeLeft > 5) return 'text-warning'
    return 'text-error animate-pulse'
  }

  // Porcentaje para barra de progreso
  const timerPercent = (timeLeft / (question.timeLimitSeconds || timeLimit)) * 100

  return (
    <div className="bg-surface-container-low border-2 border-secondary/40 rounded-lg overflow-hidden shadow-level-2">
      {/* Header con progreso y timer */}
      <div className="bg-surface-container-low border-b border-surface-container-high px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-on-surface text-sm font-semibold">
            {t('trivia.question')} {question.questionIndex} {t('trivia.of')} {question.totalQuestions}
          </span>
          {withTimer && (
            <div className={`flex items-center gap-2 font-mono text-2xl font-bold ${getTimerColor()}`}>
              <span>⏱️</span>
              <span>{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Barra de tiempo */}
        {withTimer && (
          <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        )}

        {/* Puntos — countryFlag/Name solo tras responder para no revelar la respuesta */}
        <div className="flex items-center justify-between mt-3 text-on-surface text-sm font-semibold">
          <span>{answered ? `${question.countryFlag ?? ''} ${question.countryName ?? ''}`.trim() : ''}</span>
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
              className="max-h-40 rounded-lg shadow-level-2"
            />
          </div>
        )}

        {/* Texto de la pregunta */}
        <h2 className="text-xl md:text-2xl font-bold text-on-surface text-center mb-8">
          {question.questionText}
        </h2>

        {/* Opciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((option, idx) => {
            // Four clearly different palette tones; green is kept for the "correct" feedback
            const COLORS = [
              { tile: 'bg-secondary-fixed border-secondary text-on-secondary-fixed hover:bg-secondary-fixed-dim hover:shadow-level-2', badge: 'bg-secondary text-on-secondary' },
              { tile: 'bg-primary-fixed border-primary text-on-primary-fixed hover:bg-primary-fixed-dim hover:shadow-level-2', badge: 'bg-primary text-on-primary' },
              { tile: 'bg-surface-container-highest border-outline text-on-surface hover:bg-surface-dim hover:shadow-level-2', badge: 'bg-inverse-surface text-inverse-on-surface' },
              { tile: 'bg-surface-container-lowest border-tertiary text-on-surface hover:bg-tertiary-fixed hover:shadow-level-2', badge: 'bg-tertiary text-on-tertiary' },
            ]
            let tileClass
            let badgeClass
            if (answered) {
              tileClass = selectedAnswer === option
                ? 'bg-secondary-container border-on-secondary-fixed-variant text-on-secondary-fixed shadow-level-2 ring-2 ring-secondary'
                : `${COLORS[idx % 4].tile} opacity-50`
              badgeClass = 'bg-black/10 text-inherit'
            } else {
              tileClass = COLORS[idx % 4].tile
              badgeClass = COLORS[idx % 4].badge
            }
            return (
              <button
                key={`${question.id}-${option}`}
                onClick={() => handleSelectAnswer(option)}
                disabled={answered}
                className={`px-5 py-4 rounded-lg border-2 text-left font-bold transition-all duration-200 min-h-[70px] flex items-center gap-3 cursor-pointer disabled:cursor-not-allowed ${tileClass}`}
              >
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-base font-black flex-shrink-0 ${badgeClass}`}>
                  {String.fromCodePoint(65 + idx)}
                </span>
                <span className="text-base leading-tight">{option}</span>
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
                  ? 'bg-secondary'
                  : 'bg-surface-container-low'
              }`}
            />
          ))}
          <span className="text-on-surface-variant text-xs ml-2 font-semibold">
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
  timeLimit: PropTypes.number,
  withTimer: PropTypes.bool
}

export default TriviaQuestion

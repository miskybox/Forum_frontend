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
    <div className="bg-[#e8f4f1] border-2 border-secondary/40 rounded-xl overflow-hidden shadow-lg">
      {/* Header con progreso y timer */}
      <div className="bg-primary border-b-2 border-secondary px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-text text-sm font-semibold">
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
          <div className="h-2 bg-primary-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${timerPercent}%` }}
            />
          </div>
        )}

        {/* Puntos — countryFlag/Name solo tras responder para no revelar la respuesta */}
        <div className="flex items-center justify-between mt-3 text-text text-sm font-semibold">
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
              className="max-h-40 rounded-xl shadow-lg"
            />
          </div>
        )}

        {/* Texto de la pregunta */}
        <h2 className="text-xl md:text-2xl font-bold text-text text-center mb-8">
          {question.questionText}
        </h2>

        {/* Opciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((option, idx) => {
            const COLORS = [
              { tile: 'bg-[#dbeafe] border-[#1d4ed8] text-[#1e3a8a] hover:bg-[#bfdbfe] hover:shadow-[0_0_16px_rgba(59,130,246,0.35)] hover:scale-[1.02]', badge: 'bg-[#bfdbfe] text-[#1e3a8a]' },
              { tile: 'bg-[#ffedd5] border-[#c2410c] text-[#7c2d12] hover:bg-[#fed7aa] hover:shadow-[0_0_16px_rgba(194,65,12,0.35)] hover:scale-[1.02]', badge: 'bg-[#fed7aa] text-[#7c2d12]' },
              { tile: 'bg-[#dcfce7] border-[#166534] text-[#14532d] hover:bg-[#bbf7d0] hover:shadow-[0_0_16px_rgba(22,101,52,0.35)] hover:scale-[1.02]', badge: 'bg-[#bbf7d0] text-[#14532d]' },
              { tile: 'bg-[#fef3c7] border-[#a16207] text-[#713f12] hover:bg-[#fde68a] hover:shadow-[0_0_16px_rgba(161,98,7,0.35)] hover:scale-[1.02]', badge: 'bg-[#fde68a] text-[#713f12]' },
            ]
            let tileClass
            let badgeClass
            if (answered) {
              tileClass = selectedAnswer === option
                ? 'bg-[#bfdbfe] border-[#1d4ed8] text-[#1e3a8a] shadow-xl scale-[1.02]'
                : `${COLORS[idx % 4].tile} opacity-30`
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
                className={`px-5 py-4 rounded-xl border-2 text-left font-bold transition-all duration-200 min-h-[70px] flex items-center gap-3 cursor-pointer disabled:cursor-not-allowed ${tileClass}`}
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
                  : 'bg-primary-dark'
              }`}
            />
          ))}
          <span className="text-text-light text-xs ml-2 font-semibold">
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

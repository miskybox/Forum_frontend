import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'

const sanitizeText = (value = '') => value.toLowerCase().trim()

const isExplanationRedundant = (explanation, correctAnswer) => {
  const normalizedExplanation = sanitizeText(explanation)
  const normalizedAnswer = sanitizeText(correctAnswer)
  if (!normalizedExplanation || !normalizedAnswer) return false

  // If the explanation mostly repeats the exact answer, show a better fallback insight.
  return normalizedExplanation.includes(normalizedAnswer) && normalizedExplanation.length <= normalizedAnswer.length + 30
}

/**
 * Componente que muestra el resultado de una respuesta
 */
const TriviaResult = ({ result, onNext, isLastQuestion }) => {
  const { t } = useLanguage()
  const showExplanation = result.explanation && !isExplanationRedundant(result.explanation, result.correctAnswer)
  const fallbackInsight = result.correct ? t('trivia.result.extraInsightCorrect') : t('trivia.result.extraInsightIncorrect')

  return (
    <div className={`p-6 rounded-2xl ${
      result.correct
        ? 'bg-success-light border-2 border-success text-success-dark'
        : 'bg-error-light border-2 border-error text-error-dark'
    } shadow-level-2`}>
      {/* Icono y mensaje */}
      <div className="text-center mb-6">
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
          result.correct ? 'bg-success-light' : 'bg-error-light'
        }`}>
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
            {result.correct ? (
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            )}
          </svg>
        </div>
        <h3 className="text-2xl font-bold mt-4">
          {result.correct ? t('trivia.result.correct') : t('trivia.result.incorrect')}
        </h3>

        {!result.correct && (
          <p className="mt-2 text-error-dark font-semibold">
            {t('trivia.result.correctAnswerWas')} <strong>{result.correctAnswer}</strong>
          </p>
        )}
      </div>

      {/* Puntos ganados */}
      <div className="bg-surface-container-lowest border border-secondary/30 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-on-surface text-sm font-semibold">{t('trivia.result.pointsLabel')}</p>
            <p className="text-2xl font-bold text-warning-dark">+{result.pointsEarned}</p>
          </div>
          <div>
            <p className="text-on-surface text-sm font-semibold">{t('trivia.score')}</p>
            <p className="text-2xl font-bold text-on-surface">{result.currentGameScore}</p>
          </div>
          <div>
            <p className="text-on-surface text-sm font-semibold">{t('trivia.result.streakLabel')}</p>
            <p className="text-2xl font-bold text-on-surface">{result.currentStreak}</p>
          </div>
        </div>
      </div>

      {/* Explicación */}
      {(showExplanation || fallbackInsight) && (
        <div className="bg-surface-container-lowest border border-secondary/30 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-on-surface">
            <span className="font-bold text-warning-dark">{t('trivia.result.funFact')}</span> {showExplanation ? result.explanation : fallbackInsight}
          </p>
          <p className="text-xs mt-2 text-on-surface-variant">
            <span className="font-semibold text-secondary">{t('trivia.result.strategyLabel')}</span> {t('trivia.result.strategyTip')}
          </p>
        </div>
      )}

      {/* Botón continuar */}
      <button
        onClick={onNext}
        className="w-full py-4 bg-primary-fixed text-on-surface rounded-lg font-bold text-lg hover:bg-primary-fixed-dim transition-colors cursor-pointer"
      >
        {isLastQuestion ? t('trivia.result.viewResults') : t('trivia.nextQuestion')}
      </button>
    </div>
  )
}

TriviaResult.propTypes = {
  result: PropTypes.shape({
    correct: PropTypes.bool.isRequired,
    correctAnswer: PropTypes.string.isRequired,
    pointsEarned: PropTypes.number.isRequired,
    explanation: PropTypes.string,
    currentGameScore: PropTypes.number.isRequired,
    correctAnswersCount: PropTypes.number.isRequired,
    currentStreak: PropTypes.number.isRequired,
    hasNextQuestion: PropTypes.bool.isRequired
  }).isRequired,
  onNext: PropTypes.func.isRequired,
  isLastQuestion: PropTypes.bool
}

export default TriviaResult

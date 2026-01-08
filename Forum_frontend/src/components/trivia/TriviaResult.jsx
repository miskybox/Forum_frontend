import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * Componente que muestra el resultado de una respuesta
 */
const TriviaResult = ({ result, onNext, isLastQuestion }) => {
  const { t } = useLanguage()

  return (
    <div className={`p-6 rounded-2xl ${
      result.correct
        ? 'bg-gradient-to-br from-success to-success-dark'
        : 'bg-gradient-to-br from-error to-error-dark'
    } text-white shadow-xl`}>
      {/* Icono y mensaje */}
      <div className="text-center mb-6">
        <span className="text-6xl">
          {result.correct ? '🎉' : '😔'}
        </span>
        <h3 className="text-2xl font-bold mt-4">
          {result.correct ? t('trivia.result.correct') : t('trivia.result.incorrect')}
        </h3>

        {!result.correct && (
          <p className="mt-2 text-white/90 font-semibold">
            {t('trivia.result.correctAnswerWas')} <strong>{result.correctAnswer}</strong>
          </p>
        )}
      </div>

      {/* Puntos ganados */}
      <div className="bg-earth-50/20 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-white/70 text-sm font-semibold">{t('trivia.result.pointsLabel')}</p>
            <p className="text-2xl font-bold">+{result.pointsEarned}</p>
          </div>
          <div>
            <p className="text-white/70 text-sm font-semibold">{t('trivia.score')}</p>
            <p className="text-2xl font-bold">{result.currentGameScore}</p>
          </div>
          <div>
            <p className="text-white/70 text-sm font-semibold">{t('trivia.result.streakLabel')}</p>
            <p className="text-2xl font-bold">🔥 {result.currentStreak}</p>
          </div>
        </div>
      </div>

      {/* Explicación */}
      {result.explanation && (
        <div className="bg-earth-50/10 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium">
            <span className="font-bold">{t('trivia.result.funFact')}</span> {result.explanation}
          </p>
        </div>
      )}

      {/* Botón continuar */}
      <button
        onClick={onNext}
        className="w-full py-4 bg-earth-50 text-text rounded-xl font-bold text-lg hover:bg-primary-light transition-colors"
      >
        {isLastQuestion ? `🏆 ${t('trivia.result.viewResults')}` : `➡️ ${t('trivia.nextQuestion')}`}
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

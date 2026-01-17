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
        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
          result.correct ? 'bg-white/20' : 'bg-white/10'
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
            <p className="text-2xl font-bold">{result.currentStreak}</p>
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
        className="w-full py-4 bg-golden text-midnight rounded-xl font-bold text-lg hover:bg-golden-dark transition-colors"
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

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LanguageProvider } from '../../contexts/LanguageContext'
import TriviaResult from './TriviaResult'

const baseResult = {
  correct: false,
  correctAnswer: 'Asia',
  pointsEarned: 0,
  explanation: 'Asia es el continente mas extenso del mundo.',
  currentGameScore: 0,
  correctAnswersCount: 0,
  currentStreak: 0,
  hasNextQuestion: true,
}

const renderResult = (result = baseResult, props = {}) =>
  render(
    <MemoryRouter>
      <LanguageProvider>
        <TriviaResult result={result} onNext={vi.fn()} {...props} />
      </LanguageProvider>
    </MemoryRouter>
  )

describe('TriviaResult - Accesibilidad visual', () => {
  it('usa paleta de error legible con texto oscuro en respuesta incorrecta', () => {
    const { container } = renderResult()
    const panel = container.firstChild
    expect(panel.className).toContain('bg-error-light')
    expect(panel.className).toContain('text-error-dark')
    expect(panel.className).not.toContain('text-white')
  })

  it('muestra metrica de puntuacion y racha en texto oscuro', () => {
    renderResult()
    const metricValues = screen.getAllByText('0')
    expect(metricValues.length).toBeGreaterThanOrEqual(2)
    metricValues.forEach((valueNode) => {
      expect(valueNode.className).toContain('text-on-surface')
    })
  })

  it('boton siguiente usa contraste alto', () => {
    renderResult()
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-primary-fixed')
    expect(button.className).toContain('text-on-surface')
    expect(button.className).toContain('cursor-pointer')
  })
})

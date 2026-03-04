import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LanguageProvider } from '../../contexts/LanguageContext'
import TriviaQuestion from './TriviaQuestion'

vi.useFakeTimers()

const mockQuestion = {
  id: 1,
  questionText: '¿Cuál es la capital de Francia?',
  options: ['París', 'Madrid', 'Roma', 'Berlín'],
  difficulty: 3,
  points: 100,
  timeLimitSeconds: 15,
  questionIndex: 1,
  totalQuestions: 20,
  countryName: 'Francia',
  countryFlag: '🇫🇷',
}

const renderQuestion = (props = {}) =>
  render(
    <MemoryRouter>
      <LanguageProvider>
        <TriviaQuestion question={mockQuestion} onAnswer={vi.fn()} {...props} />
      </LanguageProvider>
    </MemoryRouter>
  )

describe('TriviaQuestion — Accesibilidad', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  describe('Cursor pointer en botones de respuesta', () => {
    it('todos los botones de opción tienen cursor-pointer', () => {
      renderQuestion()
      const buttons = screen.getAllByRole('button')
      const answerButtons = buttons.filter(btn =>
        mockQuestion.options.some(opt => btn.textContent?.includes(opt))
      )
      expect(answerButtons.length).toBe(4)
      answerButtons.forEach(btn => {
        expect(btn.className).toContain('cursor-pointer')
      })
    })

    it('los botones deshabilitados tienen cursor-not-allowed o están marcados como disabled', () => {
      renderQuestion()
      // Click en primera opción para deshabilitar todos
      const first = screen.getByText('París').closest('button')
      fireEvent.click(first)
      const buttons = screen.getAllByRole('button')
      const answerButtons = buttons.filter(btn =>
        mockQuestion.options.some(opt => btn.textContent?.includes(opt))
      )
      answerButtons.forEach(btn => {
        expect(btn).toBeDisabled()
      })
    })
  })

  describe('Visibilidad del cronómetro', () => {
    it('muestra el cronómetro cuando withTimer=true', () => {
      renderQuestion({ withTimer: true })
      expect(screen.getByText(/⏱️/)).toBeInTheDocument()
      expect(screen.getByText(/15s/)).toBeInTheDocument()
    })

    it('oculta el cronómetro cuando withTimer=false', () => {
      renderQuestion({ withTimer: false })
      expect(screen.queryByText(/⏱️/)).not.toBeInTheDocument()
      expect(screen.queryByText(/15s/)).not.toBeInTheDocument()
    })

    it('el temporizador cuenta hacia atrás con withTimer=true', () => {
      renderQuestion({ withTimer: true })
      expect(screen.getByText('15s')).toBeInTheDocument()
      act(() => { vi.advanceTimersByTime(3000) })
      expect(screen.getByText('12s')).toBeInTheDocument()
    })

    it('no hay cuenta atrás automática con withTimer=false', () => {
      const onAnswer = vi.fn()
      renderQuestion({ withTimer: false, onAnswer })
      act(() => { vi.advanceTimersByTime(20000) })
      expect(onAnswer).not.toHaveBeenCalled()
    })
  })

  describe('Flujo de respuesta', () => {
    it('muestra las 4 opciones como botones', () => {
      renderQuestion()
      mockQuestion.options.forEach(opt => {
        expect(screen.getByText(opt)).toBeInTheDocument()
      })
    })

    it('no muestra el nombre del país antes de responder (anti-spoiler)', () => {
      renderQuestion()
      expect(screen.queryByText('Francia')).not.toBeInTheDocument()
    })

    it('revela nombre del país tras responder', () => {
      renderQuestion()
      fireEvent.click(screen.getByText('París').closest('button'))
      // El span de país revelado aparece con bandera + nombre
      const revealed = screen.getAllByText(/Francia/)
      // Al menos uno de los matches es el span de revelación (no la pregunta)
      expect(revealed.length).toBeGreaterThanOrEqual(2)
    })

    it('muestra número de pregunta y total', () => {
      renderQuestion()
      // El span de progreso contiene "Pregunta 1 de 20"
      expect(screen.getByText(/Pregunta 1 de 20/i)).toBeInTheDocument()
    })

    it('llama onAnswer con los datos correctos al responder', () => {
      const onAnswer = vi.fn()
      renderQuestion({ onAnswer })
      fireEvent.click(screen.getByText('Madrid').closest('button'))
      expect(onAnswer).toHaveBeenCalledOnce()
      expect(onAnswer).toHaveBeenCalledWith(
        expect.objectContaining({
          questionId: 1,
          selectedAnswer: 'Madrid',
          timedOut: false,
        })
      )
    })

    it('llama onAnswer con timedOut=true cuando se acaba el tiempo', () => {
      const onAnswer = vi.fn()
      renderQuestion({ withTimer: true, onAnswer })
      act(() => { vi.advanceTimersByTime(16000) })
      expect(onAnswer).toHaveBeenCalledWith(
        expect.objectContaining({ timedOut: true, selectedAnswer: null })
      )
    })
  })

  describe('Indicador de dificultad', () => {
    it('muestra el nivel de dificultad', () => {
      renderQuestion()
      expect(screen.getByText(/nivel/i)).toBeInTheDocument()
      expect(screen.getByText(/3/)).toBeInTheDocument()
    })
  })
})

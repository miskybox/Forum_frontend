import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LanguageProvider } from '../../contexts/LanguageContext'
import TriviaInfinitePage from './TriviaInfinitePage'

// Mock de react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}))

// Mock de restCountriesService con preguntas de ejemplo
vi.mock('../../services/restCountriesService', () => ({
  default: {
    generateTriviaQuestions: vi.fn().mockResolvedValue([
      {
        id: 'q1',
        question: '¿Cuál es la capital de Japón?',
        options: ['Tokio', 'Osaka', 'Kioto', 'Hiroshima'],
        correctAnswer: 'Tokio',
        type: 'CAPITAL',
        countryCode: 'JP',
      },
      {
        id: 'q2',
        question: '¿En qué continente está Brasil?',
        options: ['América del Sur', 'África', 'Asia', 'Europa'],
        correctAnswer: 'América del Sur',
        type: 'CONTINENT',
        countryCode: 'BR',
      },
      {
        id: 'q3',
        question: '¿Cuál es la moneda de Australia?',
        options: ['Dólar australiano', 'Euro', 'Libra', 'Yen'],
        correctAnswer: 'Dólar australiano',
        type: 'CURRENCY',
        countryCode: 'AU',
      },
    ]),
  },
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => vi.fn() }
})

const renderPage = () =>
  render(
    <MemoryRouter>
      <LanguageProvider>
        <TriviaInfinitePage />
      </LanguageProvider>
    </MemoryRouter>
  )

describe('TriviaInfinitePage — Accesibilidad', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Carga inicial', () => {
    it('muestra spinner de carga mientras obtiene preguntas', () => {
      renderPage()
      // Spinner está presente antes de que resuelva la promesa
      const spinners = document.querySelectorAll('.animate-spin')
      expect(spinners.length).toBeGreaterThan(0)
    })

    it('muestra las preguntas tras cargar', async () => {
      renderPage()
      await waitFor(() => {
        expect(screen.getByText(/¿Cuál es la capital de Japón\?/)).toBeInTheDocument()
      })
    })
  })

  describe('Botón de salir (accesibilidad)', () => {
    it('el botón de salir es visible y tiene texto legible', async () => {
      renderPage()
      await waitFor(() => screen.getByText(/¿Cuál es la capital de Japón\?/))
      const exitBtn = screen.getByRole('button', { name: /salir/i })
      expect(exitBtn).toBeInTheDocument()
      expect(exitBtn).toBeVisible()
    })

    it('el botón de salir tiene cursor-pointer', async () => {
      renderPage()
      await waitFor(() => screen.getByText(/¿Cuál es la capital de Japón\?/))
      const exitBtn = screen.getByRole('button', { name: /salir/i })
      expect(exitBtn.className).toContain('cursor-pointer')
    })

    it('el botón de salir NO contiene el símbolo ✕', async () => {
      renderPage()
      await waitFor(() => screen.getByText(/¿Cuál es la capital de Japón\?/))
      const exitBtn = screen.getByRole('button', { name: /salir/i })
      expect(exitBtn.textContent).not.toContain('✕')
    })
  })

  describe('Indicador de vidas', () => {
    it('muestra 3 corazones al inicio', async () => {
      renderPage()
      await waitFor(() => screen.getByText(/¿Cuál es la capital de Japón\?/))
      const livesContainer = screen.getByLabelText(/vidas restantes/i)
      expect(livesContainer).toBeInTheDocument()
      // 3 corazones llenos
      expect(livesContainer.textContent).toContain('❤️❤️❤️')
    })

    it('pierde un corazón al fallar', async () => {
      renderPage()
      await waitFor(() => screen.getByText(/¿Cuál es la capital de Japón\?/))
      // Respuesta incorrecta
      fireEvent.click(screen.getByText('Osaka').closest('button'))
      await waitFor(() => {
        const livesContainer = screen.getByLabelText(/vidas restantes/i)
        expect(livesContainer.textContent).toContain('❤️❤️🖤')
      })
    })
  })

  describe('Cursor en botones de respuesta', () => {
    it('los botones de respuesta tienen cursor-pointer antes de contestar', async () => {
      renderPage()
      await waitFor(() => screen.getByText(/¿Cuál es la capital de Japón\?/))
      const answerBtns = ['Tokio', 'Osaka', 'Kioto', 'Hiroshima'].map(opt =>
        screen.getByText(opt).closest('button')
      )
      answerBtns.forEach(btn => {
        expect(btn.className).toContain('cursor-pointer')
      })
    })

    it('tras responder los botones están deshabilitados', async () => {
      renderPage()
      await waitFor(() => screen.getByText(/¿Cuál es la capital de Japón\?/))
      fireEvent.click(screen.getByText('Tokio').closest('button'))
      const answerBtns = ['Tokio', 'Osaka', 'Kioto', 'Hiroshima'].map(opt =>
        screen.getByText(opt).closest('button')
      )
      answerBtns.forEach(btn => {
        expect(btn).toBeDisabled()
      })
    })
  })

  describe('Legibilidad del texto', () => {
    it('la pregunta tiene color oscuro (no blanco) sobre fondo claro', async () => {
      renderPage()
      await waitFor(() => screen.getByText(/¿Cuál es la capital de Japón\?/))
      const h2 = screen.getByText(/¿Cuál es la capital de Japón\?/)
      // text-text significa color oscuro (verde #37553b) — NO text-white
      expect(h2.className).not.toContain('text-white')
      expect(h2.className).toContain('text-text')
    })

    it('el contador de pregunta es visible con alto contraste', async () => {
      renderPage()
      await waitFor(() => screen.getByText(/¿Cuál es la capital de Japón\?/))
      const counter = screen.getByText('#1')
      expect(counter).toBeVisible()
      expect(counter.className).toContain('bg-golden/20')
    })
  })
})

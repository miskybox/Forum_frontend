import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import LocalStorageDebug from './LocalStorageDebug'

// Mock import.meta.env
vi.mock('import.meta', () => ({
  env: {
    PROD: false, // Simular modo desarrollo
  },
}))

describe('LocalStorageDebug', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renderiza el botón de debug en desarrollo', () => {
    render(<LocalStorageDebug />)

    const debugButton = screen.getByText(/debug storage/i)
    expect(debugButton).toBeInTheDocument()
  })

  it('muestra el panel cuando se hace click en el botón', async () => {
    const user = userEvent.setup()
    render(<LocalStorageDebug />)

    const debugButton = screen.getByText(/debug storage/i)
    await user.click(debugButton)

    await waitFor(() => {
      expect(screen.getByText(/localStorage Status/i)).toBeInTheDocument()
    })
  })

  it('muestra "NO" cuando no hay token', async () => {
    const user = userEvent.setup()
    render(<LocalStorageDebug />)

    const debugButton = screen.getByText(/debug storage/i)
    await user.click(debugButton)

    await waitFor(() => {
      expect(screen.getByText(/❌ NO/i)).toBeInTheDocument()
    })
  })

  it('muestra "YES" cuando hay token en localStorage', async () => {
    const user = userEvent.setup()
    localStorage.setItem('token', 'fake-jwt-token-12345')

    render(<LocalStorageDebug />)

    const debugButton = screen.getByText(/debug storage/i)
    await user.click(debugButton)

    await waitFor(() => {
      expect(screen.getByText(/✅ YES/i)).toBeInTheDocument()
    })
  })

  it('muestra la longitud del token correctamente', async () => {
    const user = userEvent.setup()
    const testToken = 'fake-jwt-token-12345'
    localStorage.setItem('token', testToken)

    render(<LocalStorageDebug />)

    const debugButton = screen.getByText(/debug storage/i)
    await user.click(debugButton)

    await waitFor(() => {
      expect(screen.getByText(new RegExp(`${testToken.length} chars`))).toBeInTheDocument()
    })
  })

  it('muestra los primeros 50 caracteres del token', async () => {
    const user = userEvent.setup()
    const longToken = 'a'.repeat(100)
    localStorage.setItem('token', longToken)

    render(<LocalStorageDebug />)

    const debugButton = screen.getByText(/debug storage/i)
    await user.click(debugButton)

    await waitFor(() => {
      const expectedPreview = longToken.substring(0, 50) + '...'
      expect(screen.getByText(expectedPreview)).toBeInTheDocument()
    })
  })

  it('limpia los tokens cuando se hace click en "Clear Tokens"', async () => {
    const user = userEvent.setup()
    localStorage.setItem('token', 'fake-token')
    localStorage.setItem('refreshToken', 'fake-refresh-token')

    // Mock window.alert para evitar que bloquee el test
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<LocalStorageDebug />)

    const debugButton = screen.getByText(/debug storage/i)
    await user.click(debugButton)

    const clearButton = await screen.findByText(/🗑️ Clear Tokens/i)
    await user.click(clearButton)

    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
    expect(alertSpy).toHaveBeenCalledWith('Tokens removed from localStorage')

    alertSpy.mockRestore()
  })

  it('cierra el panel cuando se hace click en el botón de nuevo', async () => {
    const user = userEvent.setup()
    render(<LocalStorageDebug />)

    const debugButton = screen.getByText(/debug storage/i)

    // Abrir el panel
    await user.click(debugButton)
    expect(screen.getByText(/localStorage Status/i)).toBeInTheDocument()

    // Cerrar el panel
    await user.click(debugButton)

    await waitFor(() => {
      expect(screen.queryByText(/localStorage Status/i)).not.toBeInTheDocument()
    })
  })

  it('actualiza la información del storage periódicamente', async () => {
    render(<LocalStorageDebug />)
    const user = userEvent.setup()

    const debugButton = screen.getByText(/debug storage/i)
    await user.click(debugButton)

    // Verificar estado inicial sin token
    await waitFor(() => {
      expect(screen.getByText(/❌ NO/i)).toBeInTheDocument()
    })

    // Simular que se agrega un token después
    localStorage.setItem('token', 'new-token')

    // Esperar a que el interval actualice (1 segundo)
    await waitFor(() => {
      expect(screen.getByText(/✅ YES/i)).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('muestra NULL cuando no hay tokens', async () => {
    const user = userEvent.setup()
    render(<LocalStorageDebug />)

    const debugButton = screen.getByText(/debug storage/i)
    await user.click(debugButton)

    await waitFor(() => {
      const nullTexts = screen.getAllByText('NULL')
      // Debe haber 2 NULL: uno para accessToken y otro para refreshToken
      expect(nullTexts.length).toBe(2)
    })
  })

  it('muestra ambos tokens cuando están presentes', async () => {
    const user = userEvent.setup()
    const accessToken = 'access-token-12345678901234567890123456789012345678901234567890'
    const refreshToken = 'refresh-token-12345678901234567890123456789012345678901234567890'

    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    render(<LocalStorageDebug />)

    const debugButton = screen.getByText(/debug storage/i)
    await user.click(debugButton)

    await waitFor(() => {
      expect(screen.getByText(accessToken.substring(0, 50) + '...')).toBeInTheDocument()
      expect(screen.getByText(refreshToken.substring(0, 50) + '...')).toBeInTheDocument()
    })
  })
})

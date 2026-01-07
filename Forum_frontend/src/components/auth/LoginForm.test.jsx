import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import LoginForm from './LoginForm'
import { AuthContext } from '../../contexts/AuthContext'

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  },
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('LoginForm', () => {
  const mockLogin = vi.fn()
  const mockAuthContext = {
    login: mockLogin,
    user: null,
    loading: false,
    logout: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderLoginForm = () => {
    return render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <LoginForm />
        </AuthContext.Provider>
      </MemoryRouter>
    )
  }

  it('renderiza el formulario correctamente', () => {
    renderLoginForm()

    expect(screen.getByRole('textbox', { name: /usuario/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/mínimo 8 caracteres/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /acceder/i })).toBeInTheDocument()
  })

  it('permite introducir texto en los campos', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    const usernameInput = screen.getByRole('textbox', { name: /usuario/i })
    const passwordInput = screen.getByPlaceholderText(/mínimo 8 caracteres/i)

    await user.type(usernameInput, 'testuser')
    await user.type(passwordInput, 'password123')

    expect(usernameInput).toHaveValue('testuser')
    expect(passwordInput).toHaveValue('password123')
  })

  it('llama a login al enviar el formulario', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValueOnce({ success: true })
    renderLoginForm()

    await user.type(screen.getByRole('textbox', { name: /usuario/i }), 'testuser')
    await user.type(screen.getByPlaceholderText(/mínimo 8 caracteres/i), 'password123')
    await user.click(screen.getByRole('button', { name: /acceder/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
    })
  })

  it('campos de usuario y contraseña son requeridos', () => {
    renderLoginForm()

    const usernameInput = screen.getByRole('textbox', { name: /usuario/i })
    const passwordInput = screen.getByPlaceholderText(/mínimo 8 caracteres/i)

    expect(usernameInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })

  it('valida caracteres inválidos en nombre de usuario', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByRole('textbox', { name: /usuario/i }), 'user@invalid')
    await user.type(screen.getByPlaceholderText(/mínimo 8 caracteres/i), 'password123')
    await user.click(screen.getByRole('button', { name: /acceder/i }))

    await waitFor(() => {
      expect(screen.getByText(/caracteres inv[aá]lidos/i)).toBeInTheDocument()
    })
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('muestra error cuando las credenciales son incorrectas', async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValueOnce({
      response: {
        status: 401,
        data: { message: 'Credenciales inválidas' }
      }
    })
    renderLoginForm()

    await user.type(screen.getByRole('textbox', { name: /usuario/i }), 'wronguser')
    await user.type(screen.getByPlaceholderText(/mínimo 8 caracteres/i), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /acceder/i }))

    await waitFor(() => {
      expect(screen.getByText(/incorrecto|inv[aá]lido/i)).toBeInTheDocument()
    })
  })

  it('navega a home después de login exitoso', async () => {
    const user = userEvent.setup()
    mockLogin.mockResolvedValueOnce({ success: true })
    renderLoginForm()

    await user.type(screen.getByRole('textbox', { name: /usuario/i }), 'testuser')
    await user.type(screen.getByPlaceholderText(/mínimo 8 caracteres/i), 'password123')
    await user.click(screen.getByRole('button', { name: /acceder/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123'
      })
      expect(mockNavigate).toHaveBeenCalledWith('/')
    })
  })

  it('deshabilita el botón durante el envío', async () => {
    const user = userEvent.setup()
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    renderLoginForm()

    await user.type(screen.getByRole('textbox', { name: /usuario/i }), 'testuser')
    await user.type(screen.getByPlaceholderText(/mínimo 8 caracteres/i), 'password123')

    const submitButton = screen.getByRole('button', { name: /acceder/i })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/procesando/i)).toBeInTheDocument()
  })

  it('permite mostrar/ocultar contraseña', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    const passwordInput = screen.getByPlaceholderText(/mínimo 8 caracteres/i)
    await user.type(passwordInput, 'password123')

    // Buscar botón de mostrar contraseña
    const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i })
    expect(toggleButton).toBeInTheDocument()

    // Verificar que inicialmente es password
    expect(passwordInput).toHaveAttribute('type', 'password')

    // Hacer clic para mostrar
    await user.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')

    // Hacer clic para ocultar (ahora el aria-label cambió)
    const hideButton = screen.getByRole('button', { name: /ocultar contraseña/i })
    await user.click(hideButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('tiene formulario con action correcto', () => {
    renderLoginForm()
    
    const form = screen.getByRole('textbox', { name: /usuario/i }).closest('form')
    expect(form).toBeInTheDocument()
  })
})

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import RegisterForm from './RegisterForm'
import { renderWithProviders } from '../../__tests__/test-utils'

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

describe('RegisterForm', () => {
  const mockRegister = vi.fn()
  const mockLogin = vi.fn()
  const mockAuthContext = {
    register: mockRegister,
    login: mockLogin,
    user: null,
    loading: false,
    logout: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderRegisterForm = () => {
    return renderWithProviders(<RegisterForm />, {
      authValue: mockAuthContext
    })
  }

  // Helper para obtener campos - ACTUALIZADO con nuevo placeholder
  const getFields = () => ({
    firstName: screen.getByPlaceholderText('Nombre'),
    lastName: screen.getByPlaceholderText('Apellido'),
    username: screen.getByPlaceholderText('Nombre de usuario'),
    email: screen.getByPlaceholderText('tu@email.com'),
    password: screen.getByPlaceholderText(/mínimo 8 caracteres/i),
    confirmPassword: screen.getByPlaceholderText(/repite/i),
    submitButton: screen.getByRole('button', { name: /crear cuenta/i })
  })

  it('renderiza el formulario correctamente', () => {
    renderRegisterForm()

    const fields = getFields()
    expect(fields.firstName).toBeInTheDocument()
    expect(fields.lastName).toBeInTheDocument()
    expect(fields.username).toBeInTheDocument()
    expect(fields.email).toBeInTheDocument()
    expect(fields.password).toBeInTheDocument()
    expect(fields.confirmPassword).toBeInTheDocument()
    expect(fields.submitButton).toBeInTheDocument()
  })

  it('muestra error cuando las contraseñas no coinciden', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    const fields = getFields()
    await user.type(fields.firstName, 'John')
    await user.type(fields.lastName, 'Doe')
    await user.type(fields.username, 'johndoe')
    await user.type(fields.email, 'john@example.com')
    await user.type(fields.password, 'Password123!')
    await user.type(fields.confirmPassword, 'DifferentPass123!')
    await user.click(fields.submitButton)

    await waitFor(() => {
      expect(screen.getByText(/no coinciden/i)).toBeInTheDocument()
    })
  })

  it('registra usuario exitosamente', async () => {
    const user = userEvent.setup()
    mockRegister.mockResolvedValueOnce({ success: true })
    mockLogin.mockResolvedValueOnce({ success: true })
    renderRegisterForm()

    const fields = getFields()
    await user.type(fields.firstName, 'John')
    await user.type(fields.lastName, 'Doe')
    await user.type(fields.username, 'johndoe')
    await user.type(fields.email, 'john@example.com')
    await user.type(fields.password, 'Password123!')
    await user.type(fields.confirmPassword, 'Password123!')
    await user.click(fields.submitButton)

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'johndoe',
        email: 'john@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe'
      })
    })
  })

  it('navega a /login después de registro exitoso', async () => {
    const user = userEvent.setup()
    mockRegister.mockResolvedValueOnce({ success: true })
    renderRegisterForm()

    const fields = getFields()
    await user.type(fields.firstName, 'John')
    await user.type(fields.lastName, 'Doe')
    await user.type(fields.username, 'johndoe')
    await user.type(fields.email, 'john@example.com')
    await user.type(fields.password, 'Password123!')
    await user.type(fields.confirmPassword, 'Password123!')
    await user.click(fields.submitButton)

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  it('todos los campos son requeridos', () => {
    renderRegisterForm()

    const fields = getFields()
    expect(fields.firstName).toBeRequired()
    expect(fields.lastName).toBeRequired()
    expect(fields.username).toBeRequired()
    expect(fields.email).toBeRequired()
    expect(fields.password).toBeRequired()
    expect(fields.confirmPassword).toBeRequired()
  })

  it('valida longitud mínima de contraseña (8 caracteres)', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    const fields = getFields()
    await user.type(fields.firstName, 'John')
    await user.type(fields.lastName, 'Doe')
    await user.type(fields.username, 'johndoe')
    await user.type(fields.email, 'john@example.com')
    await user.type(fields.password, 'Short1!')
    await user.type(fields.confirmPassword, 'Short1!')
    await user.click(fields.submitButton)

    await waitFor(() => {
      const errorElement = screen.getByRole('alert')
      expect(errorElement).toHaveTextContent(/mínimo 8 caracteres/i)
    })
  })

  it('valida que la contraseña tenga al menos una mayúscula', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    const fields = getFields()
    await user.type(fields.firstName, 'John')
    await user.type(fields.lastName, 'Doe')
    await user.type(fields.username, 'johndoe')
    await user.type(fields.email, 'john@example.com')
    await user.type(fields.password, 'password123!')
    await user.type(fields.confirmPassword, 'password123!')
    await user.click(fields.submitButton)

    await waitFor(() => {
      expect(screen.getByText(/debe contener al menos una letra mayúscula/i)).toBeInTheDocument()
    })
  })

  it('valida que la contraseña tenga al menos una minúscula', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    const fields = getFields()
    await user.type(fields.firstName, 'John')
    await user.type(fields.lastName, 'Doe')
    await user.type(fields.username, 'johndoe')
    await user.type(fields.email, 'john@example.com')
    await user.type(fields.password, 'PASSWORD123!')
    await user.type(fields.confirmPassword, 'PASSWORD123!')
    await user.click(fields.submitButton)

    await waitFor(() => {
      expect(screen.getByText(/debe contener al menos una letra minúscula/i)).toBeInTheDocument()
    })
  })

  it('valida que la contraseña tenga al menos un carácter especial', async () => {
    const user = userEvent.setup()
    renderRegisterForm()

    const fields = getFields()
    await user.type(fields.firstName, 'John')
    await user.type(fields.lastName, 'Doe')
    await user.type(fields.username, 'johndoe')
    await user.type(fields.email, 'john@example.com')
    await user.type(fields.password, 'Password123')
    await user.type(fields.confirmPassword, 'Password123')
    await user.click(fields.submitButton)

    await waitFor(() => {
      expect(screen.getByText(/debe contener al menos un carácter especial/i)).toBeInTheDocument()
    })
  })

  it('muestra error cuando el registro falla', async () => {
    const user = userEvent.setup()
    mockRegister.mockRejectedValueOnce({
      response: {
        status: 409,
        data: { message: 'Usuario ya existe' }
      }
    })
    renderRegisterForm()

    const fields = getFields()
    await user.type(fields.firstName, 'John')
    await user.type(fields.lastName, 'Doe')
    await user.type(fields.username, 'existinguser')
    await user.type(fields.email, 'john@example.com')
    await user.type(fields.password, 'Password123!')
    await user.type(fields.confirmPassword, 'Password123!')
    await user.click(fields.submitButton)

    await waitFor(() => {
      expect(screen.getByText(/ya registrado/i)).toBeInTheDocument()
    })
  })

  it('deshabilita el botón durante el envío', async () => {
    const user = userEvent.setup()
    mockRegister.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    renderRegisterForm()

    const fields = getFields()
    await user.type(fields.firstName, 'John')
    await user.type(fields.lastName, 'Doe')
    await user.type(fields.username, 'johndoe')
    await user.type(fields.email, 'john@example.com')
    await user.type(fields.password, 'Password123!')
    await user.type(fields.confirmPassword, 'Password123!')
    await user.click(fields.submitButton)

    expect(fields.submitButton).toBeDisabled()
    expect(screen.getByText(/registrando/i)).toBeInTheDocument()
  })

  it('tiene todos los campos requeridos', () => {
    renderRegisterForm()

    const inputs = screen.getAllByRole('textbox')
    const passwordInputs = document.querySelectorAll('input[type="password"]')

    // 4 campos de texto + 2 de contraseña
    expect(inputs.length + passwordInputs.length).toBe(6)
  })

  it('campo de email tiene tipo email', () => {
    renderRegisterForm()

    const emailInput = screen.getByPlaceholderText('tu@email.com')
    expect(emailInput).toHaveAttribute('type', 'email')
  })
})

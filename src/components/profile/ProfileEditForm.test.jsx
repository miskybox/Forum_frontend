import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import ProfileEditForm from './ProfileEditForm'
import userService from '../../services/userService'

vi.mock('../../services/userService', () => ({ default: { updateUser: vi.fn() } }))
vi.mock('react-hot-toast', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const user = {
  id: 7,
  username: 'alvaro',
  fullName: 'Álvaro Morales',
  email: 'alvaro@demo.test',
  location: 'Granada',
  biography: 'Senderista',
}

describe('ProfileEditForm', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the field names expected by the backend', async () => {
    userService.updateUser.mockResolvedValue({})
    const onSaved = vi.fn()
    render(<ProfileEditForm user={user} onSaved={onSaved} />)

    fireEvent.change(screen.getByLabelText('Ubicación'), { target: { value: 'Lima' } })
    fireEvent.click(screen.getByRole('button', { name: /actualizar perfil/i }))

    await waitFor(() => expect(userService.updateUser).toHaveBeenCalledWith(7, {
      username: 'alvaro',
      fullName: 'Álvaro Morales',
      email: 'alvaro@demo.test',
      location: 'Lima',
      biography: 'Senderista',
    }))
    expect(onSaved).toHaveBeenCalled()
  })

  it('requires a full name before saving', async () => {
    render(<ProfileEditForm user={{ ...user, fullName: '' }} />)

    fireEvent.click(screen.getByRole('button', { name: /actualizar perfil/i }))

    expect(await screen.findByText('El nombre completo es obligatorio')).toBeInTheDocument()
    expect(userService.updateUser).not.toHaveBeenCalled()
  })
})

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Input, Select, Textarea } from './Input'
import Checkbox from './Checkbox'
import RadioGroup from './Radio'

describe('Input, Select and Textarea', () => {
  it('associates the label with the input and shows an error', () => {
    render(<Input id="email" label="Email" error="Obligatorio" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Obligatorio')
  })

  it('renders a select with options', () => {
    render(
      <Select id="continent" label="Continente" defaultValue="eu">
        <option value="eu">Europa</option>
        <option value="as">Asia</option>
      </Select>
    )
    expect(screen.getByLabelText('Continente')).toHaveValue('eu')
  })

  it('renders a textarea', () => {
    render(<Textarea id="bio" label="Bio" defaultValue="Hola" />)
    expect(screen.getByLabelText('Bio').tagName).toBe('TEXTAREA')
  })
})

describe('Checkbox', () => {
  it('toggles when the label is clicked', async () => {
    const user = userEvent.setup()
    render(<Checkbox id="terms" label="Acepto las normas" />)
    const box = screen.getByLabelText('Acepto las normas')
    expect(box).not.toBeChecked()
    await user.click(box)
    expect(box).toBeChecked()
  })
})

describe('RadioGroup', () => {
  it('checks the selected option and notifies changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <RadioGroup
        legend="Dificultad"
        name="difficulty"
        value="easy"
        onChange={onChange}
        options={[
          { value: 'easy', label: 'Fácil' },
          { value: 'hard', label: 'Difícil' },
        ]}
      />
    )
    expect(screen.getByLabelText('Fácil')).toBeChecked()
    await user.click(screen.getByLabelText('Difícil'))
    expect(onChange).toHaveBeenCalled()
  })
})

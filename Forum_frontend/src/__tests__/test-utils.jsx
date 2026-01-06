import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import PropTypes from 'prop-types'
import { AuthContext } from '../contexts/AuthContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { LanguageProvider } from '../contexts/LanguageContext'

// Mock de react-hot-toast debe estar antes de importar

// Mock de window.matchMedia para tests
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

export const TestWrapper = ({ 
  children, 
  initialEntries = ['/'],
  authValue = {
    currentUser: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    hasRole: vi.fn(() => false)
  }
}) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthContext.Provider value={authValue}>
            {children}
          </AuthContext.Provider>
        </ThemeProvider>
      </LanguageProvider>
    </MemoryRouter>
  )
}

TestWrapper.propTypes = {
  children: PropTypes.node,
  initialEntries: PropTypes.arrayOf(PropTypes.string),
  authValue: PropTypes.shape({
    currentUser: PropTypes.any,
    isAuthenticated: PropTypes.bool,
    login: PropTypes.func,
    logout: PropTypes.func,
    register: PropTypes.func,
    hasRole: PropTypes.func
  })
}

export const renderWithProviders = (ui, options = {}) => {
  const { authValue, initialEntries, ...renderOptions } = options
  
  const Wrapper = ({ children }) => (
    <TestWrapper authValue={authValue} initialEntries={initialEntries}>
      {children}
    </TestWrapper>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}


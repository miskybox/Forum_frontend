import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { AuthContext } from '../contexts/AuthContext'
import { ThemeProvider } from '../contexts/ThemeContext'
import { LanguageProvider } from '../contexts/LanguageContext'

// Mock de react-hot-toast debe estar antes de importar

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

export const renderWithProviders = (ui, options = {}) => {
  const { authValue, initialEntries, ...renderOptions } = options
  
  const Wrapper = ({ children }) => (
    <TestWrapper authValue={authValue} initialEntries={initialEntries}>
      {children}
    </TestWrapper>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}


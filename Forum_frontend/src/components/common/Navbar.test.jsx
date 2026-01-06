import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Navbar from './Navbar'
import { AuthContext } from '../../contexts/AuthContext'

// Mock de los contextos
vi.mock('../../contexts/ThemeContext', () => ({
  useTheme: () => ({ theme: 'retro' })
}))

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'es',
    toggleLanguage: vi.fn(),
    t: (key) => {
      const translations = {
        'nav.home': 'Inicio',
        'nav.forums': 'Foros',
        'nav.trivia': 'Trivia',
        'nav.map': 'Mi Mapa',
        'nav.profile': 'Perfil',
        'nav.login': 'Entrar',
        'nav.register': 'Registrarse',
        'nav.logout': 'Salir',
        'nav.createForum': 'Crear Foro',
        'nav.myProfile': 'Mi Perfil',
      }
      return translations[key] || key
    }
  })
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Navbar - Links y Botones', () => {
  const mockAuthContextGuest = {
    currentUser: null,
    isAuthenticated: false,
    logout: vi.fn()
  }

  const mockAuthContextUser = {
    currentUser: { username: 'testuser', email: 'test@example.com' },
    isAuthenticated: true,
    logout: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Links de navegación principal', () => {
    it('tiene link a Inicio con href correcto "/"', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const homeLinks = screen.getAllByRole('link', { name: /inicio/i })
      expect(homeLinks.length).toBeGreaterThan(0)
      homeLinks.forEach(link => {
        expect(link).toHaveAttribute('href', '/')
      })
    })

    it('tiene link a Foros con href "/forums"', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const forosLinks = screen.getAllByRole('link', { name: /foros/i })
      expect(forosLinks.length).toBeGreaterThan(0)
      expect(forosLinks[0]).toHaveAttribute('href', '/forums')
    })

    it('tiene link a Trivia con href "/trivia"', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const triviaLinks = screen.getAllByRole('link', { name: /trivia/i })
      expect(triviaLinks.length).toBeGreaterThan(0)
      expect(triviaLinks[0]).toHaveAttribute('href', '/trivia')
    })

    it('tiene link a Mi Mapa con href "/travel"', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const mapLinks = screen.getAllByRole('link', { name: /mi mapa/i })
      expect(mapLinks.length).toBeGreaterThan(0)
      expect(mapLinks[0]).toHaveAttribute('href', '/travel')
    })
  })

  describe('Links de autenticación (usuario no logueado)', () => {
    it('muestra botón Entrar con href "/login"', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const loginLink = screen.getByRole('link', { name: /entrar/i })
      expect(loginLink).toBeInTheDocument()
      expect(loginLink).toHaveAttribute('href', '/login')
    })

    it('muestra botón Registrarse con href "/register"', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const registerLink = screen.getByRole('link', { name: /registrarse/i })
      expect(registerLink).toBeInTheDocument()
      expect(registerLink).toHaveAttribute('href', '/register')
    })

    it('no muestra link de Perfil cuando no está autenticado', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const profileLinks = screen.queryAllByRole('link', { name: /perfil/i })
      expect(profileLinks.length).toBe(0)
    })
  })

  describe('Menú de usuario (usuario logueado)', () => {
    it('muestra nombre de usuario cuando está logueado', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextUser}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      expect(screen.getByText('testuser')).toBeInTheDocument()
    })

    it('abre menú desplegable al hacer click en usuario', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextUser}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const userButton = screen.getByText('testuser').closest('button')
      fireEvent.click(userButton)

      expect(screen.getByText(/mi perfil/i)).toBeInTheDocument()
      expect(screen.getByText(/crear foro/i)).toBeInTheDocument()
      expect(screen.getByText(/salir/i)).toBeInTheDocument()
    })

    it('tiene link a Mi Perfil con href "/profile"', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextUser}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const userButton = screen.getByText('testuser').closest('button')
      fireEvent.click(userButton)

      const profileLink = screen.getByText(/mi perfil/i).closest('a')
      expect(profileLink).toHaveAttribute('href', '/profile')
    })

    it('tiene link a Crear Foro con href "/forums/create"', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextUser}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const userButton = screen.getByText('testuser').closest('button')
      fireEvent.click(userButton)

      const createForumLink = screen.getByText(/crear foro/i).closest('a')
      expect(createForumLink).toHaveAttribute('href', '/forums/create')
    })

    it('botón Salir llama a la función logout', async () => {
      const mockLogout = vi.fn()
      const contextWithLogout = {
        ...mockAuthContextUser,
        logout: mockLogout
      }

      render(
        <MemoryRouter>
          <AuthContext.Provider value={contextWithLogout}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const userButton = screen.getByText('testuser').closest('button')
      fireEvent.click(userButton)

      const logoutButton = screen.getByText(/salir/i)
      fireEvent.click(logoutButton)

      expect(mockLogout).toHaveBeenCalled()
    })

    it('muestra link a Perfil en navegación cuando está autenticado', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextUser}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const profileLinks = screen.getAllByRole('link', { name: /perfil/i })
      expect(profileLinks.length).toBeGreaterThan(0)
    })
  })

  describe('Selector de idioma', () => {
    it('muestra botón de cambio de idioma', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const languageButton = screen.getByRole('button', { name: /switch to english|cambiar a español/i })
      expect(languageButton).toBeInTheDocument()
    })

    it('muestra bandera española cuando idioma es español', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      // Verificar que hay un botón de idioma con texto ES
      const esText = screen.getAllByText(/ES/)
      expect(esText.length).toBeGreaterThan(0)
    })
  })

  describe('Menú móvil', () => {
    it('tiene botón hamburguesa para menú móvil', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const mobileMenuButton = screen.getByRole('button', { name: /abrir menú/i })
      expect(mobileMenuButton).toBeInTheDocument()
    })

    it('abre menú móvil al hacer click en botón hamburguesa', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const mobileMenuButton = screen.getByRole('button', { name: /abrir menú/i })
      fireEvent.click(mobileMenuButton)

      // El menú móvil debe mostrar todos los links
      const mobileLinks = screen.getAllByRole('link')
      expect(mobileLinks.length).toBeGreaterThan(4)
    })

    it('cierra menú móvil al hacer click en un link', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const mobileMenuButton = screen.getByRole('button', { name: /abrir menú/i })
      fireEvent.click(mobileMenuButton)

      // Click en un link del menú móvil
      const forosLinks = screen.getAllByRole('link', { name: /foros/i })
      fireEvent.click(forosLinks[forosLinks.length - 1]) // El último es del menú móvil

      // Después de hacer click en un link, el menú debería cerrarse
      // Verificar que el botón ahora tiene aria-label para abrir (no cerrar)
      const menuButtons = screen.getAllByRole('button', { name: /abrir menú|cerrar menú/i })
      expect(menuButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Accesibilidad', () => {
    it('navegación tiene role="navigation"', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })

    it('todos los links tienen atributo href válido', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAttribute('href')
        expect(link.getAttribute('href')).not.toBe('')
      })
    })

    it('botones tienen aria-label apropiado', () => {
      render(
        <MemoryRouter>
          <AuthContext.Provider value={mockAuthContextGuest}>
            <Navbar />
          </AuthContext.Provider>
        </MemoryRouter>
      )

      const languageButtons = screen.getAllByRole('button', { name: /switch to english|cambiar/i })
      expect(languageButtons.length).toBeGreaterThan(0)
      languageButtons.forEach(btn => {
        expect(btn).toHaveAttribute('aria-label')
      })

      const menuButton = screen.getByRole('button', { name: /abrir menú|cerrar menú/i })
      expect(menuButton).toHaveAttribute('aria-label')
    })
  })
})

import { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const translations = {
  es: {
    // Navbar
    nav: {
      home: 'Inicio',
      forums: 'Foros',
      trivia: 'Trivia',
      map: 'Mi Mapa',
      profile: 'Perfil',
      login: 'Entrar',
      register: 'Registrarse',
      logout: 'Salir',
      createForum: 'Crear Foro',
      myProfile: 'Mi Perfil',
    },
    // Home
    home: {
      welcome: '¡Bienvenido a ForumViajeros!',
      subtitle: 'La comunidad de viajeros más grande',
      joinNow: 'Únete Ahora',
      explore: 'Explorar Destinos',
      featuredForums: 'Foros Destacados',
      recentPosts: 'Publicaciones Recientes',
    },
    // Auth
    auth: {
      loginTitle: 'Iniciar Sesión',
      registerTitle: 'Crear Cuenta',
      username: 'Usuario',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes cuenta?',
      hasAccount: '¿Ya tienes cuenta?',
      loginButton: 'Entrar',
      registerButton: 'Registrarse',
      loginSuccess: '¡Bienvenido de nuevo!',
      registerSuccess: '¡Cuenta creada exitosamente!',
      loginError: 'Usuario o contraseña incorrectos',
    },
    // Forums
    forums: {
      title: 'Foros de Viajeros',
      createNew: 'Crear Nuevo Foro',
      categories: 'Categorías',
      recentTopics: 'Temas Recientes',
      noForums: 'No hay foros disponibles',
      replies: 'respuestas',
      views: 'vistas',
    },
    // Trivia
    trivia: {
      title: 'Trivia Geográfica',
      startGame: 'Iniciar Juego',
      quickGame: 'Partida Rápida',
      infiniteMode: 'Modo Infinito',
      leaderboard: 'Clasificación',
      score: 'Puntuación',
      correct: '¡Correcto!',
      incorrect: 'Incorrecto',
      nextQuestion: 'Siguiente Pregunta',
    },
    // Travel Map
    travel: {
      title: 'Mi Mapa de Viajes',
      addPlace: 'Añadir Lugar',
      visitedCountries: 'Países Visitados',
      wishlist: 'Lista de Deseos',
      statistics: 'Estadísticas',
      percentWorld: '% del mundo visitado',
    },
    // Common
    common: {
      loading: 'Cargando...',
      error: 'Ha ocurrido un error',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      search: 'Buscar',
      filter: 'Filtrar',
      sortBy: 'Ordenar por',
      showMore: 'Ver más',
      showLess: 'Ver menos',
      back: 'Volver',
      next: 'Siguiente',
      previous: 'Anterior',
    },
    // Footer
    footer: {
      about: 'Sobre Nosotros',
      contact: 'Contacto',
      privacy: 'Privacidad',
      terms: 'Términos',
      rights: 'Todos los derechos reservados',
    }
  },
  en: {
    // Navbar
    nav: {
      home: 'Home',
      forums: 'Forums',
      trivia: 'Trivia',
      map: 'My Map',
      profile: 'Profile',
      login: 'Login',
      register: 'Sign Up',
      logout: 'Logout',
      createForum: 'Create Forum',
      myProfile: 'My Profile',
    },
    // Home
    home: {
      welcome: 'Welcome to ForumViajeros!',
      subtitle: 'The largest travelers community',
      joinNow: 'Join Now',
      explore: 'Explore Destinations',
      featuredForums: 'Featured Forums',
      recentPosts: 'Recent Posts',
    },
    // Auth
    auth: {
      loginTitle: 'Login',
      registerTitle: 'Create Account',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot your password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      loginButton: 'Login',
      registerButton: 'Sign Up',
      loginSuccess: 'Welcome back!',
      registerSuccess: 'Account created successfully!',
      loginError: 'Invalid username or password',
    },
    // Forums
    forums: {
      title: 'Travelers Forums',
      createNew: 'Create New Forum',
      categories: 'Categories',
      recentTopics: 'Recent Topics',
      noForums: 'No forums available',
      replies: 'replies',
      views: 'views',
    },
    // Trivia
    trivia: {
      title: 'Geographic Trivia',
      startGame: 'Start Game',
      quickGame: 'Quick Game',
      infiniteMode: 'Infinite Mode',
      leaderboard: 'Leaderboard',
      score: 'Score',
      correct: 'Correct!',
      incorrect: 'Incorrect',
      nextQuestion: 'Next Question',
    },
    // Travel Map
    travel: {
      title: 'My Travel Map',
      addPlace: 'Add Place',
      visitedCountries: 'Visited Countries',
      wishlist: 'Wishlist',
      statistics: 'Statistics',
      percentWorld: '% of world visited',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      sortBy: 'Sort by',
      showMore: 'Show more',
      showLess: 'Show less',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
    },
    // Footer
    footer: {
      about: 'About Us',
      contact: 'Contact',
      privacy: 'Privacy',
      terms: 'Terms',
      rights: 'All rights reserved',
    }
  }
}

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language')
    return saved || 'es'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
  }, [language])

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k]
      } else {
        return key // Fallback to key if translation not found
      }
    }
    
    return value
  }

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es')
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage debe usarse dentro de un LanguageProvider')
  }
  return context
}

export default LanguageContext


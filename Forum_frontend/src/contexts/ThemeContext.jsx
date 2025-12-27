import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

/**
 * Contexto de temas con soporte para modo claro/oscuro
 */
export const ThemeProvider = ({ children }) => {
  const location = useLocation();
  const [theme, setTheme] = useState('retro');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Cargar preferencia guardada o usar preferencia del sistema
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Determinar tema basado en la ruta
    const path = location.pathname;

    if (path.startsWith('/forums') || path.startsWith('/posts')) {
      setTheme('adventure');
    } else if (path.startsWith('/trivia')) {
      setTheme('space');
    } else if (path.startsWith('/travel')) {
      setTheme('jungle');
    } else if (path.startsWith('/profile')) {
      setTheme('tech');
    } else if (path.startsWith('/login') || path.startsWith('/register')) {
      setTheme('space');
    } else if (path === '/') {
      setTheme('retro');
    } else {
      setTheme('retro');
    }
  }, [location.pathname]);

  useEffect(() => {
    // Aplicar clase dark al html cuando está en modo oscuro
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Guardar preferencia
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};


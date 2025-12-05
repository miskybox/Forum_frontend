import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

/**
 * Contexto de temas retro por sección
 * Cada ruta tiene su propio tema inspirado en películas de los 80s/90s
 */
export const ThemeProvider = ({ children }) => {
  const location = useLocation();
  const [theme, setTheme] = useState('retro');

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
      setTheme('retro'); // General 80s
    } else {
      setTheme('retro');
    }
  }, [location.pathname]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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


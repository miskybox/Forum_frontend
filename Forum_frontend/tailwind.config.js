/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
        display: ['Montserrat', 'Arial', 'sans-serif'],
        retro: ['Montserrat', 'Arial Black', 'sans-serif'],
      },
      colors: {
        // PALETA EXACTA DEL LOGO - Forum Viajeros
        primary: {
          DEFAULT: '#ece4d8',  // Beige claro - Fondo principal (exacto del logo)
          light: '#FFFFFF',    // Blanco puro - Tarjetas
          dark: '#e4ddce',     // Beige más oscuro - Fondos secundarios
        },

        secondary: {
          DEFAULT: '#4c7e75',  // Teal oscuro - Botones principales
          light: '#97b395',    // Verde suave - Acentos claros
          dark: '#2c4a33',     // Verde muy oscuro
        },

        accent: {
          DEFAULT: '#a56732',  // Terracota oscuro - Acentos principales
          light: '#a66936',    // Terracota medio
          dark: '#8B5A2B',     // Terracota más oscuro
        },

        text: {
          darkest: '#2c4a33',  // Verde muy oscuro - Textos importantes
          darker: '#37553b',   // Verde oscuro
          dark: '#37553b',     // Verde oscuro
          DEFAULT: '#37553b',  // Texto principal - Verde oscuro del logo
          light: '#4c7e75',    // Texto secundario - Teal
          lighter: '#6B8E6B',  // Texto terciario
        },

        // Alias para facilidad de uso
        terracota: {
          DEFAULT: '#a56732',
          light: '#a66936',
          dark: '#8B5A2B',
        },

        teal: {
          DEFAULT: '#4c7e75',
          light: '#CFE7E5',    // Nuevo - Azul verdoso claro
          dark: '#213638',     // Nuevo - Azul oscuro profundo
        },

        forest: {
          DEFAULT: '#37553b',
          light: '#4c7e75',
          dark: '#2c4a33',
        },

        // NUEVOS COLORES VIBRANTES
        golden: {
          DEFAULT: '#E5A13E',  // Amarillo/Dorado vibrante
          light: '#F0C060',
          dark: '#C8891F',
        },

        aqua: {
          DEFAULT: '#CFE7E5',  // Azul verdoso muy claro
          dark: '#213638',     // Azul oscuro profundo
        },

        midnight: {
          DEFAULT: '#213638',  // Azul muy oscuro
        },

        // Colores semánticos
        success: {
          light: '#D1FAE5',
          DEFAULT: '#047857',
          dark: '#065F46',
        },
        error: {
          light: '#fee2e2',
          DEFAULT: '#b91c1c',
          dark: '#991b1b',
        },
        warning: {
          light: '#fef3c7',
          DEFAULT: '#b45309',
          dark: '#92400e',
        },
        info: {
          light: '#dbeafe',
          DEFAULT: '#1d4ed8',
          dark: '#1e40af',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-in',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}

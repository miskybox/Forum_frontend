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
        // PALETA ÚNICA PARA TODA LA WEB - Sin modo oscuro
        primary: {
          DEFAULT: '#F6E6CB',  // Crema claro - Fondo principal
          light: '#FEFDFB',    // Casi blanco
          dark: '#E7D4B5',     // Beige claro - Fondos secundarios
        },

        secondary: {
          DEFAULT: '#B6C7AA',  // Verde suave - Acentos
          light: '#C5D4BA',    // Verde más claro
          dark: '#A0B596',     // Verde más oscuro
        },

        accent: {
          DEFAULT: '#A0937D',  // Marrón tierra - Textos y bordes
          light: '#B5A992',    // Marrón claro
          dark: '#8B7E6A',     // Marrón oscuro
        },

        text: {
          DEFAULT: '#2D2A26',  // Texto principal oscuro
          light: '#5C4A3A',    // Texto secundario
          lighter: '#8B7E6A',  // Texto terciario
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

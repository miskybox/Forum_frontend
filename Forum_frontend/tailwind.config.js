/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Habilitar dark mode con clase
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
        // VOYAGER ACCESSIBLE THEME
        // Paleta inspirada en viajes con alto contraste WCAG AAA
        // Azules profundos + Verde esmeralda + Naranjas cálidos

        primary: {
          50: '#f0f5ff',      // Fondo muy claro
          100: '#dce6f9',     // Fondo claro
          200: '#b5c9f0',     // Borde suave
          300: '#7fa0e3',     // Intermedio
          400: '#4a78d4',     // Hover activo
          500: '#1e55b3',     // Principal - Contraste 7.2:1 en blanco
          600: '#16428f',     // Más oscuro
          700: '#0f3270',     // Muy oscuro
          800: '#092352',     // Texto principal oscuro
          900: '#051638',     // Casi negro
          950: '#020b1f',     // Negro azulado
        },

        secondary: {
          50: '#edfaf6',      // Fondo muy claro
          100: '#d0f3e8',     // Fondo claro
          200: '#9fe5ce',     // Borde suave
          300: '#5dd3a9',     // Intermedio
          400: '#2eb882',     // Hover activo
          500: '#0d8a5e',     // Principal - Contraste 4.8:1 en blanco
          600: '#086e4a',     // Más oscuro - Contraste 7.1:1
          700: '#055438',     // Muy oscuro
          800: '#033c28',     // Texto oscuro
          900: '#01261a',     // Casi negro
          950: '#00140d',     // Negro verdoso
        },

        accent: {
          50: '#fff8f0',      // Fondo muy claro
          100: '#ffecd9',     // Fondo claro
          200: '#ffd7af',     // Borde suave
          300: '#ffbe7a',     // Intermedio
          400: '#ff9f3d',     // Hover activo
          500: '#e67700',     // Principal naranja - Contraste 3.1:1 (decorativo)
          600: '#b85f00',     // Más oscuro - Contraste 5.0:1
          700: '#8a4700',     // Muy oscuro - Contraste 7.5:1
          800: '#5c3000',     // Texto oscuro
          900: '#3d1f00',     // Casi negro
          950: '#1f1000',     // Negro cálido
        },

        dark: {
          DEFAULT: '#0a1628',
          lighter: '#0f2038',
          soft: '#152a48',
        },

        light: {
          DEFAULT: '#f8fafc',
          soft: '#475569',
          muted: '#64748b',
        },

        // Colores semánticos WCAG AA/AAA
        success: {
          light: '#d1fae5',   // Verde pálido
          DEFAULT: '#047857', // Verde esmeralda - Contraste 5.0:1
          dark: '#065f46',    // Verde oscuro - Contraste 7.1:1
        },
        error: {
          light: '#fee2e2',   // Rojo pálido
          DEFAULT: '#b91c1c', // Rojo oscuro - Contraste 5.9:1
          dark: '#991b1b',    // Rojo muy oscuro - Contraste 7.2:1
        },
        warning: {
          light: '#fef3c7',   // Amarillo pálido
          DEFAULT: '#b45309', // Naranja oscuro - Contraste 4.7:1
          dark: '#92400e',    // Marrón naranja - Contraste 6.2:1
        },
        info: {
          light: '#dbeafe',   // Azul pálido
          DEFAULT: '#1d4ed8', // Azul brillante - Contraste 6.1:1
          dark: '#1e40af',    // Azul oscuro - Contraste 8.0:1
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-in',
      },
      keyframes: {
        glow: {
          '0%': { 'box-shadow': '0 0 5px rgba(232, 144, 32, 0.3)' },
          '100%': { 'box-shadow': '0 0 15px rgba(232, 144, 32, 0.5), 0 0 25px rgba(232, 144, 32, 0.3)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      boxShadow: {
        'glow': '0 0 10px rgba(232, 144, 32, 0.3)',
        'glow-lg': '0 0 20px rgba(232, 144, 32, 0.4), 0 0 40px rgba(232, 144, 32, 0.2)',
      },
    },
  },
  plugins: [],
}

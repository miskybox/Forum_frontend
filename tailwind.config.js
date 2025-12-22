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
        // TEMA: Vintage Travel Map (Mapa de viajes antiguo)
        // Inspirado en mapas del siglo XIX con tonos sepia, pergamino y tintas desvanecidas

        // Colores principales: Sepia/Pergamino envejecido
        primary: {
          50: '#fdfbf7',   // Pergamino casi blanco
          100: '#f9f4eb',  // Pergamino muy claro
          200: '#f1e8d8',  // Pergamino claro
          300: '#e5d4ba',  // Beige pergamino
          400: '#d4ba97',  // Sepia claro
          500: '#c09974',  // Sepia medio ✓ Contraste AA
          600: '#a87d58',  // Sepia oscuro ✓ Contraste AAA
          700: '#8d6647',  // Marrón sepia
          800: '#735139',  // Marrón antiguo
          900: '#5e4330',  // Marrón profundo
          950: '#3a291e',  // Casi negro cálido
        },

        // Secundario: Tinta desvanecida (azul-gris vintage)
        secondary: {
          50: '#f5f7f7',
          100: '#e8eded',
          200: '#d0dada',
          300: '#b3c2c2',  // Gris azulado claro
          400: '#8da3a3',  // Tinta desvanecida
          500: '#6d8585',  // Tinta vintage ✓ Contraste AA
          600: '#566a6a',  // Azul gris oscuro ✓ Contraste AAA
          700: '#475656',  // Tinta oscura
          800: '#3c4848',
          900: '#343d3d',
          950: '#1f2626',
        },

        // Acento: Rojo oxidado/terracota (sellos antiguos, rutas marcadas)
        accent: {
          50: '#fdf6f5',
          100: '#f9ebe9',
          200: '#f3d5d1',
          300: '#eab8b0',  // Terracota claro
          400: '#dd9284',  // Coral vintage
          500: '#c8745f',  // Terracota medio ✓ Contraste AA
          600: '#a85a45',  // Rojo oxidado ✓ Contraste AAA
          700: '#8a4836',  // Ladrillo oscuro
          800: '#723d2f',
          900: '#5f362a',
          950: '#361c16',
        },

        // Fondos: Papel envejecido
        dark: {
          DEFAULT: '#2b2520',  // Marrón papel viejo
          lighter: '#3d342e',  // Marrón medio
          soft: '#524740',     // Marrón suave
        },

        // Textos: Tinta sobre pergamino
        light: {
          DEFAULT: '#fdfbf7',  // Pergamino blanco ✓ Alto contraste
          soft: '#f9f4eb',     // Beige muy claro
          muted: '#f1e8d8',    // Beige apagado
        },

        // Semantic colors (tonos vintage apagados)
        success: {
          light: '#9db89f',
          DEFAULT: '#6d8870',  // Verde oliva vintage ✓ Contraste AA
          dark: '#4f6352',     // Verde oscuro ✓ Contraste AAA
        },
        error: {
          light: '#d4918a',
          DEFAULT: '#b85850',  // Rojo teja ✓ Contraste AA
          dark: '#8d4340',     // Rojo oscuro ✓ Contraste AAA
        },
        warning: {
          light: '#d9b88f',
          DEFAULT: '#b8935f',  // Ocre dorado ✓ Contraste AA
          dark: '#8d6f47',     // Ocre oscuro ✓ Contraste AAA
        },
        info: {
          light: '#98b3b8',
          DEFAULT: '#6d8a8f',  // Azul grisáceo ✓ Contraste AA
          dark: '#526770',     // Azul petróleo ✓ Contraste AAA
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

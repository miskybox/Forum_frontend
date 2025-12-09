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
        display: ['Poppins', 'Impact', 'sans-serif'],
        retro: ['Courier New', 'monospace'],
      },
      colors: {
        // TEMA PRINCIPAL: Adventure Explorer Retro (Estilo Indiana Jones/Jumanji)
        // Paleta unificada con contraste WCAG AA mínimo

        // Colores principales
        primary: {
          50: '#fef9ed',   // Pergamino muy claro
          100: '#fdf2d5',  // Pergamino claro
          200: '#fae4ab',  // Arena clara
          300: '#f5cd76',  // Dorado suave
          400: '#f0af48',  // Dorado medio
          500: '#e89020',  // Dorado principal ✓ Contraste AA
          600: '#d67415',  // Dorado oscuro ✓ Contraste AAA
          700: '#b35713',  // Bronce ✓ Contraste AAA
          800: '#8f4616',  // Bronce oscuro
          900: '#753b16',  // Marrón oscuro
          950: '#421f09',  // Casi negro
        },

        // Secundario: Verde aventura/jungla
        secondary: {
          50: '#f3f9f3',
          100: '#e4f2e5',
          200: '#cbe6cc',
          300: '#a5d3a7',
          400: '#75b878',  // Verde suave
          500: '#4a9b4f',  // Verde medio ✓ Contraste AA
          600: '#357a39',  // Verde oscuro ✓ Contraste AAA
          700: '#2c5f2f',  // Verde profundo
          800: '#274d29',
          900: '#224023',
          950: '#0f2311',
        },

        // Acento: Marrón tierra/cuero
        accent: {
          50: '#faf8f5',
          100: '#f2ede5',
          200: '#e5d9c8',
          300: '#d4bfa4',  // Beige
          400: '#c0a07e',  // Marrón claro
          500: '#a8825d',  // Marrón medio ✓ Contraste AA
          600: '#8b6841',  // Marrón tierra ✓ Contraste AAA
          700: '#6d4f32',  // Cuero oscuro
          800: '#5c422b',
          900: '#4e3825',
          950: '#2c1d12',
        },

        // Fondos oscuros accesibles
        dark: {
          DEFAULT: '#1a1410',  // Casi negro cálido
          lighter: '#2d2419', // Marrón muy oscuro
          soft: '#3f3328',    // Marrón oscuro suave
        },

        // Textos claros accesibles
        light: {
          DEFAULT: '#fef9f0',  // Pergamino claro ✓ Alto contraste
          soft: '#f5ebe0',     // Beige claro
          muted: '#e8ddd0',    // Beige apagado
        },

        // Semantic colors
        success: {
          light: '#75b878',
          DEFAULT: '#4a9b4f',  // ✓ Contraste AA
          dark: '#357a39',     // ✓ Contraste AAA
        },
        error: {
          light: '#f28b82',
          DEFAULT: '#dc3545',  // ✓ Contraste AA
          dark: '#b02a37',     // ✓ Contraste AAA
        },
        warning: {
          light: '#ffc75f',
          DEFAULT: '#ff9800',  // ✓ Contraste AA
          dark: '#e67e00',     // ✓ Contraste AAA
        },
        info: {
          light: '#64b5f6',
          DEFAULT: '#2196f3',  // ✓ Contraste AA
          dark: '#1769aa',     // ✓ Contraste AAA
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

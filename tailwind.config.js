/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Orbitron', 'Courier New', 'monospace'],
        display: ['Bungee', 'Impact', 'Arial Black', 'sans-serif'],
        retro: ['Press Start 2P', 'Courier New', 'monospace'],
      },
      colors: {
        // Tema General Retro 80s
        neon: {
          cyan: '#00ffff',
          pink: '#ff00ff',
          green: '#39ff14',
          yellow: '#ffff00',
          orange: '#ff6600',
          purple: '#9d00ff',
        },
        // Indiana Jones - Aventura/Exploración
        adventure: {
          sand: '#d4a574',
          brown: '#8b4513',
          gold: '#ffd700',
          dark: '#2c1810',
          light: '#f4e4bc',
        },
        // Back to the Future - Futurista
        future: {
          blue: '#00bfff',
          dark: '#001122',
          neon: '#00ffff',
          purple: '#8a2be2',
          silver: '#c0c0c0',
        },
        // Jumanji - Aventura/Jungla
        jungle: {
          green: '#228b22',
          dark: '#0f5132',
          brown: '#654321',
          gold: '#daa520',
          leaf: '#90ee90',
        },
        // Stranger Things - Misterio
        mystery: {
          dark: '#0a0a0a',
          red: '#8b0000',
          blue: '#00008b',
          purple: '#4b0082',
          neon: '#ff1493',
        },
        // Terminator - Tech
        tech: {
          dark: '#1a1a1a',
          red: '#cc0000',
          orange: '#ff4500',
          silver: '#c0c0c0',
          neon: '#ff0066',
        },
        // Alien - Espacial
        space: {
          dark: '#000000',
          blue: '#000033',
          neon: '#00ffff',
          purple: '#663399',
          green: '#00ff00',
        },
        // Game of Thrones - Medieval
        medieval: {
          dark: '#1c1c1c',
          gold: '#daa520',
          red: '#8b0000',
          brown: '#654321',
          silver: '#c0c0c0',
        },
        // LOTR - Épico
        epic: {
          dark: '#2c1810',
          gold: '#ffd700',
          green: '#2d5016',
          brown: '#8b4513',
          light: '#f5deb3',
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 3s linear infinite',
        'pulse-neon': 'pulse-neon 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-in': 'slide-in 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-in',
      },
      keyframes: {
        glow: {
          '0%': { 'text-shadow': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' },
          '100%': { 'text-shadow': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'pulse-neon': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.8, filter: 'brightness(1.5)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
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
        'neon': '0 0 3px currentColor, 0 0 6px currentColor',
        'neon-lg': '0 0 5px currentColor, 0 0 10px currentColor',
      },
    },
  },
  plugins: [],
}

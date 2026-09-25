// Archivo: src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import api from './utils/api'
import './index.css'

// Despertar el backend lo antes posible (Render free tier lo duerme tras
// inactividad y el primer arranque puede tardar más de 20s). Se dispara aquí,
// antes de que monte cualquier página, para que el login o la primera
// petición de datos no sean los que tengan que esperar el cold-start desde
// cero. Best-effort: no bloquea el render ni falla si el backend tarda.
if (import.meta.env.MODE !== 'test') {
  api.get('/health', { timeout: 25000, skipRetry: true }).catch(() => {})
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
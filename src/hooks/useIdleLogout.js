import { useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from './useAuth'
import { useLanguage } from '../contexts/LanguageContext'

/** Cierre de sesión automático por inactividad */
const IDLE_TIMEOUT_MS  = 30 * 60 * 1000   // 30 minutos
const WARNING_BEFORE_MS = 2 * 60 * 1000   // aviso 2 min antes (= en el minuto 28)
const CHECK_INTERVAL_MS = 30 * 1000        // comprueba cada 30 s

export const useIdleLogout = () => {
  const { isAuthenticated, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const lastActivityRef    = useRef(Date.now())
  const warnedRef          = useRef(false)
  const warningToastIdRef  = useRef(null)
  const intervalRef        = useRef(null)

  // Reinicia el contador de inactividad ante cualquier interacción del usuario
  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now()

    if (warnedRef.current) {
      toast.dismiss(warningToastIdRef.current)
      warnedRef.current         = false
      warningToastIdRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      // Limpiar si el usuario ya cerró sesión manualmente
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      warnedRef.current = false
      return
    }

    // Reiniciar la referencia al autenticarse
    lastActivityRef.current = Date.now()
    warnedRef.current       = false

    const EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    EVENTS.forEach(ev => window.addEventListener(ev, resetActivity, { passive: true }))

    intervalRef.current = setInterval(async () => {
      const idleMs = Date.now() - lastActivityRef.current

      if (idleMs >= IDLE_TIMEOUT_MS) {
        // Tiempo agotado → cerrar sesión
        clearInterval(intervalRef.current)
        intervalRef.current = null
        toast.dismiss()

        await logout()
        navigate('/login', { replace: true })

        toast(t('auth.sessionExpiredIdle'), {
          duration: 6000,
          icon: '🔒',
          style: {
            background: '#213638',
            color: '#ece4d8',
            border: '2px solid #E5A13E',
            fontWeight: '600',
          },
        })

      } else if (idleMs >= IDLE_TIMEOUT_MS - WARNING_BEFORE_MS && !warnedRef.current) {
        // Advertencia previa (minuto 28)
        warnedRef.current = true
        warningToastIdRef.current = toast(t('auth.sessionExpiringWarning'), {
          duration: WARNING_BEFORE_MS,
          icon: '⚠️',
          style: {
            background: '#a56732',
            color: '#ffffff',
            border: '2px solid #8B5A2B',
            fontWeight: '600',
          },
        })
      }
    }, CHECK_INTERVAL_MS)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      EVENTS.forEach(ev => window.removeEventListener(ev, resetActivity))
    }
  }, [isAuthenticated, logout, navigate, resetActivity, t])
}

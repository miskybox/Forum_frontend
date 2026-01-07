import { useState, useEffect } from 'react'

/**
 * Componente de depuración para verificar localStorage
 * Solo se muestra en desarrollo
 */
const LocalStorageDebug = () => {
  const [storageData, setStorageData] = useState({})
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const updateStorage = () => {
      const data = {
        token: localStorage.getItem('token'),
        refreshToken: localStorage.getItem('refreshToken'),
        hasToken: !!localStorage.getItem('token'),
        tokenLength: localStorage.getItem('token')?.length || 0,
      }
      setStorageData(data)
    }

    updateStorage()

    // Actualizar cada segundo
    const interval = setInterval(updateStorage, 1000)

    return () => clearInterval(interval)
  }, [])

  // Solo mostrar en desarrollo
  if (import.meta.env.PROD) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-accent text-white px-4 py-2 rounded-lg shadow-lg font-bold text-sm"
      >
        🔍 Debug Storage
      </button>

      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-primary-light border-2 border-accent rounded-lg p-4 shadow-xl w-96 max-h-96 overflow-auto">
          <h3 className="text-lg font-bold text-text mb-4">LocalStorage Status</h3>

          <div className="space-y-3 text-sm">
            <div className="border-b border-accent pb-2">
              <span className="font-bold text-text">Has Token:</span>{' '}
              <span className={storageData.hasToken ? 'text-success' : 'text-error'}>
                {storageData.hasToken ? '✅ YES' : '❌ NO'}
              </span>
            </div>

            <div className="border-b border-accent pb-2">
              <span className="font-bold text-text">Token Length:</span>{' '}
              <span className="text-text-light">{storageData.tokenLength} chars</span>
            </div>

            <div className="border-b border-accent pb-2">
              <span className="font-bold text-text">Access Token:</span>
              <div className="mt-1 p-2 bg-primary rounded text-xs break-all text-text-lighter font-mono">
                {storageData.token ? storageData.token.substring(0, 50) + '...' : 'NULL'}
              </div>
            </div>

            <div className="border-b border-accent pb-2">
              <span className="font-bold text-text">Refresh Token:</span>
              <div className="mt-1 p-2 bg-primary rounded text-xs break-all text-text-lighter font-mono">
                {storageData.refreshToken ? storageData.refreshToken.substring(0, 50) + '...' : 'NULL'}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  localStorage.removeItem('refreshToken')
                  alert('Tokens removed from localStorage')
                }}
                className="w-full bg-error text-white px-3 py-2 rounded font-bold text-xs"
              >
                🗑️ Clear Tokens
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LocalStorageDebug

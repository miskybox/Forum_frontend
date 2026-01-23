import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import notificationService from '../../services/notificationService'

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await notificationService.getNotifications()
      setNotifications(data)
    } catch (err) {
      console.error('Error loading notifications:', err)
      setError('Error al cargar las notificaciones')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, leido: true } : n)
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev =>
        prev.map(n => ({ ...n, leido: true }))
      )
    } catch (err) {
      console.error('Error marking all as read:', err)
    }
  }

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'LIKE':
        return (
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        )
      case 'COMMENT':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        )
      case 'FOLLOW':
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
        )
      case 'MESSAGE':
        return (
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        )
      case 'SHARE':
        return (
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        )
    }
  }

  const getNotificationMessage = (notification) => {
    switch (notification.tipo) {
      case 'LIKE':
        return 'le ha dado me gusta a tu publicacion'
      case 'COMMENT':
        return 'ha comentado en tu publicacion'
      case 'FOLLOW':
        return 'ha comenzado a seguirte'
      case 'MESSAGE':
        return 'te ha enviado un mensaje'
      case 'SHARE':
        return 'ha compartido tu publicacion'
      default:
        return 'Nueva notificacion'
    }
  }

  const getNotificationLink = (notification) => {
    switch (notification.tipo) {
      case 'LIKE':
      case 'COMMENT':
      case 'SHARE':
        return `/posts/${notification.referenciaId}`
      case 'FOLLOW':
        return `/profile/${notification.referenciaId}`
      case 'MESSAGE':
        return `/messages/${notification.referenciaId}`
      default:
        return '#'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'Ahora mismo'
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} min`
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} h`
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} d`
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  const unreadCount = notifications.filter(n => !n.leido).length

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-beige rounded w-48 mb-6"></div>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white rounded-lg p-4 mb-3 border border-beige-dark">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-beige rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-beige rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-beige rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest flex items-center gap-2">
            Notificaciones
            {unreadCount > 0 && (
              <span className="bg-terracota text-white text-sm px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-forest/70 mt-1">Mantente al dia con tu actividad</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-teal hover:text-teal/80 font-medium text-sm transition-colors"
          >
            Marcar todas como leidas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-beige-dark">
          <div className="text-6xl mb-4">🔔</div>
          <p className="text-lg text-forest/70 mb-2">No tienes notificaciones</p>
          <p className="text-forest/50">Las notificaciones apareceran aqui cuando otros interactuen contigo</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-beige-dark">
          {notifications.map((notification, index) => (
            <Link
              key={notification.id}
              to={getNotificationLink(notification)}
              onClick={() => !notification.leido && handleMarkAsRead(notification.id)}
              className={`flex items-start gap-4 p-4 hover:bg-beige/30 transition-colors ${
                index !== notifications.length - 1 ? 'border-b border-beige-dark' : ''
              } ${!notification.leido ? 'bg-blue-50/50' : ''}`}
            >
              {getNotificationIcon(notification.tipo)}
              <div className="flex-1 min-w-0">
                <p className={`text-forest ${!notification.leido ? 'font-semibold' : ''}`}>
                  {getNotificationMessage(notification)}
                </p>
                <p className="text-sm text-forest/60 mt-1">
                  {formatDate(notification.fecha)}
                </p>
              </div>
              {!notification.leido && (
                <div className="w-2 h-2 bg-teal rounded-full mt-2 flex-shrink-0"></div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationsPage

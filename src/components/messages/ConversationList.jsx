import React, { useState, useEffect } from 'react'
import messageService from '../../services/messageService'
import LoadingSpinner from '../common/LoadingSpinner'

const ConversationList = ({ onSelectConversation, selectedUserId }) => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setLoading(true)
      const data = await messageService.getConversations()
      setConversations(data)
    } catch (err) {
      setError('Error al cargar conversaciones')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-terracota">
        {error}
        <button
          onClick={loadConversations}
          className="block mx-auto mt-4 text-teal hover:underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💬</div>
        <h3 className="text-lg font-semibold text-forest mb-2">
          Sin conversaciones
        </h3>
        <p className="text-forest/70">
          Inicia una conversacion con otro viajero
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-beige-dark">
      {conversations.map((conv) => (
        <div
          key={conv.participantId}
          onClick={() => onSelectConversation(conv.participantId)}
          className={`p-4 cursor-pointer transition-colors hover:bg-beige-dark/50 ${
            selectedUserId === conv.participantId ? 'bg-aqua/30' : ''
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="relative">
              <img
                src={conv.participantAvatarUrl || '/default-avatar.png'}
                alt={conv.participantUsername}
                className="w-12 h-12 rounded-full object-cover border-2 border-teal"
              />
              {conv.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracota text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`font-semibold truncate ${conv.unreadCount > 0 ? 'text-forest' : 'text-forest/80'}`}>
                  {conv.participantUsername}
                </span>
                <span className="text-xs text-forest/60 flex-shrink-0 ml-2">
                  {formatDate(conv.lastMessageAt)}
                </span>
              </div>
              <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'text-forest font-medium' : 'text-forest/70'}`}>
                {conv.isLastMessageMine && <span className="text-teal">Tu: </span>}
                {conv.lastMessage}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ConversationList

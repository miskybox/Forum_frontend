import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ConversationList from '../../components/messages/ConversationList'
import ChatWindow from '../../components/messages/ChatWindow'
import NewConversationModal from '../../components/messages/NewConversationModal'
import messageService from '../../services/messageService'

const MessagesPage = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [selectedUserId, setSelectedUserId] = useState(userId ? parseInt(userId) : null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNewConversation, setShowNewConversation] = useState(false)

  useEffect(() => {
    loadUnreadCount()
  }, [])

  useEffect(() => {
    if (userId) {
      setSelectedUserId(parseInt(userId))
    }
  }, [userId])

  const loadUnreadCount = async () => {
    try {
      const count = await messageService.getUnreadCount()
      setUnreadCount(count)
    } catch (err) {
      console.error('Error loading unread count:', err)
    }
  }

  const handleSelectConversation = (userId) => {
    setSelectedUserId(userId)
    navigate(`/messages/${userId}`)
    loadUnreadCount()
  }

  const handleBack = () => {
    setSelectedUserId(null)
    navigate('/messages')
  }

  const handleNewConversation = (userId) => {
    setSelectedUserId(userId)
    navigate(`/messages/${userId}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest flex items-center gap-2">
            Mensajes
            {unreadCount > 0 && (
              <span className="bg-terracota text-white text-sm px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-forest/70 mt-1">Conversaciones privadas con otros viajeros</p>
        </div>
        <button
          onClick={() => setShowNewConversation(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Nueva conversacion</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-beige-dark">
        <div className="flex h-[calc(100vh-14rem)] min-h-[500px]">
          {/* Conversations sidebar */}
          <div className={`w-full lg:w-80 border-r border-beige-dark overflow-y-auto ${
            selectedUserId ? 'hidden lg:block' : 'block'
          }`}>
            <div className="p-4 border-b border-beige-dark bg-beige/30 flex items-center justify-between">
              <h2 className="font-semibold text-forest">Conversaciones</h2>
              <button
                onClick={() => setShowNewConversation(true)}
                className="lg:hidden p-2 text-teal hover:bg-beige rounded-full transition-colors"
                aria-label="Nueva conversacion"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <ConversationList
              onSelectConversation={handleSelectConversation}
              selectedUserId={selectedUserId}
            />
          </div>

          {/* Chat window */}
          <div className={`flex-1 ${selectedUserId ? 'block' : 'hidden lg:flex lg:items-center lg:justify-center'}`}>
            {selectedUserId ? (
              <ChatWindow userId={selectedUserId} onBack={handleBack} />
            ) : (
              <div className="text-center text-forest/60 p-8">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg mb-4">Selecciona una conversacion</p>
                <button
                  onClick={() => setShowNewConversation(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Iniciar nueva conversacion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewConversationModal
        isOpen={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        onSelectUser={handleNewConversation}
      />
    </div>
  )
}

export default MessagesPage

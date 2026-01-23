import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import userService from '../../services/userService'
import messageService from '../../services/messageService'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'

const ShareToUserModal = ({ isOpen, onClose, shareContent }) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('recent')
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      loadRecentConversations()
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
    if (!isOpen) {
      setSearchQuery('')
      setUsers([])
      setError(null)
      setActiveTab('recent')
    }
  }, [isOpen])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (searchQuery.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        searchUsers(searchQuery.trim())
      }, 300)
    } else {
      setUsers([])
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery])

  const loadRecentConversations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await messageService.getConversations()
      setConversations(data.slice(0, 10))
    } catch (err) {
      console.error('Error loading conversations:', err)
      setError('Error al cargar conversaciones')
    } finally {
      setLoading(false)
    }
  }

  const searchUsers = async (query) => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.searchUsers(query, 0, 10)
      setUsers(data.content || [])
    } catch (err) {
      console.error('Error searching users:', err)
      setError('Error al buscar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleSendToUser = async (userId, username) => {
    try {
      setSending(true)
      const message = `Mira esta publicacion: ${shareContent.title}\n${shareContent.url}`
      await messageService.sendMessage(userId, message)
      toast.success(`Contenido compartido con ${username}`)
      onClose()
      navigate(`/messages/${userId}`)
    } catch (err) {
      console.error('Error sending share:', err)
      toast.error('Error al compartir')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen || !shareContent) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-beige-dark">
          <h2 className="text-lg font-semibold text-forest">Compartir publicacion</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-beige rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <svg className="w-5 h-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview of shared content */}
        <div className="p-4 bg-beige/30 border-b border-beige-dark">
          <p className="text-sm text-forest/70 mb-1">Compartiendo:</p>
          <p className="font-medium text-forest truncate">{shareContent.title}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-beige-dark">
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === 'recent'
                ? 'text-teal border-b-2 border-teal'
                : 'text-forest/70 hover:text-forest'
            }`}
          >
            Recientes
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-teal border-b-2 border-teal'
                : 'text-forest/70 hover:text-forest'
            }`}
          >
            Buscar
          </button>
        </div>

        {/* Search input (only in search tab) */}
        {activeTab === 'search' && (
          <div className="p-4 border-b border-beige-dark">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-forest/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar usuario..."
                className="w-full pl-10 pr-4 py-2 border border-beige-dark rounded-lg focus:outline-none focus:border-teal bg-beige/30"
              />
            </div>
          </div>
        )}

        {/* Users/Conversations list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-terracota">
              {error}
            </div>
          ) : activeTab === 'recent' ? (
            conversations.length === 0 ? (
              <div className="text-center py-12 text-forest/60">
                <p>No hay conversaciones recientes</p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="text-teal hover:underline mt-2"
                >
                  Buscar usuarios
                </button>
              </div>
            ) : (
              <div className="divide-y divide-beige-dark">
                {conversations.map((conv) => (
                  <button
                    key={conv.participantId}
                    onClick={() => handleSendToUser(conv.participantId, conv.participantUsername)}
                    disabled={sending}
                    className="w-full p-4 flex items-center gap-3 hover:bg-beige-dark/50 transition-colors text-left disabled:opacity-50"
                  >
                    <img
                      src={conv.participantAvatarUrl || '/default-avatar.png'}
                      alt={conv.participantUsername}
                      className="w-12 h-12 rounded-full object-cover border-2 border-teal"
                    />
                    <span className="font-semibold text-forest flex-1 truncate">
                      {conv.participantUsername}
                    </span>
                    <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                ))}
              </div>
            )
          ) : searchQuery.trim().length < 2 ? (
            <div className="text-center py-12 text-forest/60">
              <p>Escribe al menos 2 caracteres para buscar</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-forest/60">
              <div className="text-4xl mb-2">🔍</div>
              <p>No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="divide-y divide-beige-dark">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSendToUser(user.id, user.username)}
                  disabled={sending}
                  className="w-full p-4 flex items-center gap-3 hover:bg-beige-dark/50 transition-colors text-left disabled:opacity-50"
                >
                  <img
                    src={user.avatarUrl || '/default-avatar.png'}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-teal"
                  />
                  <span className="font-semibold text-forest flex-1 truncate">
                    {user.username}
                  </span>
                  <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShareToUserModal

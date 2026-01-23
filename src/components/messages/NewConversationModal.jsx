import React, { useState, useEffect, useRef } from 'react'
import userService from '../../services/userService'
import LoadingSpinner from '../common/LoadingSpinner'

const NewConversationModal = ({ isOpen, onClose, onSelectUser }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!isOpen) {
      setSearchQuery('')
      setUsers([])
      setError(null)
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
    } else if (searchQuery.trim().length === 0) {
      loadRecentUsers()
    } else {
      setUsers([])
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery])

  const loadRecentUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getAllUsers(0, 10)
      setUsers(data.content || [])
    } catch (err) {
      console.error('Error loading users:', err)
      setError('Error al cargar usuarios')
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

  const handleSelectUser = (user) => {
    onSelectUser(user.id)
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

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
          <h2 className="text-lg font-semibold text-forest">Nueva conversacion</h2>
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

        {/* Search input */}
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
              placeholder="Buscar usuario por nombre..."
              className="w-full pl-10 pr-4 py-2 border border-beige-dark rounded-lg focus:outline-none focus:border-teal bg-beige/30"
            />
          </div>
          <p className="text-xs text-forest/60 mt-2">
            {searchQuery.trim().length === 0
              ? 'Usuarios sugeridos'
              : searchQuery.trim().length < 2
                ? 'Escribe al menos 2 caracteres para buscar'
                : `Resultados para "${searchQuery}"`}
          </p>
        </div>

        {/* Users list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-terracota">
              {error}
              <button
                onClick={loadRecentUsers}
                className="block mx-auto mt-2 text-teal hover:underline text-sm"
              >
                Reintentar
              </button>
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
                  onClick={() => handleSelectUser(user)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-beige-dark/50 transition-colors text-left"
                >
                  <img
                    src={user.avatarUrl || '/default-avatar.png'}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-teal"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-forest block truncate">
                      {user.username}
                    </span>
                    {user.bio && (
                      <p className="text-sm text-forest/70 truncate">{user.bio}</p>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-teal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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

export default NewConversationModal

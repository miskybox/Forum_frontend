import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import messageService from '../../services/messageService'
import LoadingSpinner from '../common/LoadingSpinner'
import toast from 'react-hot-toast'

const ChatWindow = ({ userId, onBack }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [participant, setParticipant] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (userId) {
      loadMessages()
      markAsRead()
    }
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await messageService.getConversation(userId)
      setMessages(data)
      if (data.length > 0) {
        const firstMsg = data[0]
        const other = firstMsg.isMine
          ? { id: firstMsg.recipientId, username: firstMsg.recipientUsername, avatarUrl: firstMsg.recipientAvatarUrl }
          : { id: firstMsg.senderId, username: firstMsg.senderUsername, avatarUrl: firstMsg.senderAvatarUrl }
        setParticipant(other)
      }
    } catch (err) {
      console.error('Error loading messages:', err)
      toast.error('Error al cargar mensajes')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async () => {
    try {
      await messageService.markConversationAsRead(userId)
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      const sent = await messageService.sendMessage(userId, newMessage.trim())
      setMessages(prev => [...prev, sent])
      setNewMessage('')
      inputRef.current?.focus()
    } catch (err) {
      console.error('Error sending message:', err)
      toast.error('Error al enviar mensaje')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async (messageId) => {
    if (!confirm('Eliminar este mensaje?')) return
    try {
      await messageService.deleteMessage(messageId)
      setMessages(prev => prev.filter(m => m.id !== messageId))
      toast.success('Mensaje eliminado')
    } catch (err) {
      console.error('Error deleting message:', err)
      toast.error('Error al eliminar mensaje')
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Hoy'
    if (date.toDateString() === yesterday.toDateString()) return 'Ayer'
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const groupMessagesByDate = (msgs) => {
    const groups = {}
    msgs.forEach(msg => {
      const dateKey = new Date(msg.sentAt).toDateString()
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(msg)
    })
    return groups
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  const groupedMessages = groupMessagesByDate(messages)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-beige-dark bg-white">
        <button
          onClick={onBack}
          className="lg:hidden p-2 hover:bg-beige rounded-full transition-colors"
          aria-label="Volver"
        >
          <svg className="w-5 h-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {participant && (
          <Link to={`/profile/${participant.id}`} className="flex items-center gap-3 hover:opacity-80">
            <img
              src={participant.avatarUrl || '/default-avatar.png'}
              alt={participant.username}
              className="w-10 h-10 rounded-full object-cover border-2 border-teal"
            />
            <span className="font-semibold text-forest">{participant.username}</span>
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-beige/30">
        {Object.entries(groupedMessages).map(([dateKey, msgs]) => (
          <div key={dateKey}>
            <div className="flex justify-center mb-4">
              <span className="px-3 py-1 bg-beige-dark text-forest/70 text-xs rounded-full">
                {formatDate(msgs[0].sentAt)}
              </span>
            </div>
            <div className="space-y-2">
              {msgs.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`group relative max-w-[75%] px-4 py-2 rounded-2xl ${
                      msg.isMine
                        ? 'bg-teal text-white rounded-br-md'
                        : 'bg-white text-forest rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="break-words">{msg.content}</p>
                    <div className={`flex items-center gap-1 mt-1 text-xs ${msg.isMine ? 'text-white/70' : 'text-forest/50'}`}>
                      <span>{formatTime(msg.sentAt)}</span>
                      {msg.isMine && msg.isRead && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    {msg.isMine && (
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-terracota hover:text-terracota/80 transition-opacity"
                        aria-label="Eliminar mensaje"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-beige-dark bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 px-4 py-2 border border-beige-dark rounded-full focus:outline-none focus:border-teal bg-beige/30"
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-teal text-white rounded-full hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Enviar mensaje"
          >
            {sending ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatWindow

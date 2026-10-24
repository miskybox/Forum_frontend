import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { MdArrowBack, MdCheck, MdDelete, MdSend } from 'react-icons/md'
import messageService from '../../services/messageService'
import { useLanguage } from '../../contexts/LanguageContext'
import LoadingSpinner from '../common/LoadingSpinner'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import ConfirmDialog from '../dashboard/ConfirmDialog'
import toast from 'react-hot-toast'

const ChatWindow = ({ userId, onBack }) => {
  const { t } = useLanguage()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [participant, setParticipant] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (userId) {
      loadMessages()
      markAsRead()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
      toast.error(t('messages.loadError'))
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

  const handleSend = async (event) => {
    event.preventDefault()
    if (!newMessage.trim() || sending) return

    try {
      setSending(true)
      const sent = await messageService.sendMessage(userId, newMessage.trim())
      setMessages((prev) => [...prev, sent])
      setNewMessage('')
      inputRef.current?.focus()
    } catch (err) {
      console.error('Error sending message:', err)
      toast.error(t('messages.errorSending'))
    } finally {
      setSending(false)
    }
  }

  const confirmDelete = async () => {
    const messageId = pendingDelete
    setPendingDelete(null)
    try {
      await messageService.deleteMessage(messageId)
      setMessages((prev) => prev.filter((message) => message.id !== messageId))
      toast.success(t('messages.deleted'))
    } catch (err) {
      console.error('Error deleting message:', err)
      toast.error(t('messages.deleteError'))
    }
  }

  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (date.toDateString() === today.toDateString()) return t('messages.today')
    if (date.toDateString() === yesterday.toDateString()) return t('messages.yesterday')
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const groupMessagesByDate = (msgs) => {
    const groups = {}
    msgs.forEach((msg) => {
      const dateKey = new Date(msg.sentAt).toDateString()
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(msg)
    })
    return groups
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner label={t('common.loading')} />
      </div>
    )
  }

  const groupedMessages = groupMessagesByDate(messages)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-space-sm p-space-md border-b border-outline-variant/40 bg-surface-container-lowest">
        <Button variant="icon" className="lg:hidden" onClick={onBack} aria-label={t('messages.back')} icon={MdArrowBack} />
        {participant && (
          <Link to={`/profile/${participant.id}`} className="flex items-center gap-space-sm min-w-0">
            <Avatar name={participant.username} src={participant.avatarUrl} size="md" />
            <span className="font-semibold text-on-surface truncate">{participant.username}</span>
          </Link>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-space-md space-y-space-md bg-surface-container-low/30">
        {Object.entries(groupedMessages).map(([dateKey, msgs]) => (
          <div key={dateKey}>
            <div className="flex justify-center mb-space-sm">
              <span className="px-3 py-1 bg-surface-container text-on-surface-variant text-caption rounded-full">
                {formatDate(msgs[0].sentAt)}
              </span>
            </div>
            <div className="space-y-space-xs">
              {msgs.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`group relative max-w-[75%] px-space-md py-space-sm ${
                      msg.isMine
                        ? 'bg-secondary text-on-secondary rounded-lg rounded-br-sm'
                        : 'bg-surface-container-lowest text-on-surface rounded-lg rounded-bl-sm shadow-level-1'
                    }`}
                  >
                    <p className="break-words text-body-md">{msg.content}</p>
                    <div className={`flex items-center gap-1 mt-1 text-caption ${msg.isMine ? 'text-on-secondary/70' : 'text-on-surface-variant'}`}>
                      <span>{formatTime(msg.sentAt)}</span>
                      {msg.isMine && msg.isRead && <MdCheck aria-hidden="true" />}
                    </div>
                    {msg.isMine && (
                      <button
                        type="button"
                        onClick={() => setPendingDelete(msg.id)}
                        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-error"
                        aria-label={t('messages.deleteMessage')}
                      >
                        <MdDelete aria-hidden="true" />
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

      <form onSubmit={handleSend} className="p-space-md border-t border-outline-variant/40 bg-surface-container-lowest">
        <div className="flex items-center gap-space-sm">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            placeholder={t('messages.typeMessage')}
            className="flex-1 bg-surface-container-low"
            maxLength={2000}
          />
          <Button
            type="submit"
            variant="icon"
            disabled={!newMessage.trim() || sending}
            aria-label={t('messages.sendMessage')}
            icon={MdSend}
            loading={sending}
          />
        </div>
      </form>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={t('messages.deleteMessage')}
        message={t('messages.deleteConfirm')}
        confirmLabel={t('admin.confirm') || t('messages.send')}
        cancelLabel={t('messages.close')}
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}

ChatWindow.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBack: PropTypes.func,
}

export default ChatWindow

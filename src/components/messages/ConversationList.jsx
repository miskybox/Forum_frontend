import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { MdChatBubbleOutline } from 'react-icons/md'
import messageService from '../../services/messageService'
import { useLanguage } from '../../contexts/LanguageContext'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../ui/EmptyState'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'

const ConversationList = ({ onSelectConversation, selectedUserId }) => {
  const { t } = useLanguage()
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
      setError(t('messages.loadConversationsError'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const diffMs = Date.now() - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)
    if (diffMins < 1) return t('notifications.justNow')
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
  }

  if (loading) {
    return <LoadingSpinner label={t('common.loading')} />
  }

  if (error) {
    return (
      <EmptyState
        title={error}
        action={<Button variant="ghost" onClick={loadConversations}>{t('messages.retry')}</Button>}
      />
    )
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MdChatBubbleOutline}
        title={t('messages.noConversations')}
        description={t('messages.noConversationsHint')}
      />
    )
  }

  return (
    <ul>
      {conversations.map((conv) => (
        <li key={conv.participantId}>
          <button
            type="button"
            onClick={() => onSelectConversation(conv.participantId)}
            className={`w-full p-space-md text-left transition-colors hover:bg-surface-container-low ${
              selectedUserId === conv.participantId ? 'bg-secondary-container/30' : ''
            }`}
          >
            <span className="flex items-start gap-space-sm">
              <span className="relative">
                <Avatar name={conv.participantUsername} src={conv.participantAvatarUrl} size="lg" />
                {conv.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-caption font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                  </span>
                )}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center justify-between gap-space-xs mb-1">
                  <span className={`font-semibold truncate ${conv.unreadCount > 0 ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {conv.participantUsername}
                  </span>
                  <span className="text-caption text-on-surface-variant flex-shrink-0">
                    {formatDate(conv.lastMessageAt)}
                  </span>
                </span>
                <span className={`block text-body-sm truncate ${conv.unreadCount > 0 ? 'text-on-surface font-medium' : 'text-on-surface-variant'}`}>
                  {conv.isLastMessageMine && t('messages.youPrefix')}
                  {conv.lastMessage}
                </span>
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

ConversationList.propTypes = {
  onSelectConversation: PropTypes.func.isRequired,
  selectedUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default ConversationList

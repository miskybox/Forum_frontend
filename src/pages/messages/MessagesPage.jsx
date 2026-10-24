import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MdAdd, MdChatBubbleOutline } from 'react-icons/md'
import ConversationList from '../../components/messages/ConversationList'
import ChatWindow from '../../components/messages/ChatWindow'
import NewConversationModal from '../../components/messages/NewConversationModal'
import messageService from '../../services/messageService'
import { useLanguage } from '../../contexts/LanguageContext'
import PageContainer from '../../components/ui/PageContainer'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'

const MessagesPage = () => {
  const { t } = useLanguage()
  const { userId } = useParams()
  const navigate = useNavigate()
  const [selectedUserId, setSelectedUserId] = useState(userId ? parseInt(userId, 10) : null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNewConversation, setShowNewConversation] = useState(false)

  useEffect(() => {
    loadUnreadCount()
  }, [])

  useEffect(() => {
    if (userId) setSelectedUserId(parseInt(userId, 10))
  }, [userId])

  const loadUnreadCount = async () => {
    try {
      const count = await messageService.getUnreadCount()
      setUnreadCount(count)
    } catch (err) {
      console.error('Error loading unread count:', err)
    }
  }

  const handleSelectConversation = (id) => {
    setSelectedUserId(id)
    navigate(`/messages/${id}`)
    loadUnreadCount()
  }

  const handleBack = () => {
    setSelectedUserId(null)
    navigate('/messages')
  }

  const handleNewConversation = (id) => {
    setSelectedUserId(id)
    navigate(`/messages/${id}`)
  }

  return (
    <PageContainer className="py-margin space-y-space-lg">
      <header className="flex items-center justify-between gap-space-sm">
        <div>
          <h1 className="font-headline text-headline-lg text-on-surface flex items-center gap-space-sm">
            {t('messages.title')}
            {unreadCount > 0 && (
              <span className="bg-primary text-on-primary text-label-md px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="mt-space-xs text-body-md text-on-surface-variant">{t('messages.subtitle')}</p>
        </div>
        <Button onClick={() => setShowNewConversation(true)} icon={MdAdd}>
          {t('messages.newConversation')}
        </Button>
      </header>

      <div className="bg-surface-container-lowest rounded-lg shadow-level-1 overflow-hidden">
        <div className="flex h-[calc(100vh-14rem)] min-h-[500px]">
          <div className={`w-full lg:w-80 border-r border-outline-variant/40 overflow-y-auto ${selectedUserId ? 'hidden lg:block' : 'block'}`}>
            <div className="p-space-md border-b border-outline-variant/40 flex items-center justify-between">
              <h2 className="font-semibold text-on-surface">{t('messages.conversations')}</h2>
              <Button
                variant="icon"
                className="lg:hidden"
                onClick={() => setShowNewConversation(true)}
                aria-label={t('messages.newConversation')}
                icon={MdAdd}
              />
            </div>
            <ConversationList
              onSelectConversation={handleSelectConversation}
              selectedUserId={selectedUserId}
            />
          </div>

          <div className={`flex-1 ${selectedUserId ? 'block' : 'hidden lg:flex lg:items-center lg:justify-center'}`}>
            {selectedUserId ? (
              <ChatWindow userId={selectedUserId} onBack={handleBack} />
            ) : (
              <EmptyState
                icon={MdChatBubbleOutline}
                title={t('messages.selectConversation')}
                action={
                  <Button onClick={() => setShowNewConversation(true)} icon={MdAdd}>
                    {t('messages.startNew')}
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </div>

      <NewConversationModal
        isOpen={showNewConversation}
        onClose={() => setShowNewConversation(false)}
        onSelectUser={handleNewConversation}
      />
    </PageContainer>
  )
}

export default MessagesPage

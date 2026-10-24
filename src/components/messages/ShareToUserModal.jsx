import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { MdClose, MdSearch, MdSend } from 'react-icons/md'
import userService from '../../services/userService'
import messageService from '../../services/messageService'
import { useLanguage } from '../../contexts/LanguageContext'
import LoadingSpinner from '../common/LoadingSpinner'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import EmptyState from '../ui/EmptyState'
import SegmentedTabs from '../ui/SegmentedTabs'
import { Input } from '../ui/Input'
import toast from 'react-hot-toast'

const ShareToUserModal = ({ isOpen, onClose, shareContent }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState([])
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('recent')
  const debounceRef = useRef(null)

  useEffect(() => {
    if (isOpen) loadRecentConversations()
    if (!isOpen) {
      setSearchQuery('')
      setUsers([])
      setError(null)
      setActiveTab('recent')
    }
  }, [isOpen])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (searchQuery.trim().length >= 2) {
      debounceRef.current = setTimeout(() => searchUsers(searchQuery.trim()), 300)
    } else {
      setUsers([])
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
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
      setError(t('messages.loadConversationsError'))
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
      setError(t('messages.searchError'))
    } finally {
      setLoading(false)
    }
  }

  const handleSendToUser = async (userId, username) => {
    try {
      setSending(true)
      const message = `Mira esta publicacion: ${shareContent.title}\n${shareContent.url}`
      await messageService.sendMessage(userId, message)
      toast.success(`${t('messages.sharedWith')} ${username}`)
      onClose()
      navigate(`/messages/${userId}`)
    } catch (err) {
      console.error('Error sending share:', err)
      toast.error(t('messages.shareError'))
    } finally {
      setSending(false)
    }
  }

  if (!isOpen || !shareContent) return null

  const tabs = [
    { id: 'recent', label: t('messages.recent') },
    { id: 'search', label: t('messages.search') },
  ]

  return (
    <Modal title={t('messages.shareTitle')} onClose={onClose} size="md">
      <div className="absolute top-3 right-3">
        <Button variant="icon" aria-label={t('messages.close')} onClick={onClose} icon={MdClose} />
      </div>
      <div className="mt-space-md space-y-space-sm max-h-[60vh] flex flex-col">
        <p className="text-body-sm text-on-surface-variant">{t('messages.sharing')}</p>
        <p className="font-medium text-on-surface truncate">{shareContent.title}</p>
        <SegmentedTabs
          tabs={tabs}
          activeId={activeTab}
          onChange={setActiveTab}
          idPrefix="share"
          label={t('messages.shareTitle')}
        />
        {activeTab === 'search' && (
          <Input
            id="share-user-search"
            label={t('messages.searchUsers')}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={t('messages.searchUser')}
          />
        )}
        <div className="flex-1 overflow-y-auto min-h-[12rem]">
          {loading ? (
            <LoadingSpinner label={t('common.loading')} />
          ) : error ? (
            <p className="text-center py-8 text-error">{error}</p>
          ) : activeTab === 'recent' ? (
            conversations.length === 0 ? (
              <EmptyState
                title={t('messages.noRecent')}
                action={<Button variant="ghost" onClick={() => setActiveTab('search')}>{t('messages.searchUsersCta')}</Button>}
              />
            ) : (
              <UserRows
                rows={conversations.map((conv) => ({
                  id: conv.participantId,
                  username: conv.participantUsername,
                  avatarUrl: conv.participantAvatarUrl,
                }))}
                onPick={handleSendToUser}
                sending={sending}
              />
            )
          ) : searchQuery.trim().length < 2 ? (
            <p className="text-center py-12 text-on-surface-variant">{t('messages.minChars')}</p>
          ) : users.length === 0 ? (
            <EmptyState icon={MdSearch} title={t('messages.noUsers')} />
          ) : (
            <UserRows rows={users} onPick={handleSendToUser} sending={sending} />
          )}
        </div>
      </div>
    </Modal>
  )
}

const UserRows = ({ rows, onPick, sending }) => (
  <ul className="divide-y divide-outline-variant/20">
    {rows.map((user) => (
      <li key={user.id}>
        <button
          type="button"
          onClick={() => onPick(user.id, user.username)}
          disabled={sending}
          className="w-full p-space-sm flex items-center gap-space-sm text-left hover:bg-surface-container-low disabled:opacity-50"
        >
          <Avatar name={user.username} src={user.avatarUrl} size="lg" />
          <span className="font-semibold text-on-surface flex-1 truncate">{user.username}</span>
          <MdSend className="text-secondary" aria-hidden="true" />
        </button>
      </li>
    ))}
  </ul>
)

UserRows.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    username: PropTypes.string,
    avatarUrl: PropTypes.string,
  })).isRequired,
  onPick: PropTypes.func.isRequired,
  sending: PropTypes.bool,
}

ShareToUserModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  shareContent: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
  }),
}

export default ShareToUserModal

import { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { MdClose, MdSearch } from 'react-icons/md'
import userService from '../../services/userService'
import { useLanguage } from '../../contexts/LanguageContext'
import LoadingSpinner from '../common/LoadingSpinner'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import EmptyState from '../ui/EmptyState'
import { Input } from '../ui/Input'

const NewConversationModal = ({ isOpen, onClose, onSelectUser }) => {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('')
      setUsers([])
      setError(null)
    }
  }, [isOpen])

  const loadRecentUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userService.getAllUsers(0, 10)
      setUsers(data.content || [])
    } catch (err) {
      console.error('Error loading users:', err)
      setError(t('messages.loadUsersError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  const searchUsers = useCallback(async (query) => {
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
  }, [t])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

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
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchQuery, loadRecentUsers, searchUsers])

  const handleSelectUser = (user) => {
    onSelectUser(user.id)
    onClose()
  }

  if (!isOpen) return null

  const hint = searchQuery.trim().length === 0
    ? t('messages.suggested')
    : searchQuery.trim().length < 2
      ? t('messages.minChars')
      : `${t('messages.resultsFor')} "${searchQuery}"`

  return (
    <Modal title={t('messages.newConversation')} onClose={onClose} size="md">
      <div className="absolute top-3 right-3">
        <Button variant="icon" aria-label={t('messages.close')} onClick={onClose} icon={MdClose} />
      </div>
      <div className="mt-space-md space-y-space-sm max-h-[60vh] flex flex-col">
        <Input
          id="new-conversation-search"
          label={t('messages.searchUsers')}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={t('messages.searchByName')}
        />
        <p className="text-caption text-on-surface-variant">{hint}</p>
        <div className="flex-1 overflow-y-auto min-h-[12rem]">
          {loading ? (
            <LoadingSpinner label={t('common.loading')} />
          ) : error ? (
            <EmptyState
              title={error}
              action={<Button variant="ghost" onClick={loadRecentUsers}>{t('messages.retry')}</Button>}
            />
          ) : users.length === 0 ? (
            <EmptyState icon={MdSearch} title={t('messages.noUsers')} />
          ) : (
            <ul className="divide-y divide-outline-variant/20">
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className="w-full p-space-sm flex items-center gap-space-sm text-left hover:bg-surface-container-low"
                  >
                    <Avatar name={user.username} src={user.avatarUrl} size="lg" />
                    <span className="min-w-0">
                      <span className="block font-semibold text-on-surface truncate">{user.username}</span>
                      {user.bio && <span className="block text-body-sm text-on-surface-variant truncate">{user.bio}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  )
}

NewConversationModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSelectUser: PropTypes.func.isRequired,
}

export default NewConversationModal

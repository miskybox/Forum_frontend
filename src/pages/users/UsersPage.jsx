import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { MdChatBubbleOutline, MdPeople, MdSearch } from 'react-icons/md'
import useAuth from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import followService from '../../services/followService'
import userService from '../../services/userService'
import FollowButton from '../../components/social/FollowButton'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import PageContainer from '../../components/ui/PageContainer'
import SegmentedTabs from '../../components/ui/SegmentedTabs'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import Avatar from '../../components/ui/Avatar'

const toList = (data) => (Array.isArray(data) ? data : data?.content || [])

const UsersPage = () => {
  const { isAuthenticated, currentUser } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('explore')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadUsers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      let data = []

      if (activeTab === 'suggestions' && isAuthenticated) {
        data = await followService.getSuggestedUsers(0, 20)
      } else if (activeTab === 'mutuals' && isAuthenticated) {
        data = await followService.getMutualFollows()
      } else {
        data = await userService.getAllUsers(0, 20)
      }

      setUsers(toList(data))
    } catch (err) {
      console.error('Error loading users:', err)
      setError(t('users.loadError'))
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (event) => {
    event.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearchMode(false)
      return
    }

    try {
      setSearching(true)
      const results = await userService.searchUsers(searchQuery)
      setSearchResults(toList(results))
      setIsSearchMode(true)
    } catch (err) {
      console.error('Error searching users:', err)
      setError(t('users.searchError'))
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setIsSearchMode(false)
  }

  const displayUsers = isSearchMode ? searchResults : users

  const emptyTitle = searchQuery
    ? t('users.noUsers')
    : activeTab === 'mutuals'
      ? t('users.noMutuals')
      : activeTab === 'suggestions'
        ? t('users.noSuggestions')
        : t('users.noneAvailable')

  const tabs = [
    { id: 'explore', label: t('users.explore'), icon: MdPeople },
    { id: 'suggestions', label: t('users.suggestions'), icon: MdSearch },
    { id: 'mutuals', label: t('users.mutuals'), icon: MdPeople },
  ]

  return (
    <PageContainer width="wide" className="py-margin space-y-space-lg">
      <header>
        <h1 className="font-headline text-headline-lg text-on-surface">{t('users.title')}</h1>
        <p className="mt-space-xs text-body-md text-on-surface-variant">{t('users.subtitle')}</p>
      </header>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-space-sm items-end">
        <Input
          id="user-search"
          label={t('users.searchUsers')}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={t('users.searchPlaceholder')}
          className="flex-1 w-full"
        />
        <div className="flex gap-space-xs">
          <Button type="submit" loading={searching}>{t('users.search')}</Button>
          {searchResults.length > 0 && (
            <Button type="button" variant="ghost" onClick={clearSearch}>{t('users.clear')}</Button>
          )}
        </div>
      </form>

      {isAuthenticated && !isSearchMode && (
        <SegmentedTabs
          tabs={tabs}
          activeId={activeTab}
          onChange={setActiveTab}
          idPrefix="users"
          label={t('users.title')}
        />
      )}

      {error && <p role="alert" className="text-body-md text-error">{error}</p>}

      {loading ? (
        <LoadingSpinner label={t('common.loading')} />
      ) : displayUsers.length === 0 ? (
        <EmptyState
          icon={searchQuery ? MdSearch : MdPeople}
          title={emptyTitle}
          description={searchQuery ? t('users.searchHint') : t('users.emptyHint')}
        />
      ) : (
        <ul className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-3">
          {displayUsers.map((user) => (
            <li key={user.id || user.userId}>
              <UserCard
                user={user}
                currentUserId={currentUser?.id}
                isAuthenticated={isAuthenticated}
              />
            </li>
          ))}
        </ul>
      )}

      {!isAuthenticated && (
        <EmptyState
          icon={MdPeople}
          title={t('users.loginTitle')}
          description={t('users.loginHint')}
          action={
            <div className="flex gap-space-sm">
              <Button to="/login">{t('auth.loginButton')}</Button>
              <Button to="/register" variant="secondary">{t('auth.registerButton')}</Button>
            </div>
          }
        />
      )}
    </PageContainer>
  )
}

const UserCard = ({ user, currentUserId, isAuthenticated }) => {
  const { t } = useLanguage()
  const userId = user.id || user.userId
  const isOwnProfile = currentUserId === userId

  return (
    <article className="bg-surface-container-lowest rounded-lg p-space-md shadow-level-1 h-full flex flex-col">
      <Link to={`/profile/${userId}`} className="flex items-center gap-space-sm mb-space-sm">
        <Avatar
          name={user.username}
          src={user.avatarUrl || user.profileImageUrl}
          size="lg"
        />
        <span className="min-w-0">
          <span className="block font-semibold text-on-surface truncate">{user.username}</span>
          {user.fullName && (
            <span className="block text-body-sm text-on-surface-variant truncate">{user.fullName}</span>
          )}
        </span>
      </Link>

      {(user.bio || user.biography) && (
        <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-space-sm">
          {user.bio || user.biography}
        </p>
      )}

      {user.location && (
        <p className="text-caption text-on-surface-variant mb-space-sm">{user.location}</p>
      )}

      <div className="mt-auto flex flex-wrap gap-space-xs">
        <Button to={`/profile/${userId}`} variant="secondary" size="sm" className="flex-1">
          {t('users.viewProfile')}
        </Button>
        {isAuthenticated && !isOwnProfile && (
          <>
            <FollowButton userId={userId} size="sm" />
            <Button
              to={`/messages/${userId}`}
              variant="icon"
              aria-label={t('users.sendMessage')}
              icon={MdChatBubbleOutline}
            />
          </>
        )}
      </div>
    </article>
  )
}

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  currentUserId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isAuthenticated: PropTypes.bool,
}

export default UsersPage

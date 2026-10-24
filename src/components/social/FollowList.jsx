import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { MdPeople, MdSearch } from 'react-icons/md'
import followService from '../../services/followService'
import { useLanguage } from '../../contexts/LanguageContext'
import FollowButton from './FollowButton'
import LoadingSpinner from '../common/LoadingSpinner'
import EmptyState from '../ui/EmptyState'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

const FollowList = ({ userId, type = 'followers', onClose }) => {
  const { t } = useLanguage()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadUsers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, type])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = type === 'followers'
        ? await followService.getFollowers(userId)
        : await followService.getFollowing(userId)
      setUsers(Array.isArray(data) ? data : data?.content || [])
    } catch (err) {
      setError(t('users.loadError'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner label={t('common.loading')} />
  }

  if (error) {
    return (
      <EmptyState
        title={error}
        action={<Button variant="ghost" onClick={loadUsers}>{t('users.retry')}</Button>}
      />
    )
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={type === 'followers' ? MdPeople : MdSearch}
        title={type === 'followers' ? t('users.noFollowers') : t('users.noFollowing')}
      />
    )
  }

  return (
    <ul className="divide-y divide-outline-variant/20 max-h-96 overflow-y-auto">
      {users.map((user) => {
        const id = user.userId || user.id
        return (
          <li key={id} className="flex items-center justify-between gap-space-sm p-space-sm">
            <Link
              to={`/profile/${id}`}
              onClick={onClose}
              className="flex items-center gap-space-sm flex-1 min-w-0"
            >
              <Avatar name={user.username} src={user.avatarUrl} size="lg" />
              <span className="min-w-0">
                <span className="block font-semibold text-on-surface truncate">{user.username}</span>
                {user.bio && (
                  <span className="block text-body-sm text-on-surface-variant truncate">{user.bio}</span>
                )}
                {user.isFollowingBack && (
                  <span className="block text-caption text-secondary">{t('users.followsYou')}</span>
                )}
              </span>
            </Link>
            <FollowButton userId={id} size="sm" />
          </li>
        )
      })}
    </ul>
  )
}

FollowList.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['followers', 'following']),
  onClose: PropTypes.func,
}

export default FollowList

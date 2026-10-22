import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import followService from '../../services/followService'
import FollowButton from './FollowButton'
import LoadingSpinner from '../common/LoadingSpinner'

const FollowList = ({ userId, type = 'followers', onClose }) => {
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
      setUsers(data)
    } catch (err) {
      setError('Error al cargar usuarios')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-primary">
        {error}
        <button onClick={loadUsers} className="block mx-auto mt-4 text-secondary hover:underline">
          Reintentar
        </button>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-on-surface-variant">
        <div className="text-5xl mb-4">{type === 'followers' ? '👥' : '🔍'}</div>
        <p>{type === 'followers' ? 'Sin seguidores aun' : 'No sigue a nadie aun'}</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-surface-container-high max-h-96 overflow-y-auto">
      {users.map((user) => (
        <div key={user.userId} className="flex items-center justify-between p-4 hover:bg-surface-container-low/30 transition-colors">
          <Link
            to={`/profile/${user.userId}`}
            onClick={onClose}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <img
              src={user.avatarUrl || '/default-avatar.png'}
              alt={user.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-secondary"
            />
            <div className="min-w-0">
              <p className="font-semibold text-on-surface truncate">{user.username}</p>
              {user.bio && (
                <p className="text-sm text-on-surface-variant truncate">{user.bio}</p>
              )}
              {user.isFollowingBack && (
                <span className="text-xs text-secondary">Te sigue</span>
              )}
            </div>
          </Link>
          <FollowButton userId={user.userId} size="sm" />
        </div>
      ))}
    </div>
  )
}

export default FollowList

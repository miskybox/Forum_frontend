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
      <div className="text-center py-8 text-terracota">
        {error}
        <button onClick={loadUsers} className="block mx-auto mt-4 text-teal hover:underline">
          Reintentar
        </button>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-forest/60">
        <div className="text-5xl mb-4">{type === 'followers' ? '👥' : '🔍'}</div>
        <p>{type === 'followers' ? 'Sin seguidores aun' : 'No sigue a nadie aun'}</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-beige-dark max-h-96 overflow-y-auto">
      {users.map((user) => (
        <div key={user.userId} className="flex items-center justify-between p-4 hover:bg-beige/30 transition-colors">
          <Link
            to={`/profile/${user.userId}`}
            onClick={onClose}
            className="flex items-center gap-3 flex-1 min-w-0"
          >
            <img
              src={user.avatarUrl || '/default-avatar.png'}
              alt={user.username}
              className="w-12 h-12 rounded-full object-cover border-2 border-teal"
            />
            <div className="min-w-0">
              <p className="font-semibold text-forest truncate">{user.username}</p>
              {user.bio && (
                <p className="text-sm text-forest/60 truncate">{user.bio}</p>
              )}
              {user.isFollowingBack && (
                <span className="text-xs text-teal">Te sigue</span>
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

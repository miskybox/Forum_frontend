import React, { useState, useEffect } from 'react'
import followService from '../../services/followService'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const FollowButton = ({ userId, initialIsFollowing = false, onFollowChange, size = 'md' }) => {
  const { currentUser: user } = useAuth()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (user && userId && user.id !== userId) {
      checkFollowStatus()
    }
  }, [userId, user])

  const checkFollowStatus = async () => {
    try {
      const following = await followService.isFollowing(userId)
      setIsFollowing(following)
    } catch (err) {
      console.error('Error checking follow status:', err)
    }
  }

  const handleClick = async () => {
    if (!user) {
      toast.error('Inicia sesion para seguir usuarios')
      return
    }

    if (loading) return

    try {
      setLoading(true)
      if (isFollowing) {
        await followService.unfollowUser(userId)
        setIsFollowing(false)
        toast.success('Dejaste de seguir a este usuario')
      } else {
        await followService.followUser(userId)
        setIsFollowing(true)
        toast.success('Ahora sigues a este usuario')
      }
      onFollowChange?.(!isFollowing)
    } catch (err) {
      console.error('Error toggling follow:', err)
      toast.error(err.response?.data?.message || 'Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  // Don't show button for own profile
  if (user && user.id === userId) return null

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-base'
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      disabled={loading}
      className={`
        ${sizeClasses[size]}
        font-semibold rounded-full transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isFollowing
          ? hovering
            ? 'bg-terracota text-white border-2 border-terracota'
            : 'bg-white text-teal border-2 border-teal hover:border-terracota'
          : 'bg-teal text-white border-2 border-teal hover:bg-teal/90'
        }
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          ...
        </span>
      ) : isFollowing ? (
        hovering ? 'Dejar de seguir' : 'Siguiendo'
      ) : (
        'Seguir'
      )}
    </button>
  )
}

export default FollowButton

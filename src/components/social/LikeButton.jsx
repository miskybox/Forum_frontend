import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import likeService from '../../services/likeService'
import toast from 'react-hot-toast'

const LikeButton = ({ postId, initialLiked = false, initialCount = 0, size = 'md', onLikeChange }) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized && postId) {
      loadLikeStatus()
    }
  }, [postId])

  const loadLikeStatus = async () => {
    try {
      const data = await likeService.getLikeStatus(postId)
      setLiked(data.liked)
      setLikeCount(data.likeCount)
      setInitialized(true)
    } catch (err) {
      console.error('Error loading like status:', err)
      setInitialized(true)
    }
  }

  const handleClick = async () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesion para dar like')
      navigate('/login')
      return
    }

    if (loading) return

    try {
      setLoading(true)
      const data = await likeService.toggleLike(postId)
      setLiked(data.liked)
      setLikeCount(data.likeCount)
      onLikeChange?.(data.liked, data.likeCount)
    } catch (err) {
      console.error('Error toggling like:', err)
      toast.error('Error al procesar el like')
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'gap-1 text-sm',
    md: 'gap-1.5 text-base',
    lg: 'gap-2 text-lg'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        flex items-center ${sizeClasses[size]}
        transition-all duration-200
        ${liked
          ? 'text-terracota'
          : 'text-forest/60 hover:text-terracota'
        }
        disabled:opacity-50
      `}
      aria-label={liked ? 'Quitar like' : 'Dar like'}
      title={liked ? 'Quitar like' : 'Dar like'}
    >
      {loading ? (
        <svg className={`${iconSizes[size]} animate-spin`} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : liked ? (
        <svg className={iconSizes[size]} viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      ) : (
        <svg className={iconSizes[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      )}
      <span className="font-medium">{formatCount(likeCount)}</span>
    </button>
  )
}

export default LikeButton

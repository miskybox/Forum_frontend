import { useState, useEffect } from 'react'
import followService from '../../services/followService'
import { toast } from 'react-hot-toast'

/**
 * Botón de seguir/dejar de seguir reutilizable para cualquier usuario
 * @param {Object} props
 * @param {number} props.userId - ID del usuario a seguir/dejar de seguir
 * @param {boolean} props.isFollowing - ¿Ya lo sigo?
 * @param {function} [props.onChange] - Callback al cambiar estado
 */
const FollowButton = ({ userId, isFollowing: initialIsFollowing, onChange }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsFollowing(initialIsFollowing)
  }, [initialIsFollowing])

  const handleClick = async () => {
    setLoading(true)
    try {
      if (isFollowing) {
        await followService.unfollowUser(userId)
        setIsFollowing(false)
        toast('Has dejado de seguir al usuario')
      } else {
        await followService.followUser(userId)
        setIsFollowing(true)
        toast('Ahora sigues al usuario')
      }
      if (onChange) onChange(!isFollowing)
    } catch (e) {
      toast.error('Error al cambiar seguimiento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className={`btn ${isFollowing ? 'bg-gray-300 text-gray-700' : 'bg-golden text-midnight'} px-4 py-2 rounded font-bold ml-4`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? '...' : isFollowing ? 'Siguiendo' : 'Seguir'}
    </button>
  )
}

export default FollowButton

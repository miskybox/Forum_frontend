import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import followService from '../../services/followService'
import { toast } from 'react-hot-toast'

const getButtonText = (loading, isFollowing) => {
  if (loading) return '...'
  return isFollowing ? 'Siguiendo' : 'Seguir'
}

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
    } catch (error) {
      console.error('Error al cambiar seguimiento:', error)
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
      {getButtonText(loading, isFollowing)}
    </button>
  )
}

FollowButton.propTypes = {
  userId: PropTypes.number.isRequired,
  isFollowing: PropTypes.bool,
  onChange: PropTypes.func
}

export default FollowButton

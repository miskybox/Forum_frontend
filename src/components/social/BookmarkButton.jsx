import { useState } from 'react'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import bookmarkService from '../../services/bookmarkService'

const BookmarkButton = ({ postId, initialSaved = false }) => {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!isAuthenticated) {
      toast.error(t('auth.loginButton'))
      navigate('/login')
      return
    }
    if (loading) return
    setLoading(true)
    try {
      if (saved) {
        await bookmarkService.remove(postId)
        setSaved(false)
      } else {
        await bookmarkService.add(postId)
        setSaved(true)
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      toast.error(t('postDetail.saveError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1 min-h-10"
      aria-pressed={saved}
      aria-label={saved ? t('postDetail.unsave') : t('postDetail.save')}
    >
      {saved ? <MdBookmark aria-hidden="true" /> : <MdBookmarkBorder aria-hidden="true" />}
      <span className="hidden sm:inline text-label-lg">{saved ? t('postDetail.saved') : t('postDetail.save')}</span>
    </button>
  )
}

BookmarkButton.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  initialSaved: PropTypes.bool,
}

export default BookmarkButton

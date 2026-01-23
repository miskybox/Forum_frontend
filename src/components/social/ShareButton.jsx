import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import ShareToUserModal from '../messages/ShareToUserModal'
import toast from 'react-hot-toast'

const ShareButton = ({ postId, title, size = 'md' }) => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const menuRef = useRef(null)

  const postUrl = `${window.location.origin}/posts/${postId}`

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
      toast.success('Enlace copiado')
      setShowMenu(false)
    } catch (err) {
      console.error('Error copying link:', err)
      toast.error('Error al copiar enlace')
    }
  }

  const handleShareMessage = () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesion para compartir por mensaje')
      navigate('/login')
      return
    }
    setShowMenu(false)
    setShowShareModal(true)
  }

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Mira esta publicacion: ${title}`,
          url: postUrl
        })
        setShowMenu(false)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err)
        }
      }
    } else {
      handleCopyLink()
    }
  }

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5'
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`${sizeClasses[size]} text-forest/60 hover:text-teal hover:bg-beige rounded-full transition-colors`}
        aria-label="Compartir"
        title="Compartir"
      >
        <svg className={iconSizes[size]} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {showMenu && (
        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-beige-dark py-1 z-50">
          <button
            onClick={handleCopyLink}
            className="w-full px-4 py-2 text-left text-sm text-forest hover:bg-beige flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copiar enlace
          </button>
          <button
            onClick={handleShareMessage}
            className="w-full px-4 py-2 text-left text-sm text-forest hover:bg-beige flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Enviar por mensaje
          </button>
          {navigator.share && (
            <button
              onClick={handleShareNative}
              className="w-full px-4 py-2 text-left text-sm text-forest hover:bg-beige flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Compartir...
            </button>
          )}
        </div>
      )}

      <ShareToUserModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareContent={{ postId, title, url: postUrl }}
      />
    </div>
  )
}

export default ShareButton

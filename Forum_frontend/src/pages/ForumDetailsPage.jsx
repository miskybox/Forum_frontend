import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import forumService from '../services/forumService'
import postService from '../services/postService'
import PostList from '../components/post/PostList'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * ForumDetailsPage con tema Adventure Explorer Retro
 * Paleta accesible WCAG AA
 */
const ForumDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, hasRole, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const [forum, setForum] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [postLoading, setPostLoading] = useState(true)

  useEffect(() => {
    const fetchForumData = async () => {
      try {
        setLoading(true)
        const forumData = await forumService.getForumById(id)
        setForum(forumData)
      } catch (error) {
        console.error('Error al cargar el foro:', error)
        toast.error(t('forums.errorLoadingForum'))
        navigate('/forums')
      } finally {
        setLoading(false)
      }
    }

    const fetchPosts = async () => {
      try {
        setPostLoading(true)
        const postsData = await postService.getPostsByForum(id)
        setPosts(postsData)
      } catch (error) {
        console.error('Error al cargar publicaciones:', error)
        toast.error(t('forums.errorLoadingPosts'))
      } finally {
        setPostLoading(false)
      }
    }

    fetchForumData()
    fetchPosts()
  }, [id, navigate])

  const handleDeleteForum = async () => {
    if (window.confirm(t('forums.confirmDeleteForum'))) {
      try {
        await forumService.deleteForum(id)
        toast.success(t('forums.forumDeletedSuccess'))
        navigate('/forums')
      } catch (error) {
        console.error('Error al eliminar el foro:', error)
        toast.error(t('forums.errorDeletingForum'))
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🏺</div>
          <p className="text-primary-400 font-bold text-lg tracking-normal">
            {t('forums.loadingAdventure')}
          </p>
        </div>
      </div>
    )
  }

  const isForumAuthor = currentUser && forum.createdBy === currentUser.id
  const canEditForum = isForumAuthor || hasRole('ADMIN') || hasRole('MODERATOR')

  const EmptyPostsMessage = () => (
    <div className="text-center py-12 card border-primary-600 hover:border-primary-500 transition-colors">
      <div className="text-5xl mb-4">🗺️</div>
      <p className="text-light-soft font-bold text-base uppercase tracking-normal mb-6">
        {t('forums.noPosts')}
      </p>
      {isAuthenticated ? (
        <Link
          to={`/forums/${id}/posts/create`}
          className="btn-primary inline-block"
        >
          <span className="flex items-center space-x-2">
            <span>✍️</span>
            <span>{t('forums.beFirst')}</span>
          </span>
        </Link>
      ) : (
        <Link
          to="/login"
          className="inline-block bg-dark border-2 border-secondary-600 text-secondary-500 px-6 py-3 rounded-lg font-bold uppercase tracking-normal hover:bg-secondary-600 hover:text-dark transition-all duration-300"
        >
          <span className="flex items-center space-x-2">
            <span>🔐</span>
            <span>{t('nav.login')}</span>
          </span>
        </Link>
      )}
    </div>
  )

  const renderPostContent = () => {
    if (postLoading) {
      return (
        <div className="text-center py-12">
          <div className="text-5xl mb-4 animate-spin">⏳</div>
          <p className="text-primary-400 font-bold text-base uppercase tracking-normal">
            {t('common.loading')}
          </p>
        </div>
      )
    }

    if (posts.length > 0) {
      return <PostList posts={posts} />
    }

    return <EmptyPostsMessage />
  }

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Efectos sutiles de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
            }}
          >
            {['🏺', '🗺️', '⚱️'][Math.floor(Math.random() * 3)]}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header del foro */}
        <div className="card border-primary-600 mb-8 animate-fade-in overflow-hidden">
          <div className="relative">
            {forum.imagePath && (
              <div className="h-48 bg-gradient-to-r from-dark-lighter to-dark relative overflow-hidden">
                <img
                  src={forum.imagePath}
                  alt={forum.title}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
              </div>
            )}

            {!forum.imagePath && (
              <div className="h-32 bg-gradient-to-r from-dark-lighter via-dark-soft to-dark-lighter flex items-center justify-center">
                <span className="text-6xl drop-shadow-lg">🏺</span>
              </div>
            )}

            <div className={`px-6 py-6 ${forum.imagePath ? 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark to-transparent' : ''}`}>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-400 mb-3 tracking-wide">
                {forum.title}
              </h1>
              {forum.category && (
                <div className="inline-block px-4 py-2 bg-secondary-600/20 border-2 border-secondary-600 text-secondary-400 font-bold text-xs uppercase tracking-normal rounded">
                  {forum.category.name}
                </div>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="px-6 py-4 border-t-2 border-primary-600/30">
            <p className="text-light-soft text-base leading-relaxed mb-4">
              {forum.description}
            </p>

            {forum.rules && (
              <div className="mt-6 p-4 bg-dark-lighter border-2 border-accent-600 rounded-lg">
                <h3 className="text-accent-500 font-bold text-base uppercase tracking-normal mb-3">
                  📜 {t('forums.rules')}
                </h3>
                <div className="text-light-soft text-sm whitespace-pre-line leading-relaxed">
                  {forum.rules}
                </div>
              </div>
            )}

            {/* Acciones */}
            {canEditForum && (
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t-2 border-primary-600/30">
                <Link
                  to={`/forums/${id}/edit`}
                  className="inline-block bg-dark border-2 border-primary-600 text-primary-500 px-5 py-2 rounded-lg font-bold uppercase tracking-normal hover:bg-primary-600 hover:text-dark transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <span>✏️</span>
                    <span>{t('common.edit')}</span>
                  </span>
                </Link>
                <button
                  onClick={handleDeleteForum}
                  className="bg-dark border-2 border-error text-error px-5 py-2 rounded-lg font-bold uppercase tracking-normal hover:bg-error hover:text-white transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <span>🗑️</span>
                    <span>{t('common.delete')}</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de publicaciones */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-primary-500 tracking-normal">
              {t('forums.posts')}
            </h2>
            {isAuthenticated && (
              <Link
                to={`/forums/${id}/posts/create`}
                className="btn-primary"
              >
                <span className="flex items-center space-x-2">
                  <span>➕</span>
                  <span>{t('forums.newPost')}</span>
                </span>
              </Link>
            )}
          </div>
          {renderPostContent()}
        </div>
      </div>
    </div>
  )
}

export default ForumDetailsPage

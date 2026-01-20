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
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-golden border-t-transparent rounded-full animate-spin"></div>
          <p className="text-ocean-400 font-bold text-lg tracking-normal">
            {t('forums.loadingAdventure')}
          </p>
        </div>
      </div>
    )
  }

  const isForumAuthor = currentUser && forum.createdBy === currentUser.id
  const canEditForum = isForumAuthor || hasRole('ADMIN') || hasRole('MODERATOR')

  const EmptyPostsMessage = () => (
    <div className="text-center py-12 px-6 card border-golden hover:border-golden-dark transition-colors">
      <div className="w-16 h-16 mx-auto mb-4 bg-aqua rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      </div>
      <p className="text-light-soft font-bold text-base uppercase tracking-normal mb-6">
        {t('forums.noPosts')}
      </p>
      {isAuthenticated ? (
        <Link
          to={`/forums/${id}/posts/create`}
          className="btn bg-golden hover:bg-golden-dark text-midnight inline-block px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all font-bold"
        >
          <span className="whitespace-nowrap">{t('forums.beFirst')}</span>
        </Link>
      ) : (
        <Link
          to="/login"
          className="inline-block bg-midnight border-2 border-golden text-golden px-8 py-4 rounded-lg font-bold uppercase tracking-normal hover:bg-golden hover:text-midnight transition-all duration-300 shadow-md"
        >
          <span className="whitespace-nowrap">{t('nav.login')}</span>
        </Link>
      )}
    </div>
  )

  const renderPostContent = () => {
    if (postLoading) {
      return (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-golden border-t-transparent rounded-full animate-spin"></div>
          <p className="text-golden font-bold text-base uppercase tracking-normal">
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 3}s`,
              backgroundColor: ['#E5A13E', '#CFE7E5', '#213638'][Math.floor(Math.random() * 3)]
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header del foro */}
        <div className="card border-golden mb-8 animate-fade-in overflow-hidden">
          <div className="relative">
            {forum.imagePath && (
              <div className="h-48 bg-gradient-to-r from-midnight to-teal-dark relative overflow-hidden">
                <img
                  src={forum.imagePath}
                  alt={forum.title}
                  className="w-full h-full object-cover opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight via-transparent to-transparent"></div>
              </div>
            )}

            {!forum.imagePath && (
              <div className="h-32 bg-gradient-to-r from-midnight via-teal-dark to-midnight flex items-center justify-center">
                <div className="w-16 h-16 bg-golden rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                </div>
              </div>
            )}

            <div className={`px-6 py-6 ${forum.imagePath ? 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-midnight to-transparent' : ''}`}>
              <h1 className="text-3xl md:text-4xl font-bold text-golden mb-3 tracking-wide">
                {forum.title}
              </h1>
              {forum.category && (
                <div className="inline-block px-4 py-2 bg-aqua/20 border-2 border-aqua text-aqua font-bold text-xs uppercase tracking-normal rounded">
                  {forum.category.name}
                </div>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="px-6 py-4 border-t-2 border-golden/30">
            <p className="text-light-soft text-base leading-relaxed mb-4">
              {forum.description}
            </p>

            {forum.rules && (
              <div className="mt-6 p-4 bg-aqua/10 border-2 border-aqua rounded-lg">
                <h3 className="text-midnight font-bold text-base uppercase tracking-normal mb-3">
                  {t('forums.rules')}
                </h3>
                <div className="text-light-soft text-sm whitespace-pre-line leading-relaxed">
                  {forum.rules}
                </div>
              </div>
            )}

            {/* Acciones */}
            {canEditForum && (
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t-2 border-golden/30">
                <Link
                  to={`/forums/${id}/edit`}
                  className="inline-block bg-golden border-2 border-golden text-midnight px-5 py-2 rounded-lg font-bold uppercase tracking-normal hover:bg-golden-dark transition-all duration-300"
                >
                  <span>{t('common.edit')}</span>
                </Link>
                <button
                  onClick={handleDeleteForum}
                  className="bg-transparent border-2 border-error text-error px-5 py-2 rounded-lg font-bold uppercase tracking-normal hover:bg-error hover:text-white transition-all duration-300"
                >
                  <span>{t('common.delete')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de publicaciones */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-ocean-500 tracking-normal">
              {t('forums.posts')}
            </h2>
            {isAuthenticated && (
              <Link
                to={`/forums/${id}/posts/create`}
                className="btn-primary px-8 py-4 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <span className="whitespace-nowrap">{t('forums.newPost')}</span>
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

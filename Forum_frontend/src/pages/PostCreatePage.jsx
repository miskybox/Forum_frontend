import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PostForm from '../components/post/PostForm'
import forumService from '../services/forumService'
import { useLanguage } from '../contexts/LanguageContext'

/**
 * PostCreatePage con tema Adventure Explorer Retro
 * Paleta accesible WCAG AA
 */
const PostCreatePage = () => {
  const { forumId } = useParams()
  const { t } = useLanguage()

  const [forum, setForum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchForum = async () => {
      try {
        setLoading(true)
        const data = await forumService.getForumById(forumId)
        setForum(data)
        setError(null)
      } catch (err) {
        console.error('Error al cargar el foro:', err)
        setError(t('posts.loadError') || 'No se pudo cargar el foro. Por favor, inténtalo de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchForum()
  }, [forumId, t])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-golden border-t-transparent rounded-full animate-spin"></div>
          <p className="text-golden font-bold text-lg tracking-normal">
            {t('common.loading') || 'CARGANDO...'}
          </p>
        </div>
      </div>
    )
  }

  if (error || !forum) {
    return (
      <div className="min-h-screen py-10">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="card text-center py-10 px-6 border-error">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="text-error mb-6 font-bold text-lg">
              {error || t('posts.forumNotFound') || 'Foro no encontrado'}
            </div>
            <Link to="/forums" className="btn-primary inline-block">
              {t('posts.viewForums') || 'Ver foros disponibles'}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-ocean-500 mb-2">
                {t('posts.newPost')}
              </h1>
              <p className="text-light-soft text-base sm:text-lg">
                {t('posts.shareExperience')}{' '}
                <span className="text-ocean-400 font-bold">"{forum.title}"</span>.
              </p>
            </div>

            <Link
              to={`/forums/${forumId}`}
              className="inline-flex items-center gap-2 px-4 py-2 text-ocean-400 hover:text-ocean-300 font-bold transition-colors border-2 border-ocean-600 hover:border-ocean-500 rounded-lg"
            >
              <span>←</span>
              <span>{t('common.back')}</span>
            </Link>
          </div>
        </div>

        <div className="card max-w-4xl">
          <PostForm />
        </div>
      </div>
    </div>
  )
}

export default PostCreatePage
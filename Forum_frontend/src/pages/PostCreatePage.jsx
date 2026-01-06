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
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-ocean-400 font-bold text-lg tracking-normal">
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
            <div className="text-5xl mb-4">⚠️</div>
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
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PostForm from '../components/post/PostForm'
import forumService from '../services/forumService'
import { useLanguage } from '../contexts/LanguageContext'
import FormPageLayout from '../components/common/FormPageLayout'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { MdErrorOutline } from 'react-icons/md'

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
    return <LoadingSpinner />
  }

  if (error || !forum) {
    return (
      <div className="max-w-md mx-auto px-gutter-sm py-margin-lg">
        <EmptyState
          icon={MdErrorOutline}
          title={error || t('posts.forumNotFound')}
          action={<Link to="/forums" className="btn btn-primary">{t('posts.viewForums')}</Link>}
        />
      </div>
    )
  }

  return (
    <FormPageLayout
      title={t('posts.newPost')}
      description={<>{t('posts.shareExperience')} <strong className="text-on-surface">“{forum.title}”</strong>.</>}
      backTo={`/forums/${forumId}`}
      backLabel={t('common.backToForum')}
      tipsTitle={t('posts.tipsTitle')}
      tips={[t('posts.tipClearTitle'), t('posts.tipDetails'), t('posts.tipRespect')]}
    >
      <PostForm forumId={forumId} />
    </FormPageLayout>
  )
}

export default PostCreatePage
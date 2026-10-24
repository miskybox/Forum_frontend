// Archivo: src/pages/ForumEditPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import ForumForm from '../components/forums/ForumForm'
import forumService from '../services/forumService'
import useAuth from '../hooks/useAuth'
import FormPageLayout from '../components/common/FormPageLayout'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { MdErrorOutline } from 'react-icons/md'

const ForumEditPage = () => {
  const { t } = useLanguage()
  const { id } = useParams()
  const navigate = useNavigate()

  const [forum, setForum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { currentUser, hasRole } = useAuth()
  
  useEffect(() => {
    const fetchForum = async () => {
      try {
        setLoading(true)
        const data = await forumService.getForumById(id)
        setForum(data)

        // Verificar si el usuario tiene permiso para editar este foro
        if (currentUser && ((data.createdBy ?? data.creator?.id) === currentUser.id || hasRole('ROLE_ADMIN') || hasRole('ROLE_MODERATOR'))) {
          setError(null)
        } else {
          setError(t('forums.noPermissionEdit'))
          setTimeout(() => {
            navigate(`/forums/${id}`)
          }, 3000)
        }
      } catch (err) {
        console.error('Error al cargar el foro:', err)
        setError(`${t('forums.errorLoadingForum')}. ${t('forums.tryAgain')}`)
      } finally {
        setLoading(false)
      }
    }

    fetchForum()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUser, hasRole, navigate])
  
  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !forum) {
    return (
      <div className="max-w-md mx-auto px-gutter-sm py-margin-lg">
        <EmptyState
          icon={MdErrorOutline}
          title={error || t('forums.forumNotFound')}
          description={t('forums.redirecting')}
          action={<Link to={`/forums/${id}`} className="btn btn-primary">{t('forums.backToForum')}</Link>}
        />
      </div>
    )
  }

  return (
    <FormPageLayout
      title={t('forums.editForum')}
      description={<>{t('forums.updateForumInfo')} <strong className="text-on-surface">“{forum.title}”</strong>.</>}
      backTo={`/forums/${id}`}
      backLabel={t('forums.backToForum')}
    >
      <ForumForm initialData={forum} isEdit={true} />
    </FormPageLayout>
  )
}

export default ForumEditPage
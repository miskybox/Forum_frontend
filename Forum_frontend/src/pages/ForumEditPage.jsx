// Archivo: src/pages/ForumEditPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import ForumForm from '../components/forums/ForumForm'
import forumService from '../services/forumService'
import useAuth from '../hooks/useAuth'

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
        if (currentUser && (data.creator?.id === currentUser.id || hasRole('ADMIN') || hasRole('MODERATOR'))) {
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
  }, [id, currentUser, hasRole, navigate])
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (error || !forum) {
    return (
      <div className="min-h-screen py-10">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center py-10 card">
            <div className="text-red-600 mb-4 font-bold">{error || t('forums.forumNotFound')}</div>
            <p className="mb-4 text-light-soft">{t('forums.redirecting')}</p>
            <Link to={`/forums/${id}`} className="btn btn-primary">
              {t('forums.backToForum')}
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-500 tracking-normal uppercase">
              {t('forums.editForum')}
            </h1>

            <Link
              to={`/forums/${id}`}
              className="text-primary-400 hover:text-primary-300 text-sm font-bold"
            >
              ← {t('forums.backToForum')}
            </Link>
          </div>
          <p className="mt-2 text-light-soft">
            {t('forums.updateForumInfo')} "{forum.title}".
          </p>
        </div>

        <div className="card">
          <ForumForm initialData={forum} isEdit={true} />
        </div>
      </div>
    </div>
  )
}

export default ForumEditPage
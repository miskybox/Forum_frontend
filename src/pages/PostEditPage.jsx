// Archivo: src/pages/PostEditPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import PostForm from '../components/post/PostForm';
import postService from '../services/postService'
import useAuth from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import FormPageLayout from '../components/common/FormPageLayout'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { MdErrorOutline } from 'react-icons/md'

const PostEditPage = () => {
  const { t } = useLanguage()
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { currentUser, hasRole } = useAuth()
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const data = await postService.getPostById(id)
        setPost(data)
        
        // Verificar si el usuario tiene permiso para editar esta publicación
        if (currentUser && ((data.createdBy ?? data.author?.id) === currentUser.id || hasRole('ADMIN') || hasRole('MODERATOR'))) {
          setError(null)
        } else {
          setError('No tienes permiso para editar esta publicación')
          setTimeout(() => {
            navigate(`/posts/${id}`)
          }, 3000)
        }
      } catch (err) {
        console.error('Error al cargar la publicación:', err)
        setError('No se pudo cargar la publicación. Por favor, inténtalo de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPost()
  }, [id, currentUser, hasRole, navigate])
  
  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !post) {
    return (
      <div className="max-w-md mx-auto px-gutter-sm py-margin-lg">
        <EmptyState
          icon={MdErrorOutline}
          title={error || t('posts.postNotFound')}
          description={t('forums.redirecting')}
          action={<Link to={`/posts/${id}`} className="btn btn-primary">{t('posts.backToPost')}</Link>}
        />
      </div>
    )
  }

  return (
    <FormPageLayout
      title={t('posts.editPost')}
      description={<>{t('posts.editDescription')} <strong className="text-on-surface">“{post.title}”</strong>.</>}
      backTo={`/posts/${id}`}
      backLabel={t('posts.backToPost')}
    >
      <PostForm postId={id} />
    </FormPageLayout>
  )
}

export default PostEditPage
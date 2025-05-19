// Archivo: src/pages/PostDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'react-hot-toast'
import postService from '../services/postService'
import CommentList from '../components/comments/CommentList'
import useAuth from '../hooks/useAuth'

const PostDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  
  const { currentUser, hasRole } = useAuth()
  
  // Verificar si el usuario actual es el autor de la publicación
  const isAuthor = post && currentUser && post.author?.id === currentUser.id
  // Verificar si el usuario puede editar/eliminar (ser autor o admin/moderador)
  const canEdit = isAuthor || hasRole('ADMIN') || hasRole('MODERATOR')
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const data = await postService.getPostById(id)
        setPost(data)
        setError(null)
      } catch (err) {
        console.error('Error al cargar la publicación:', err)
        setError('No se pudo cargar la publicación. Por favor, inténtalo de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPost()
  }, [id])
  
  const handleDeletePost = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.')) {
      return
    }
    
    try {
      await postService.deletePost(id)
      toast.success('Publicación eliminada con éxito')
      
      // Redirigir al foro
      if (post && post.forum) {
        navigate(`/forums/${post.forum.id}`)
      } else {
        navigate('/forums')
      }
    } catch (error) {
      console.error('Error al eliminar la publicación:', error)
      toast.error('Error al eliminar la publicación')
    }
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (error || !post) {
    return (
      <div className="bg-neutral-50 py-10">
        <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="text-center py-10 bg-white rounded-lg shadow-sm p-6">
            <div className="text-red-600 mb-4">{error || 'Publicación no encontrada'}</div>
            <Link to="/forums" className="btn btn-primary">
              Ver foros disponibles
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-neutral-50 py-8 sm:py-12">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Ruta de navegación */}
          <div className="flex items-center text-sm text-neutral-500 mb-6">
            <Link to="/forums" className="hover:text-primary-600">Foros</Link>
            <span className="mx-2">›</span>
            {post.forum && (
              <>
                <Link to={`/forums/${post.forum.id}`} className="hover:text-primary-600">
                  {post.forum.title}
                </Link>
                <span className="mx-2">›</span>
              </>
            )}
            <span className="text-neutral-700 font-medium">{post.title}</span>
          </div>
          
          {/* Tarjeta principal de la publicación */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="p-6">
              {/* Título y metadatos */}
              <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-3">
                  {post.title}
                </h1>
                
                <div className="flex items-center text-sm text-neutral-500 flex-wrap gap-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs overflow-hidden mr-2">
                      {post.author?.profileImage ? (
                        <img 
                          src={post.author.profileImage} 
                          alt={post.author.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        post.author?.username?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                    <span>{post.author?.username || 'Usuario'}</span>
                  </div>
                  <span className="text-neutral-300">•</span>
                  <div>
                    <time dateTime={post.createdAt}>
                      {format(new Date(post.createdAt), 'PP', { locale: es })}
                    </time>
                  </div>
                  {post.createdAt !== post.updatedAt && (
                    <>
                      <span className="text-neutral-300">•</span>
                      <div className="text-neutral-500 text-xs italic">
                        Editado: {format(new Date(post.updatedAt), 'PP', { locale: es })}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Contenido principal */}
              <div className="mb-8 prose prose-neutral max-w-none">
                {post.content.split('\n').map((paragraph, index) => {
                  const key = `${paragraph}-${index}`;
                  return paragraph ? <p key={key}>{paragraph}</p> : <br key={key} />;
                })}
              </div>
              
              {/* Galería de imágenes (si hay imágenes) */}
              {post.images && post.images.length > 0 && (
                <div className="mb-8">
                  <div className="mb-4">
                    <div className="bg-neutral-200 rounded-lg overflow-hidden aspect-video">
                      <img 
                        src={post.images[activeImageIndex].url} 
                        alt={`Imagen ${activeImageIndex + 1} de la publicación`} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  {post.images.length > 1 && (
                    <div className="grid grid-cols-6 gap-2">
                      {post.images.map((image, index) => (
                        <button
                          key={image.id}
                          type="button"
                          className={`relative rounded-md overflow-hidden aspect-square focus:outline-none ${
                            activeImageIndex === index ? 'ring-2 ring-primary-500' : ''
                          }`}
                          onClick={() => setActiveImageIndex(index)}
                        >
                          <img 
                            src={image.url} 
                            alt={`Miniatura ${index + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Botones de acción */}
              {canEdit && (
                <div className="flex space-x-3 border-t border-neutral-200 pt-6 mt-6">
                  <Link 
                    to={`/posts/${id}/edit`} 
                    className="btn btn-outline"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    className="btn border border-red-300 bg-white hover:bg-red-50 text-red-600 h-10 px-4 py-2"
                    onClick={handleDeletePost}
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Comentarios */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <CommentList postId={id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetailPage
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import forumService from '../services/forumService'
import postService from '../services/postService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PostList from '../components/post/PostList'

/**
 * ForumDetailsPage con tema Adventure
 */
const ForumDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, hasRole, isAuthenticated } = useAuth()
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
        toast.error('No se pudo cargar el foro')
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
        toast.error('No se pudieron cargar las publicaciones')
      } finally {
        setPostLoading(false)
      }
    }

    fetchForumData()
    fetchPosts()
  }, [id, navigate])

  const handleDeleteForum = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este foro? Esta acción no se puede deshacer.')) {
      try {
        await forumService.deleteForum(id)
        toast.success('Foro eliminado con éxito')
        navigate('/forums')
      } catch (error) {
        console.error('Error al eliminar el foro:', error)
        toast.error('No se pudo eliminar el foro')
      }
    }
  }

  if (loading) {
    return (
      <div className="theme-adventure min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🏺</div>
          <p className="text-adventure-gold font-retro text-sm uppercase tracking-wider">CARGANDO AVENTURA...</p>
        </div>
      </div>
    )
  }

  const isForumAuthor = currentUser && forum.createdBy === currentUser.id
  const canEditForum = isForumAuthor || hasRole('ADMIN') || hasRole('MODERATOR')

  const EmptyPostsMessage = () => (
    <div className="text-center py-12 card border-adventure-gold">
      <div className="text-5xl mb-4">🗺️</div>
      <p className="text-adventure-light font-retro text-sm uppercase tracking-wider mb-6">
        Aún no hay publicaciones en este foro
      </p>
      {isAuthenticated ? (
        <Link 
          to={`/forums/${id}/posts/create`}
          className="btn btn-primary text-adventure-dark border-adventure-gold"
        >
          <span className="flex items-center space-x-2">
            <span>✍️</span>
            <span>SÉ EL PRIMERO</span>
          </span>
        </Link>
      ) : (
        <Link 
          to="/login"
          className="btn btn-outline text-adventure-gold border-adventure-gold"
        >
          <span className="flex items-center space-x-2">
            <span>🔐</span>
            <span>INICIA SESIÓN</span>
          </span>
        </Link>
      )}
    </div>
  )

  const renderPostContent = () => {
    if (postLoading) {
      return (
        <div className="text-center py-12">
          <div className="text-5xl mb-4 animate-spin">⚱️</div>
          <p className="text-adventure-gold font-retro text-xs uppercase">CARGANDO...</p>
        </div>
      )
    } 
    
    if (posts.length > 0) {
      return <PostList posts={posts} />
    }
    
    return <EmptyPostsMessage />
  }

  return (
    <div className="theme-adventure min-h-screen py-8 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {['🏺', '🗺️', '⚱️'][Math.floor(Math.random() * 3)]}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header del foro */}
        <div className="card border-adventure-gold mb-8 animate-fade-in">
          <div className="relative">
            {forum.imagePath && (
              <div className="h-48 bg-gradient-to-r from-adventure-brown to-adventure-dark relative overflow-hidden">
                <img
                  src={forum.imagePath}
                  alt={forum.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-adventure-dark to-transparent"></div>
              </div>
            )}
            
            {!forum.imagePath && (
              <div className="h-32 bg-gradient-to-r from-adventure-brown to-adventure-dark flex items-center justify-center">
                <span className="text-6xl">🏺</span>
              </div>
            )}
            
            <div className={`px-6 py-6 ${forum.imagePath ? 'absolute bottom-0 left-0 right-0' : ''}`}>
              <h1 className={`text-3xl md:text-4xl font-display ${forum.imagePath ? 'text-adventure-gold' : 'text-adventure-gold'} neon-text mb-2`}>
                {forum.title}
              </h1>
              {forum.category && (
                <div className="inline-block px-3 py-1 bg-adventure-gold/20 border border-adventure-gold text-adventure-gold font-retro text-xs uppercase tracking-wider">
                  {forum.category.name}
                </div>
              )}
            </div>
          </div>
          
          {/* Descripción */}
          <div className="px-6 py-4 border-t-2 border-adventure-gold/30">
            <p className="text-adventure-light font-retro text-sm leading-relaxed mb-4">
              {forum.description}
            </p>
            
            {forum.rules && (
              <div className="mt-6 p-4 bg-adventure-dark/50 border-2 border-adventure-gold/30">
                <h3 className="text-adventure-gold font-display text-sm uppercase tracking-wider mb-3">
                  📜 REGLAS DEL FORO
                </h3>
                <div className="text-adventure-light font-retro text-xs whitespace-pre-line leading-relaxed">
                  {forum.rules}
                </div>
              </div>
            )}
            
            {/* Acciones */}
            {canEditForum && (
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t-2 border-adventure-gold/30">
                <Link
                  to={`/forums/${id}/edit`}
                  className="btn btn-outline text-adventure-gold border-adventure-gold px-4 py-2"
                >
                  <span className="flex items-center space-x-2">
                    <span>✏️</span>
                    <span>EDITAR</span>
                  </span>
                </Link>
                <button
                  onClick={handleDeleteForum}
                  className="btn btn-outline text-tech-red border-tech-red px-4 py-2"
                >
                  <span className="flex items-center space-x-2">
                    <span>🗑️</span>
                    <span>ELIMINAR</span>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Lista de publicaciones */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-display text-adventure-gold neon-text">
              PUBLICACIONES
            </h2>
            {isAuthenticated && (
              <Link
                to={`/forums/${id}/posts/create`}
                className="btn btn-primary text-adventure-dark border-adventure-gold"
              >
                <span className="flex items-center space-x-2">
                  <span>➕</span>
                  <span>NUEVA</span>
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

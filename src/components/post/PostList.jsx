import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import PostCard from './PostCard'
import postService from '../../services/postService'
import forumService from '../../services/forumService'
import useAuth from '../../hooks/useAuth'

/**
 * PostList con estilo retro Adventure
 */
const PostList = ({ forumId: propForumId, posts: propPosts }) => {
  const { forumId: paramForumId } = useParams()
  const forumId = propForumId || paramForumId
  
  const [posts, setPosts] = useState(propPosts || [])
  const [forum, setForum] = useState(null)
  const [loading, setLoading] = useState(!propPosts)
  const [error, setError] = useState(null)
  
  const { isAuthenticated } = useAuth()
  
  useEffect(() => {
    const fetchData = async () => {
      if (propPosts) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        if (forumId) {
          const forumData = await forumService.getForumById(forumId)
          setForum(forumData)
          
          const postData = await postService.getPostsByForum(forumId)
          setPosts(postData)
        }
        
        setError(null)
      } catch (err) {
        console.error('Error al cargar las publicaciones:', err)
        setError('No se pudieron cargar las publicaciones. Por favor, inténtalo de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }
    
    if (forumId && !propPosts) {
      fetchData()
    }
  }, [forumId, propPosts])
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">📝</div>
          <p className="text-adventure-gold font-retro text-sm uppercase tracking-wider">
            CARGANDO PUBLICACIONES...
          </p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-10 card border-tech-red">
        <div className="text-5xl mb-4">⚠️</div>
        <div className="text-tech-red font-retro text-sm uppercase tracking-wider mb-6">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary text-adventure-dark border-adventure-gold"
        >
          <span className="flex items-center space-x-2">
            <span>🔄</span>
            <span>REINTENTAR</span>
          </span>
        </button>
      </div>
    )
  }
  
  if (forumId && !forum) {
    return (
      <div className="text-center py-10 card border-tech-red">
        <div className="text-5xl mb-4">❌</div>
        <div className="text-tech-red font-retro text-sm uppercase tracking-wider mb-6">
          FORO NO ENCONTRADO
        </div>
        <Link to="/forums" className="btn btn-primary text-adventure-dark border-adventure-gold">
          <span className="flex items-center space-x-2">
            <span>🏺</span>
            <span>VER TODOS LOS FOROS</span>
          </span>
        </Link>
      </div>
    )
  }
  
  return (
    <div>
      {forum && (
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-display text-adventure-gold neon-text mb-2 uppercase">
              PUBLICACIONES EN {forum.title.toUpperCase()}
            </h2>
            <p className="text-adventure-light font-retro text-xs opacity-80">
              {forum.description}
            </p>
          </div>
          
          {isAuthenticated && (
            <Link 
              to={`/forums/${forumId}/posts/create`} 
              className="btn btn-primary text-adventure-dark border-adventure-gold whitespace-nowrap"
            >
              <span className="flex items-center space-x-2">
                <span>➕</span>
                <span>NUEVA PUBLICACIÓN</span>
              </span>
            </Link>
          )}
        </div>
      )}
      
      {posts.length === 0 ? (
        <div className="text-center py-12 card border-adventure-gold">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-xl font-display text-adventure-gold neon-text mb-2 uppercase">
            NO HAY PUBLICACIONES
          </h3>
          <p className="text-adventure-light font-retro text-sm mb-6 opacity-80">
            {forum ? `Sé el primero en compartir algo en ${forum.title}` : 'No hay publicaciones disponibles'}
          </p>
          
          {isAuthenticated ? (
            <Link 
              to={forumId ? `/forums/${forumId}/posts/create` : '/forums'} 
              className="btn btn-primary text-adventure-dark border-adventure-gold"
            >
              <span className="flex items-center space-x-2">
                <span>⚱️</span>
                <span>CREAR LA PRIMERA PUBLICACIÓN</span>
              </span>
            </Link>
          ) : (
            <Link to="/login" className="btn btn-outline text-adventure-gold border-adventure-gold">
              <span className="flex items-center space-x-2">
                <span>🔐</span>
                <span>INICIA SESIÓN</span>
              </span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

import PropTypes from 'prop-types'

PostList.propTypes = {
  forumId: PropTypes.string,
  posts: PropTypes.array
}

export default PostList

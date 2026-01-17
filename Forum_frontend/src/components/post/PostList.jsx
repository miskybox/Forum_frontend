import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import PostCard from './PostCard'
import postService from '../../services/postService'
import forumService from '../../services/forumService'
import useAuth from '../../hooks/useAuth'

/**
 * PostList - Adventure Explorer Retro Theme with WCAG AA Accessibility
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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-golden border-t-transparent mx-auto mb-4" />
          <p className="text-ocean-400 font-bold text-sm uppercase tracking-normal">
            CARGANDO PUBLICACIONES...
          </p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-10 card border-error">
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <div className="text-error font-bold text-sm uppercase tracking-normal mb-6">
          {error}
        </div>
        <button
          onClick={() => globalThis.location.reload()}
          className="btn btn-primary flex items-center gap-2 mx-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <span>REINTENTAR</span>
        </button>
      </div>
    )
  }
  
  if (forumId && !forum) {
    return (
      <div className="text-center py-10 card border-error">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <div className="text-error font-bold text-sm uppercase tracking-normal mb-6">
          FORO NO ENCONTRADO
        </div>
        <Link to="/forums" className="btn btn-primary flex items-center gap-2 mx-auto">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <span>VER TODOS LOS FOROS</span>
        </Link>
      </div>
    )
  }
  
  return (
    <div>
      {forum && (
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-ocean-400 drop-shadow-md mb-2 uppercase">
              PUBLICACIONES EN {forum.title.toUpperCase()}
            </h2>
            <p className="text-light-soft font-bold text-xs">
              {forum.description}
            </p>
          </div>

          {isAuthenticated && (
            <Link
              to={`/forums/${forumId}/posts/create`}
              className="btn btn-primary whitespace-nowrap flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              <span>NUEVA PUBLICACIÓN</span>
            </Link>
          )}
        </div>
      )}
      
      {posts.length === 0 ? (
        <div className="text-center py-12 card border-ocean-600">
          <div className="w-16 h-16 mx-auto mb-4 bg-aqua/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <h3 className="text-xl font-bold text-ocean-400 drop-shadow-md mb-2 uppercase">
            NO HAY PUBLICACIONES
          </h3>
          <p className="text-light-soft font-bold text-sm mb-6">
            {forum ? `Sé el primero en compartir algo en ${forum.title}` : 'No hay publicaciones disponibles'}
          </p>

          {isAuthenticated ? (
            <Link
              to={forumId ? `/forums/${forumId}/posts/create` : '/forums'}
              className="btn btn-primary flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              <span>CREAR LA PRIMERA PUBLICACIÓN</span>
            </Link>
          ) : (
            <Link to="/login" className="btn btn-outline flex items-center gap-2 mx-auto">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <span>INICIA SESIÓN</span>
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

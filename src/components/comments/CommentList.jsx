// Archivo: src/components/comments/CommentList.jsx
import { useState, useEffect } from 'react'
import CommentItem from './CommentItems';
import CommentForm from './CommetForm';
import commentService from '../../services/commentService';
import useAuth from '../../hooks/useAuth.js';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { isAuthenticated } = useAuth()
  
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const data = await commentService.getCommentsByPost(postId)
        setComments(data)
        setError(null)
      } catch (err) {
        console.error('Error al cargar los comentarios:', err)
        setError('No se pudieron cargar los comentarios. Por favor, inténtalo de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }
    
    if (postId) {
      fetchComments()
    }
  }, [postId])
  
  const handleCommentSubmit = (newComment) => {
    setComments([...comments, newComment])
  }
  
  const handleCommentUpdate = (updatedComment) => {
    setComments(
      comments.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    )
  }
  
  const handleCommentDelete = (deletedCommentId) => {
    setComments(comments.filter(comment => comment.id !== deletedCommentId))
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-6">
        <div className="text-red-600 mb-2">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Reintentar
        </button>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-neutral-800">
        Comentarios ({comments.length})
      </h3>
      
      {isAuthenticated && (
        <div className="mb-6">
          <CommentForm 
            postId={postId} 
            onCommentSubmit={handleCommentSubmit} 
          />
        </div>
      )}
      
      {comments.length === 0 ? (
        <div className="text-center py-6 bg-white rounded-lg shadow-sm p-4">
          <p className="text-neutral-600">
            No hay comentarios aún. ¡Sé el primero en comentar!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onUpdate={handleCommentUpdate}
              onDelete={handleCommentDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import PropTypes from 'prop-types'

CommentList.propTypes = {
  postId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
}

export default CommentList
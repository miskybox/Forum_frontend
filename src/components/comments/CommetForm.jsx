// Archivo: src/components/comments/CommentForm.jsx
import { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-hot-toast'
import commentService from '../../services/commentService'

const CommentForm = ({ postId, onCommentSubmit }) => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      toast.error('El comentario no puede estar vacío')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const commentData = { content }
      const newComment = await commentService.createComment(postId, commentData)
      
      // Notificar al componente padre
      onCommentSubmit(newComment)
      
      // Limpiar el formulario
      setContent('')
      
      toast.success('Comentario publicado')
    } catch (error) {
      console.error('Error al publicar el comentario:', error)
      toast.error('Error al publicar el comentario')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-neutral-100">
      <div className="space-y-3">
        <textarea
          className="input w-full"
          placeholder="Escribe tu comentario..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          disabled={isSubmitting}
          required
        />
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publicando...
              </span>
            ) : (
              'Publicar comentario'
            )}
          </button>
        </div>
      </div>
    </form>
  )
}
CommentForm.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCommentSubmit: PropTypes.func.isRequired,
}


export default CommentForm
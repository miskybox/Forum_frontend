// Archivo: src/components/comments/CommentForm.jsx (versión adaptada)
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import PropTypes from 'prop-types'
import commentService from '../../services/commentService'
import useAuth from '../../hooks/useAuth'

const CommentForm = ({ postId }) => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated } = useAuth()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comentar')
      return
    }
    
    if (!content.trim()) {
      toast.error('El comentario no puede estar vacío')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const commentData = { content }
      await commentService.createComment(postId, commentData)
      
      // Limpiar el formulario
      setContent('')
      
      toast.success('Comentario publicado')
      
      // Recargar la página para ver el nuevo comentario
      // Idealmente, esto se haría con un enfoque más dinámico actualizado solo los comentarios
      window.location.reload()
    } catch (error) {
      console.error('Error al publicar el comentario:', error)
      toast.error('Error al publicar el comentario')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (!isAuthenticated) {
    return (
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 text-center">
        <p className="text-neutral-600 mb-3">Inicia sesión para dejar un comentario</p>
        <a 
          href="/login" 
          className="inline-block px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Iniciar sesión
        </a>
      </div>
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
        <h4 className="text-sm font-medium text-neutral-700">Deja un comentario</h4>
      </div>
      
      <div className="p-4">
        <textarea
          className="w-full border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          placeholder="Escribe tu comentario..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          disabled={isSubmitting}
          required
        />
        
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publicando...' : 'Publicar comentario'}
          </button>
        </div>
      </div>
    </form>
  )
}
CommentForm.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default CommentForm
//
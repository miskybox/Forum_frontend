// Archivo: src/components/post/PostContent.jsx
import { useState } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const PostContent = ({ post }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  
  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return format(date, 'PP', { locale: es })
  }

  return (
    <div className="p-6">
      {/* Título y metadata */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 mb-3">
          {post.title}
        </h1>
        
        <div className="flex items-center flex-wrap gap-2 text-sm text-neutral-500">
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
              {formatDate(post.createdAt)}
            </time>
          </div>
          
          {post.createdAt !== post.updatedAt && (
            <>
              <span className="text-neutral-300">•</span>
              <div className="text-neutral-500 text-xs italic">
                Editado: {formatDate(post.updatedAt)}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="mb-8 prose prose-neutral max-w-none">
        {post.content.split('\n').map((paragraph, index) => (
          paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
        ))}
      </div>
      
      {/* Galería de imágenes (si hay imágenes) */}
      {post.images && post.images.length > 0 && (
        <div className="mb-4">
          {/* Imagen principal */}
          <div className="mb-4">
            <div className="bg-neutral-200 rounded-lg overflow-hidden aspect-video">
              <img 
                src={post.images[activeImageIndex].url} 
                alt={`Imagen ${activeImageIndex + 1} de la publicación`} 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          {/* Miniaturas (solo si hay más de una imagen) */}
          {post.images.length > 1 && (
            <div className="grid grid-cols-6 gap-2">
              {post.images.map((image, index) => (
                <button
                  key={image.id || index}
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
      
      {/* Metadatos adicionales */}
      <div className="flex items-center justify-between text-sm text-neutral-500 pt-4 border-t border-neutral-100">
        <div className="flex space-x-4">
          {/* Número de visitas */}
          {post.viewCount !== undefined && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {post.viewCount} {post.viewCount === 1 ? 'vista' : 'vistas'}
            </div>
          )}
          
          {/* Número de comentarios */}
          {post.commentCount !== undefined && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              {post.commentCount} {post.commentCount === 1 ? 'comentario' : 'comentarios'}
            </div>
          )}
        </div>
        
        {/* Foro al que pertenece la publicación */}
        {post.forum && (
          <div>
            Publicado en:{' '}
            <a 
              href={`/forums/${post.forum.id}`} 
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              {post.forum.title}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
PostContent.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.shape({
      profileImage: PropTypes.string,
      username: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    content: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        url: PropTypes.string,
      })
    ),
    viewCount: PropTypes.number,
    commentCount: PropTypes.number,
    forum: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
    }),
  }).isRequired,
}

export default PostContent

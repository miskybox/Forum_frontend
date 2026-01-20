import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * PostCard - Adventure Explorer Retro Theme with WCAG AA Accessibility
 */
const PostCard = ({ post }) => {
  const { t, language } = useLanguage()

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString)
    const locale = language === 'es' ? es : enUS
    return formatDistanceToNow(date, { addSuffix: true, locale })
  }

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }

  return (
    <div className="card border-ocean-600 overflow-hidden hover:border-ocean-500 transition-all group">
      <Link to={`/posts/${post.id}`} className="block">
        <div className="p-5 bg-dark-lighter">
          {/* Título y metadata */}
          <div className="mb-3">
            <h3 className="text-xl font-bold text-ocean-400 mb-2 hover:text-ocean-300 transition-colors uppercase">
              {post.title}
            </h3>
            <div className="flex items-center text-xs text-light-soft font-bold">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-ocean-500 rounded-full flex items-center justify-center text-dark text-xs overflow-hidden mr-2 border border-ocean-500">
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
                <span className="uppercase">{post.author?.username || t('common.user').toUpperCase()}</span>
              </div>
              <span className="mx-2 text-ocean-400">•</span>
              <time dateTime={post.createdAt} className="uppercase">
                {formatRelativeDate(post.createdAt)}
              </time>
            </div>
          </div>

          {/* Contenido */}
          <div className="mb-4">
            <p className="text-light-soft font-bold text-xs leading-relaxed">
              {truncateText(post.content)}
            </p>
          </div>
          
          {/* Galería (si hay imágenes) */}
          {post.images && post.images.length > 0 && (
            <div className="mb-4">
              <div className={`grid ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                {post.images.slice(0, 4).map((image, index) => (
                  <div
                    key={image.id || index}
                    className={`relative ${post.images.length > 2 && index === 0 ? 'col-span-2' : ''} bg-dark rounded-md overflow-hidden aspect-video border border-ocean-600/30`}
                  >
                    <img
                      src={image.url}
                      alt={`Imagen ${index + 1} de la publicación`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.images.length > 4 && index === 3 && (
                      <div className="absolute inset-0 bg-dark/80 flex items-center justify-center text-ocean-400 font-bold text-lg border-2 border-ocean-600">
                        +{post.images.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Footer con estadísticas */}
          <div className="flex justify-between items-center pt-3 border-t-2 border-ocean-600/30 text-xs">
            <div className="flex items-center space-x-4 text-light-soft font-bold">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-aqua" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                {post.commentCount || 0} {(post.commentCount === 1 ? t('common.comment') : t('common.comments')).toUpperCase()}
              </div>

              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-golden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                {post.viewCount || 0} {(post.viewCount === 1 ? t('common.view') : t('common.views')).toUpperCase()}
              </div>
            </div>

            <div>
              <span className="text-ocean-400 font-bold text-xs uppercase tracking-normal hover:text-ocean-300 transition-colors">
                {t('common.readMore').toUpperCase()} →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

import PropTypes from 'prop-types'

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    author: PropTypes.shape({
      username: PropTypes.string,
      profileImage: PropTypes.string,
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        url: PropTypes.string,
      })
    ),
    commentCount: PropTypes.number,
    viewCount: PropTypes.number,
  }).isRequired,
}

export default PostCard

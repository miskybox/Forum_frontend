import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * ForumCard con estilo retro Adventure
 */
const ForumCard = ({ forum }) => {
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true, locale: es })
  }

  return (
    <div className="card border-adventure-gold overflow-hidden hover:border-adventure-gold/80 transition-all group">
      <div className="md:flex">
        <div className="md:w-1/3 bg-adventure-dark relative overflow-hidden">
          {forum.imageUrl ? (
            <Link to={`/forums/${forum.id}`} className="block h-full">
              <img 
                src={forum.imageUrl} 
                alt={forum.title} 
                className="w-full h-full object-cover aspect-video md:aspect-auto group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-adventure-dark/80 to-transparent"></div>
            </Link>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[160px] bg-adventure-dark">
              <div className="text-6xl opacity-50">🏺</div>
            </div>
          )}
        </div>
        
        <div className="md:w-2/3 p-4 flex flex-col bg-adventure-dark/50">
          <div className="flex-grow">
            <h3 className="text-lg md:text-xl font-display text-adventure-gold neon-text mb-2 break-words">
              <Link to={`/forums/${forum.id}`} className="hover:text-adventure-gold/80 transition-colors">
                {forum.title.toUpperCase()}
              </Link>
            </h3>
            
            <p className="text-adventure-light font-retro text-xs mb-4 line-clamp-2 opacity-80">
              {forum.description}
            </p>
            
            {forum.tags && forum.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {forum.tags.map(tag => (
                  <span key={tag.id} className="inline-flex items-center px-2 py-1 border border-adventure-gold/50 text-adventure-gold font-retro text-xs uppercase tracking-wider">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
 
          <div className="mt-2 pt-2 border-t-2 border-adventure-gold/30 flex justify-between items-center text-xs">
            <div className="flex items-center gap-4 text-adventure-light font-retro">
              <div className="flex items-center">
                <span className="mr-1">💬</span>
                {forum.postCount || 0} {forum.postCount === 1 ? 'PUBLICACIÓN' : 'PUBLICACIONES'}
              </div>
              
              <div className="flex items-center">
                <span className="mr-1">👁️</span>
                {forum.viewCount || 0} {forum.viewCount === 1 ? 'VISTA' : 'VISTAS'}
              </div>
            </div>
            
            <div className="flex items-center text-adventure-light font-retro text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 bg-adventure-gold rounded-full flex items-center justify-center text-adventure-dark text-xs overflow-hidden border border-adventure-gold">
                  {forum.creator?.profileImage ? (
                    <img 
                      src={forum.creator.profileImage} 
                      alt={forum.creator.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    forum.creator?.username?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <span className="uppercase">{forum.creator?.username || 'USUARIO'}</span>
              </div>
              <span className="mx-2 text-adventure-gold">•</span>
              <time dateTime={forum.createdAt} className="uppercase">
                {formatRelativeDate(forum.createdAt)}
              </time>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import PropTypes from 'prop-types'

ForumCard.propTypes = {
  forum: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    imageUrl: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
    postCount: PropTypes.number,
    viewCount: PropTypes.number,
    creator: PropTypes.shape({
      username: PropTypes.string,
      profileImage: PropTypes.string,
    }),
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
}

export default ForumCard

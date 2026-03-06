import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { useLanguage } from '../../contexts/LanguageContext'
import PropTypes from 'prop-types'

/**
 * ForumCard - Nueva paleta del logo
 * Teal (#5A8A7A), Terracota (#A67C52), Dark Green (#3D5F54)
 */
const ForumCard = ({ forum }) => {
  const { t, language } = useLanguage()

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString)
    const locale = language === 'es' ? es : enUS
    return formatDistanceToNow(date, { addSuffix: true, locale })
  }

  return (
    <div className="card overflow-hidden transition-all group">
      {/* Cover image background — full width with gradient overlay */}
      {forum.imageUrl ? (
        <Link to={`/forums/${forum.id}`} className="block relative h-44 overflow-hidden">
          <img
            src={forum.imageUrl}
            alt={forum.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient overlay: opaque at bottom for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
            <h3 className="text-lg md:text-xl font-bold mb-1 break-words [text-shadow:-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000]" style={{ color: '#ffffff' }}>
              {forum.title.toUpperCase()}
            </h3>
            {forum.tags && forum.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {forum.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center px-2 py-0.5 bg-aqua/20 border border-aqua text-aqua font-medium text-xs uppercase tracking-wide rounded"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ) : (
        /* No image — compact horizontal layout */
        <div className="flex items-center gap-4 px-5 pt-5">
          <div className="flex-shrink-0 w-12 h-12 bg-midnight rounded-xl flex items-center justify-center">
            <span className="text-golden text-lg font-bold">FV</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-text break-words flex-1">
            <Link to={`/forums/${forum.id}`} className="hover:text-secondary transition-colors">
              {forum.title.toUpperCase()}
            </Link>
          </h3>
        </div>
      )}

      {/* Body */}
      <div className={`px-5 flex flex-col ${forum.imageUrl ? 'pt-3 pb-4' : 'py-3'}`}>
        {!forum.imageUrl && forum.tags && forum.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {forum.tags.map(tag => (
              <span key={tag.id} className="inline-flex items-center px-3 py-1 bg-secondary/15 border border-secondary text-text font-medium text-xs uppercase tracking-wide rounded">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <p className="text-text-light text-sm mb-3 line-clamp-2">
          {forum.description}
        </p>

        <div className="pt-3 border-t border-primary-dark flex flex-wrap justify-between items-center gap-2 text-xs">
          <div className="flex items-center gap-4 text-secondary font-semibold">
            <div className="flex items-center gap-1">
              <svg aria-hidden="true" className="w-4 h-4 text-aqua" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              <span>{forum.postCount || 0} {(forum.postCount === 1 ? t('common.post') : t('common.posts')).toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-1">
              <svg aria-hidden="true" className="w-4 h-4 text-golden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              <span>{forum.viewCount || 0} {(forum.viewCount === 1 ? t('common.view') : t('common.views')).toUpperCase()}</span>
            </div>
          </div>

          <div className="flex items-center text-text-lighter font-medium text-xs">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center text-white text-xs overflow-hidden border border-secondary-dark">
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
              <span className="uppercase">{forum.creator?.username || t('common.user').toUpperCase()}</span>
            </div>
            <span className="mx-2 text-accent">•</span>
            <time dateTime={forum.createdAt} className="uppercase">
              {formatRelativeDate(forum.createdAt)}
            </time>
          </div>
        </div>
      </div>
    </div>
  )
}

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

import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * ForumCard - Adventure Explorer Retro Theme with WCAG AA Accessibility
 */
const ForumCard = ({ forum }) => {
  const { t, language } = useLanguage()

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString)
    const locale = language === 'es' ? es : enUS
    return formatDistanceToNow(date, { addSuffix: true, locale })
  }

  return (
    <div className="card border-ocean-600 overflow-hidden hover:border-ocean-500 transition-all group">
      <div className="md:flex">
        <div className="md:w-1/3 bg-dark relative overflow-hidden">
          {forum.imageUrl ? (
            <Link to={`/forums/${forum.id}`} className="block h-full">
              <img
                src={forum.imageUrl}
                alt={forum.title}
                className="w-full h-full object-cover aspect-video md:aspect-auto group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>
            </Link>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[160px] bg-dark">
              <div className="text-6xl opacity-50">🏺</div>
            </div>
          )}
        </div>

        <div className="md:w-2/3 p-4 flex flex-col bg-dark-lighter">
          <div className="flex-grow">
            <h3 className="text-lg md:text-xl font-bold text-ocean-500 mb-2 break-words">
              <Link to={`/forums/${forum.id}`} className="hover:text-ocean-400 transition-colors">
                {forum.title.toUpperCase()}
              </Link>
            </h3>

            <p className="text-light-soft font-bold text-xs mb-4 line-clamp-2">
              {forum.description}
            </p>

            {forum.tags && forum.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {forum.tags.map(tag => (
                  <span key={tag.id} className="inline-flex items-center px-2 py-1 bg-terracotta-600/20 border-2 border-terracotta-600 text-terracotta-400 font-bold text-xs uppercase tracking-normal">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t-2 border-ocean-600/30 flex justify-between items-center text-xs">
            <div className="flex items-center gap-4 text-forest-500 font-bold">
              <div className="flex items-center">
                <span className="mr-1">💬</span>
                {forum.postCount || 0} {(forum.postCount === 1 ? t('common.post') : t('common.posts')).toUpperCase()}
              </div>

              <div className="flex items-center">
                <span className="mr-1">👁️</span>
                {forum.viewCount || 0} {(forum.viewCount === 1 ? t('common.view') : t('common.views')).toUpperCase()}
              </div>
            </div>

            <div className="flex items-center text-light-soft font-bold text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-5 h-5 bg-ocean-500 rounded-full flex items-center justify-center text-dark text-xs overflow-hidden border border-ocean-500">
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
              <span className="mx-2 text-ocean-400">•</span>
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

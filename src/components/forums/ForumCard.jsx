import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { formatDistanceToNow } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { MdArrowForward, MdChatBubbleOutline, MdForum, MdVisibility } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import Avatar from '../ui/Avatar'

// The API returns tags as strings; older payloads used { id, name }
const tagName = (tag) => (typeof tag === 'string' ? tag : tag?.name)

const ForumCard = ({ forum }) => {
  const { t, language } = useLanguage()
  const forumUrl = `/forums/${forum.id}`
  const tags = (forum.tags || []).map(tagName).filter(Boolean)

  const relativeDate = (() => {
    const date = new Date(forum.createdAt)
    if (Number.isNaN(date.getTime())) return ''
    return formatDistanceToNow(date, { addSuffix: true, locale: language === 'es' ? es : enUS })
  })()

  const postCount = forum.postCount || 0
  const viewCount = forum.viewCount || 0

  return (
    <article className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-level-1 hover:shadow-level-2 transition-shadow flex flex-col group">
      {/* Cover */}
      <Link to={forumUrl} className="block relative h-40 overflow-hidden bg-surface-container" tabIndex={-1} aria-hidden="true">
        {forum.imageUrl ? (
          <img
            src={forum.imageUrl}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-fixed to-surface-container">
            <MdForum className="text-[3rem] text-secondary/60" />
          </span>
        )}
      </Link>

      <div className="p-space-md sm:p-space-lg flex flex-col flex-1">
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-space-xs mb-space-sm">
            {tags.map((tag) => (
              <li key={tag} className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-caption font-semibold">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <h3 className="font-headline text-headline-sm font-medium text-on-surface break-words">
          <Link to={forumUrl} className="text-on-surface hover:text-primary transition-colors">
            {forum.title}
          </Link>
        </h3>

        {forum.description && (
          <p className="mt-space-xs text-body-sm text-on-surface-variant line-clamp-2">{forum.description}</p>
        )}

        <div className="mt-auto pt-space-md flex flex-wrap items-center justify-between gap-space-sm text-label-md text-on-surface-variant">
          <div className="flex items-center gap-space-md">
            <span className="flex items-center gap-1">
              <MdChatBubbleOutline className="text-body-md" aria-hidden="true" />
              {postCount} {postCount === 1 ? t('common.post') : t('common.posts')}
            </span>
            <span className="flex items-center gap-1">
              <MdVisibility className="text-body-md" aria-hidden="true" />
              {viewCount} {viewCount === 1 ? t('common.view') : t('common.views')}
            </span>
          </div>
          <Link to={forumUrl} className="inline-flex items-center gap-1 text-primary hover:text-primary-container font-semibold">
            {t('forums.viewForum')}
            <MdArrowForward aria-hidden="true" />
          </Link>
        </div>

        {(forum.creatorUsername || forum.creator?.username || relativeDate) && (
          <div className="mt-space-sm pt-space-sm border-t border-surface-container-high flex items-center gap-space-xs text-caption text-on-surface-variant">
            {(forum.creatorUsername || forum.creator?.username) && (
              <>
                <Avatar
                  name={forum.creatorUsername || forum.creator.username}
                  src={forum.creatorAvatarUrl || forum.creator?.profileImage}
                  size="xs"
                />
                <span className="font-semibold">@{forum.creatorUsername || forum.creator.username}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            {relativeDate && <time dateTime={forum.createdAt}>{relativeDate}</time>}
          </div>
        )}
      </div>
    </article>
  )
}

ForumCard.propTypes = {
  forum: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    imageUrl: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          name: PropTypes.string,
        }),
      ])
    ),
    postCount: PropTypes.number,
    viewCount: PropTypes.number,
    creator: PropTypes.shape({
      username: PropTypes.string,
      profileImage: PropTypes.string,
    }),
    creatorUsername: PropTypes.string,
    creatorAvatarUrl: PropTypes.string,
    createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    createdAt: PropTypes.string,
  }).isRequired,
}

export default ForumCard

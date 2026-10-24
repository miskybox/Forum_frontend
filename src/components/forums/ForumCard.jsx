import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { formatDistanceToNow } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { MdArrowForward, MdChatBubbleOutline, MdForum, MdVisibility } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import Avatar from '../ui/Avatar'
import { surfaceToneFor } from '../../utils/surfaceTones'
import { decodeHtmlEntities } from '../../utils/htmlEntities'

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
  const tone = surfaceToneFor({ categoryName: forum.categoryName, id: forum.id })
  const coverSrc = forum.imageUrl
  const title = decodeHtmlEntities(forum.title)
  const description = decodeHtmlEntities(forum.description)
  const categoryHref = forum.categoryId ? `/forums/category/${forum.categoryId}` : null

  return (
    <article className={`${tone.article} rounded-lg overflow-hidden shadow-level-1 hover:shadow-level-2 transition-shadow flex flex-col group`}>
      {/* Cover */}
      <Link to={forumUrl} className="block relative h-40 overflow-hidden bg-surface-container" tabIndex={-1} aria-hidden="true">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${tone.placeholder}`}>
            <MdForum className="text-[3rem] opacity-50" />
          </span>
        )}
      </Link>

      <div className="p-space-md sm:p-space-lg flex flex-col flex-1">
        {(forum.categoryName || tags.length > 0) && (
          <ul className="flex flex-wrap gap-space-xs mb-space-sm">
            {forum.categoryName && (
              <li>
                {categoryHref ? (
                  <Link to={categoryHref} className={`px-space-sm py-0.5 rounded-full text-caption font-semibold ${tone.tag}`}>
                    {forum.categoryName}
                  </Link>
                ) : (
                  <span className={`px-space-sm py-0.5 rounded-full text-caption font-semibold ${tone.tag}`}>
                    {forum.categoryName}
                  </span>
                )}
              </li>
            )}
            {tags.filter((tag) => tag !== forum.categoryName).map((tag) => (
              <li key={tag} className={`px-space-sm py-0.5 rounded-full text-caption font-semibold ${tone.tag}`}>
                {tag}
              </li>
            ))}
          </ul>
        )}

        <h3 className="font-headline text-headline-sm font-medium break-words">
          <Link to={forumUrl} className={`${tone.title} transition-colors`}>
            {title}
          </Link>
        </h3>

        {description && (
          <p className={`mt-space-xs text-body-sm line-clamp-2 ${tone.muted}`}>{description}</p>
        )}

        <div className={`mt-auto pt-space-md flex flex-wrap items-center justify-between gap-space-sm text-label-md ${tone.muted}`}>
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
          <Link to={forumUrl} className={`inline-flex items-center gap-1 font-semibold ${tone.action}`}>
            {t('forums.viewForum')}
            <MdArrowForward aria-hidden="true" />
          </Link>
        </div>

        {(forum.creatorUsername || forum.creator?.username || relativeDate) && (
          <div className={`mt-space-sm pt-space-sm border-t ${tone.border} flex items-center gap-space-xs text-caption ${tone.muted}`}>
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
    categoryName: PropTypes.string,
    categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
}

export default ForumCard

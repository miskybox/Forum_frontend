import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { formatDistanceToNow } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { MdArrowForward, MdChatBubbleOutline, MdVisibility } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import Avatar from '../ui/Avatar'

const MAX_IMAGES = 3

const truncate = (text, maxLength = 180) => {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trimEnd()}…`
}

const PostCard = ({ post }) => {
  const { t, language } = useLanguage()
  const username = post.author?.username || post.username || t('common.user')
  const avatarUrl = post.authorAvatarUrl || post.author?.profileImage
  const images = post.images?.length
    ? post.images
    : (post.imageUrls || []).map((url, index) => ({ id: index, url }))
  const commentCount = post.commentCount || 0
  const viewCount = post.viewCount || 0

  const relativeDate = (() => {
    const date = new Date(post.createdAt)
    if (Number.isNaN(date.getTime())) return ''
    return formatDistanceToNow(date, { addSuffix: true, locale: language === 'es' ? es : enUS })
  })()

  return (
    <article className="bg-surface-container-lowest rounded-lg shadow-level-1 hover:shadow-level-2 transition-shadow">
      <Link to={`/posts/${post.id}`} className="block p-space-md sm:p-space-lg text-on-surface hover:text-on-surface group">
        {/* Author row */}
        <div className="flex items-center gap-space-sm mb-space-sm">
          <Avatar name={username} src={avatarUrl} size="sm" />
          <span className="text-label-lg text-on-surface">@{username}</span>
          {relativeDate && (
            <>
              <span className="text-on-surface-variant" aria-hidden="true">·</span>
              <time dateTime={post.createdAt} className="text-caption text-on-surface-variant">{relativeDate}</time>
            </>
          )}
        </div>

        <h3 className="font-headline text-headline-sm font-medium text-on-surface group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        {post.content && (
          <p className="mt-space-xs text-body-sm text-on-surface-variant">{truncate(post.content)}</p>
        )}

        {images.length > 0 && (
          <div className={`grid gap-space-xs mt-space-md rounded-base overflow-hidden ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {images.slice(0, MAX_IMAGES).map((image, index) => (
              <div key={image.id || index} className="relative aspect-video overflow-hidden bg-surface-container">
                <img
                  src={image.url}
                  alt={`Imagen ${index + 1} de la publicación`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {images.length > MAX_IMAGES && index === MAX_IMAGES - 1 && (
                  <span className="absolute inset-0 bg-inverse-surface/50 flex items-center justify-center text-on-primary text-label-md">
                    +{images.length - MAX_IMAGES}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-space-md pt-space-sm flex items-center justify-between gap-space-sm text-label-md text-on-surface-variant">
          <div className="flex items-center gap-space-md">
            <span className="flex items-center gap-1">
              <MdChatBubbleOutline className="text-body-md" aria-hidden="true" />
              {commentCount} {commentCount === 1 ? t('common.comment') : t('common.comments')}
            </span>
            <span className="flex items-center gap-1">
              <MdVisibility className="text-body-md" aria-hidden="true" />
              {viewCount} {viewCount === 1 ? t('common.view') : t('common.views')}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-primary font-semibold">
            {t('common.readMore')}
            <MdArrowForward aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  )
}

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    username: PropTypes.string,
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

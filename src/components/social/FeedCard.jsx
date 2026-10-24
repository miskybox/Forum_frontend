import { Link } from 'react-router-dom'
import { MdArrowForward, MdChatBubbleOutline, MdSchedule } from 'react-icons/md'
import { readingMinutes } from '../../utils/readingTime'
import FollowButton from './FollowButton'
import ShareButton from './ShareButton'
import LikeButton from './LikeButton'
import Avatar from '../ui/Avatar'
import { surfaceToneFor } from '../../utils/surfaceTones'

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const diffMs = Date.now() - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Ahora'
  if (diffMins < 60) return `hace ${diffMins}m`
  if (diffHours < 24) return `hace ${diffHours}h`
  if (diffDays < 7) return `hace ${diffDays}d`
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

const FeedCard = ({ item }) => {
  const postUrl = `/posts/${item.postId}`
  const tone = surfaceToneFor({
    forumName: item.forumName,
    categoryName: item.categoryName,
    id: item.postId || item.id,
  })

  return (
    <article className={`${tone.article} rounded-lg p-space-md sm:p-space-lg shadow-level-1 hover:shadow-level-2 transition-shadow`}>
      {/* Author row */}
      <div className="flex items-center justify-between gap-space-sm mb-space-sm">
        <Link
          to={`/profile/${item.authorId}`}
          className="flex items-center gap-space-sm min-w-0 group"
        >
          {item.authorAvatarUrl ? (
            <img
              src={item.authorAvatarUrl}
              alt={item.authorUsername}
              loading="lazy"
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <Avatar name={item.authorUsername} />
          )}
          <span className="min-w-0">
            <span className={`block text-body-md font-bold truncate transition-colors ${tone.title}`}>
              {item.authorUsername}
            </span>
            <span className={`block text-caption ${tone.muted}`}>
              {formatDate(item.createdAt)}
              {' · '}
              <MdSchedule className="inline align-text-bottom" aria-hidden="true" />
              {' '}
              {item.readingMinutes || readingMinutes(item.content)} min
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-space-sm flex-shrink-0">
          {item.forumName && (
            <Link
              to={`/forums/${item.forumId}`}
              className={`hidden sm:inline-flex px-space-sm py-0.5 rounded-full text-label-md ${tone.tag}`}
            >
              {item.forumName}
            </Link>
          )}
          <FollowButton userId={item.authorId} size="sm" />
        </div>
      </div>

      {/* Title + excerpt */}
      <Link to={postUrl} className="group block">
        <h3 className={`font-headline text-headline-sm sm:text-[1.5rem] sm:leading-8 font-medium transition-colors ${tone.title}`}>
          {item.title}
        </h3>
      </Link>
      {item.content && (
        <p className={`mt-space-xs text-body-sm sm:text-body-md line-clamp-3 ${tone.muted}`}>
          {item.content}
        </p>
      )}

      {item.imageUrl && (
        <Link to={postUrl} className="block mt-space-md rounded-base overflow-hidden group" tabIndex={-1}>
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}

      {/* Footer */}
      <div className={`mt-space-md pt-space-sm flex items-center justify-between gap-space-sm text-body-sm ${tone.muted}`}>
        <div className="flex items-center gap-space-md">
          <LikeButton
            postId={item.postId}
            initialLiked={item.liked}
            initialCount={item.likeCount || 0}
            size="sm"
          />
          <Link to={postUrl} className={`flex items-center gap-1.5 transition-colors ${tone.action}`}>
            <MdChatBubbleOutline className="text-title-md" aria-hidden="true" />
            <span>{item.commentCount || 0}</span>
            <span className="sr-only">respuestas</span>
          </Link>
          <ShareButton postId={item.postId} title={item.title} size="sm" />
        </div>
        <Link to={postUrl} className={`hidden sm:inline-flex items-center gap-space-xs text-label-md font-semibold ${tone.action}`}>
          <span>Participar</span>
          <MdArrowForward className="text-body-md" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export default FeedCard

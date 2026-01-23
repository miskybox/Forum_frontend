import { Link } from 'react-router-dom'
import FollowButton from './FollowButton'
import ShareButton from './ShareButton'
import LikeButton from './LikeButton'

const FeedCard = ({ item }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `hace ${diffMins}m`
    if (diffHours < 24) return `hace ${diffHours}h`
    if (diffDays < 7) return `hace ${diffDays}d`
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-beige-dark hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-beige-dark/50">
        <Link
          to={`/profile/${item.authorId}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            src={item.authorAvatarUrl || '/default-avatar.png'}
            alt={item.authorUsername}
            className="w-10 h-10 rounded-full object-cover border-2 border-teal"
          />
          <div>
            <span className="font-semibold text-forest block">{item.authorUsername}</span>
            <span className="text-xs text-forest/60">{formatDate(item.createdAt)}</span>
          </div>
        </Link>
        <FollowButton userId={item.authorId} size="sm" />
      </div>

      {/* Image (if exists) */}
      {item.imageUrl && (
        <Link to={`/posts/${item.postId}`}>
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-64 object-cover hover:opacity-95 transition-opacity"
          />
        </Link>
      )}

      {/* Content */}
      <div className="p-4">
        <Link to={`/posts/${item.postId}`} className="group">
          <h3 className="font-bold text-forest text-lg mb-2 group-hover:text-teal transition-colors">
            {item.title}
          </h3>
        </Link>
        <p className="text-forest/80 text-sm leading-relaxed">
          {item.content}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-3 bg-beige/30 border-t border-beige-dark/50">
        <Link
          to={`/forums/${item.forumId}`}
          className="text-sm text-teal hover:underline"
        >
          {item.forumName}
        </Link>
        <div className="flex items-center gap-4 text-sm text-forest/60">
          <LikeButton
            postId={item.postId}
            initialLiked={item.liked}
            initialCount={item.likeCount || 0}
            size="sm"
          />
          <Link
            to={`/posts/${item.postId}`}
            className="flex items-center gap-1 hover:text-teal transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {item.commentCount || 0}
          </Link>
          <ShareButton postId={item.postId} title={item.title} size="sm" />
        </div>
      </div>
    </div>
  )
}

export default FeedCard

import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'react-hot-toast'
import commentService from '../../services/commentService'
import useAuth from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import Avatar from '../ui/Avatar'

// The API returns flat fields (userId, username, userAvatar); older code used a nested `author`
const getAuthor = (comment) => ({
  id: comment.author?.id ?? comment.userId,
  username: comment.author?.username ?? comment.username,
  avatar: comment.author?.profileImage ?? comment.userAvatar,
})

const formatRelativeDate = (dateString) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  return formatDistanceToNow(date, { addSuffix: true, locale: es })
}

const actionClass = 'text-label-md text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50'

const CommentItem = ({ comment, postAuthorId, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { currentUser, hasRole } = useAuth()
  const { t } = useLanguage()

  const author = getAuthor(comment)
  const isAuthor = currentUser?.id != null && currentUser.id === author.id
  const canDelete = isAuthor || hasRole?.('ADMIN') || hasRole?.('MODERATOR')
  const isPostAuthor = postAuthorId != null && postAuthorId === author.id
  const wasEdited = comment.updatedAt && comment.updatedAt !== comment.createdAt

  const handleUpdate = async () => {
    if (!editContent.trim()) {
      toast.error(t('comments.emptyError'))
      return
    }
    setIsSubmitting(true)
    try {
      const updated = await commentService.updateComment(comment.id, { content: editContent })
      onUpdate(updated)
      setIsEditing(false)
      toast.success(t('comments.updated'))
    } catch (error) {
      console.error('Error updating comment:', error)
      toast.error(t('comments.updateError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(t('comments.confirmDelete'))) return
    setIsSubmitting(true)
    try {
      await commentService.deleteComment(comment.id)
      onDelete(comment.id)
      toast.success(t('comments.deleted'))
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error(t('comments.deleteError'))
      setIsSubmitting(false)
    }
  }

  return (
    <article className="bg-surface-container-lowest rounded-lg p-space-md sm:p-space-lg shadow-level-1">
      <header className="flex items-start justify-between gap-space-sm mb-space-sm">
        <div className="flex items-center gap-space-sm min-w-0">
          <Avatar name={author.username} src={author.avatar} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2">
              {author.id != null ? (
                <Link to={`/profile/${author.id}`} className="text-body-md font-bold text-on-surface hover:text-primary truncate">
                  @{author.username || t('comments.unknownUser')}
                </Link>
              ) : (
                <span className="text-body-md font-bold text-on-surface">{t('comments.unknownUser')}</span>
              )}
              {isPostAuthor && (
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-caption font-semibold">
                  {t('comments.postAuthor')}
                </span>
              )}
            </div>
            <span className="text-caption text-on-surface-variant">
              <time dateTime={comment.createdAt}>{formatRelativeDate(comment.createdAt)}</time>
              {wasEdited && <> · {t('comments.edited')}</>}
            </span>
          </div>
        </div>
      </header>

      {isEditing ? (
        <div className="space-y-space-sm">
          <label htmlFor={`edit-comment-${comment.id}`} className="sr-only">{t('comments.editComment')}</label>
          <textarea
            id={`edit-comment-${comment.id}`}
            className="bg-surface-container-low resize-y"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
          <div className="flex justify-end gap-space-xs">
            <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)} disabled={isSubmitting}>
              {t('comments.cancel')}
            </button>
            <button type="button" className="btn btn-primary" onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? t('comments.saving') : t('comments.save')}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-body-md text-on-surface whitespace-pre-line break-words">{comment.content}</p>
      )}

      {!isEditing && (isAuthor || canDelete) && (
        <footer className="flex items-center gap-space-md pt-space-sm">
          {isAuthor && (
            <button
              type="button"
              className={actionClass}
              onClick={() => {
                setEditContent(comment.content)
                setIsEditing(true)
              }}
              disabled={isSubmitting}
            >
              {t('comments.edit')}
            </button>
          )}
          {canDelete && (
            <button type="button" className={actionClass} onClick={handleDelete} disabled={isSubmitting}>
              {t('comments.delete')}
            </button>
          )}
        </footer>
      )}
    </article>
  )
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    username: PropTypes.string,
    userAvatar: PropTypes.string,
    author: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      username: PropTypes.string,
      profileImage: PropTypes.string,
    }),
  }).isRequired,
  postAuthorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default CommentItem

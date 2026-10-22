import { useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { MdSend, MdVerified } from 'react-icons/md'
import useAuth from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import commentService from '../../services/commentService'
import { sanitizeInput, validateLength, LENGTH_LIMITS } from '../../utils/sanitize'

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated, currentUser } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error(t('comments.emptyError'))
      return
    }

    const lengthValidation = validateLength(
      content,
      LENGTH_LIMITS.COMMENT_CONTENT.min,
      LENGTH_LIMITS.COMMENT_CONTENT.max
    )
    if (!lengthValidation.valid) {
      toast.error(lengthValidation.error)
      return
    }

    try {
      setIsSubmitting(true)
      const sanitizedContent = sanitizeInput(content.trim(), 'BASIC')
      const newComment = await commentService.createComment(postId, { content: sanitizedContent, postId })
      setContent('')
      toast.success(t('comments.published'))
      onCommentAdded?.(newComment)
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error(t('comments.publishError'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-level-1 text-center text-body-md text-on-surface-variant">
        <Link to="/login" className="font-semibold">{t('comments.loginLink')}</Link> {t('comments.loginToReply')}
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface-container-lowest rounded-lg p-space-md sm:p-space-lg shadow-level-2 space-y-space-md"
      aria-labelledby="comment-form-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-space-xs">
        <h2 id="comment-form-title" className="font-body text-headline-sm text-on-surface">
          {t('comments.composerTitle')}
        </h2>
        {currentUser?.username && (
          <span className="text-caption text-on-surface-variant">
            {t('comments.loggedAs')} <strong>@{currentUser.username}</strong>
          </span>
        )}
      </div>

      <div>
        <label htmlFor="comment-content" className="sr-only">{t('comments.writeComment')}</label>
        <textarea
          id="comment-content"
          className="bg-surface-container-low border-transparent resize-y min-h-[120px]"
          placeholder={t('comments.placeholder')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          required
          maxLength={LENGTH_LIMITS.COMMENT_CONTENT.max}
          rows={4}
          aria-describedby="comment-content-count"
        />
        <p id="comment-content-count" className="mt-1 text-caption text-on-surface-variant text-right">
          {content.length}/{LENGTH_LIMITS.COMMENT_CONTENT.max} {t('comments.characters')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm">
        <p className="flex items-center gap-2 text-caption text-on-surface-variant">
          <MdVerified className="text-body-md text-secondary" aria-hidden="true" />
          {t('comments.conduct')}
        </p>
        <div className="flex items-center gap-space-xs w-full sm:w-auto justify-end">
          <button
            type="button"
            className="px-space-md py-2 rounded-full text-label-md text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
            onClick={() => setContent('')}
            disabled={isSubmitting || !content}
          >
            {t('comments.discard')}
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            <MdSend aria-hidden="true" />
            {isSubmitting ? t('comments.submitting') : t('comments.publish')}
          </button>
        </div>
      </div>
    </form>
  )
}

CommentForm.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCommentAdded: PropTypes.func,
}

export default CommentForm

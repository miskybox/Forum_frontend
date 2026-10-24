import { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { MdFormatBold, MdFormatItalic, MdFormatListBulleted, MdLink, MdSend, MdVerified } from 'react-icons/md'
import useAuth from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import commentService from '../../services/commentService'
import { sanitizeInput, validateLength, LENGTH_LIMITS } from '../../utils/sanitize'
import { wrapText } from '../../utils/wrapText'

const CommentForm = ({ postId, parentId, onCommentAdded, compact = false }) => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const textareaRef = useRef(null)
  const { isAuthenticated, currentUser } = useAuth()
  const { t } = useLanguage()

  const applyWrap = (before, after = before, fallback = t('comments.writeComment')) => {
    const field = textareaRef.current
    const start = field?.selectionStart ?? content.length
    const end = field?.selectionEnd ?? content.length
    const next = wrapText(content, start, end, before, after, fallback)
    setContent(next.value)
    requestAnimationFrame(() => {
      field?.focus()
      field?.setSelectionRange(next.selectionStart, next.selectionEnd)
    })
  }

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
      const newComment = await commentService.createComment(postId, {
        content: sanitizedContent,
        postId,
        ...(parentId ? { parentId } : {}),
      })
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
      className={compact
        ? 'space-y-space-sm'
        : 'bg-surface-container-lowest rounded-lg p-space-md sm:p-space-lg shadow-level-2 space-y-space-md'}
      aria-labelledby={compact ? undefined : 'comment-form-title'}
    >
      {!compact && (
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
      )}

      <div>
        <label htmlFor={compact ? `comment-reply-${parentId}` : 'comment-content'} className="sr-only">
          {compact ? t('comments.replyPlaceholder') : t('comments.writeComment')}
        </label>
        <div
          className="flex flex-wrap gap-space-xs mb-space-xs"
          role="toolbar"
          aria-label={t('comments.toolbarLabel')}
        >
          <button type="button" className="btn-icon" aria-label={t('comments.bold')} onClick={() => applyWrap('**', '**', 'texto')} disabled={isSubmitting}>
            <MdFormatBold aria-hidden="true" />
          </button>
          <button type="button" className="btn-icon" aria-label={t('comments.italic')} onClick={() => applyWrap('*', '*', 'texto')} disabled={isSubmitting}>
            <MdFormatItalic aria-hidden="true" />
          </button>
          <button type="button" className="btn-icon" aria-label={t('comments.list')} onClick={() => applyWrap('- ', '', 'item')} disabled={isSubmitting}>
            <MdFormatListBulleted aria-hidden="true" />
          </button>
          <button type="button" className="btn-icon" aria-label={t('comments.link')} onClick={() => applyWrap('[', '](https://)', 'enlace')} disabled={isSubmitting}>
            <MdLink aria-hidden="true" />
          </button>
        </div>
        <textarea
          ref={textareaRef}
          id={compact ? `comment-reply-${parentId}` : 'comment-content'}
          className={`bg-surface-container-low border-transparent resize-y ${compact ? 'min-h-[72px]' : 'min-h-[120px]'}`}
          placeholder={compact ? t('comments.replyPlaceholder') : t('comments.placeholder')}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
          required
          maxLength={LENGTH_LIMITS.COMMENT_CONTENT.max}
          rows={compact ? 2 : 4}
          aria-describedby={compact ? `comment-reply-count-${parentId}` : 'comment-content-count'}
        />
        <p id={compact ? `comment-reply-count-${parentId}` : 'comment-content-count'} className="mt-1 text-caption text-on-surface-variant text-right">
          {content.length}/{LENGTH_LIMITS.COMMENT_CONTENT.max} {t('comments.characters')}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-space-sm">
        {!compact && (
          <p className="flex items-center gap-2 text-caption text-on-surface-variant">
            <MdVerified className="text-body-md text-secondary" aria-hidden="true" />
            {t('comments.conduct')}
          </p>
        )}
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
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCommentAdded: PropTypes.func,
  compact: PropTypes.bool,
}

export default CommentForm

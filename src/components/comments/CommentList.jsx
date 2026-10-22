import { useState } from 'react'
import PropTypes from 'prop-types'
import CommentItem from './CommentItems'
import { useLanguage } from '../../contexts/LanguageContext'

const sortButtonClass = (active) =>
  `px-3 py-1.5 rounded-full transition-colors ${
    active ? 'bg-secondary text-on-secondary' : 'text-on-surface-variant hover:text-on-surface'
  }`

const CommentList = ({ comments, postAuthorId, onCommentUpdated, onCommentDeleted }) => {
  const { t } = useLanguage()
  const [sortOrder, setSortOrder] = useState('newest')

  const sortedComments = [...comments].sort((a, b) => {
    const diff = new Date(b.createdAt) - new Date(a.createdAt)
    return sortOrder === 'newest' ? diff : -diff
  })

  return (
    <div className="space-y-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-lg shadow-level-1">
        <h2 className="font-body text-headline-sm text-on-surface">
          {comments.length} {t('postDetail.replies')}
        </h2>
        {comments.length > 1 && (
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full text-label-md" role="group" aria-label={t('comments.sortLabel')}>
            <button type="button" aria-pressed={sortOrder === 'newest'} onClick={() => setSortOrder('newest')} className={sortButtonClass(sortOrder === 'newest')}>
              {t('comments.sortNewest')}
            </button>
            <button type="button" aria-pressed={sortOrder === 'oldest'} onClick={() => setSortOrder('oldest')} className={sortButtonClass(sortOrder === 'oldest')}>
              {t('comments.sortOldest')}
            </button>
          </div>
        )}
      </div>

      {sortedComments.length === 0 ? (
        <p className="bg-surface-container-lowest rounded-lg p-space-lg text-center text-body-md text-on-surface-variant shadow-level-1">
          {t('comments.empty')}
        </p>
      ) : (
        sortedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postAuthorId={postAuthorId}
            onUpdate={onCommentUpdated}
            onDelete={onCommentDeleted}
          />
        ))
      )}
    </div>
  )
}

CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  postAuthorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onCommentUpdated: PropTypes.func.isRequired,
  onCommentDeleted: PropTypes.func.isRequired,
}

export default CommentList

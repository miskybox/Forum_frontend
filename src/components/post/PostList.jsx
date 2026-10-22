import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { MdAddCircleOutline, MdErrorOutline, MdEditNote } from 'react-icons/md'
import PostCard from './PostCard'
import EmptyState from '../ui/EmptyState'
import postService from '../../services/postService'
import useAuth from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'

const toList = (response) => (Array.isArray(response) ? response : response?.content || [])

/**
 * List of post cards. Pass `posts` to render them directly, or `forumId`
 * (prop or route param) to load the forum's posts.
 */
const PostList = ({ forumId: propForumId, posts: propPosts }) => {
  const { forumId: paramForumId } = useParams()
  const forumId = propForumId || paramForumId
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const [loadedPosts, setLoadedPosts] = useState([])
  const [loading, setLoading] = useState(!propPosts && Boolean(forumId))
  const [error, setError] = useState(false)

  useEffect(() => {
    if (propPosts || !forumId) return
    let cancelled = false
    setLoading(true)
    postService
      .getPostsByForum(forumId)
      .then((data) => !cancelled && setLoadedPosts(toList(data)))
      .catch((err) => {
        console.error('Error loading posts:', err)
        if (!cancelled) setError(true)
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [forumId, propPosts])

  const posts = propPosts || loadedPosts

  if (loading) {
    return (
      <output className="block text-center py-space-xl" aria-live="polite">
        <span className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-fixed border-t-primary" aria-hidden="true" />
        <span className="block mt-space-sm text-body-sm text-on-surface-variant">{t('common.loading')}</span>
      </output>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={MdErrorOutline}
        title={t('forums.errorLoadingPosts')}
        action={
          <button type="button" onClick={() => globalThis.location.reload()} className="btn btn-primary">
            {t('forumList.retry')}
          </button>
        }
      />
    )
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={MdEditNote}
        title={t('forums.noPosts')}
        action={
          isAuthenticated ? (
            <Link to={forumId ? `/forums/${forumId}/posts/create` : '/forums'} className="btn btn-primary">
              <MdAddCircleOutline aria-hidden="true" />
              {t('forums.beFirst')}
            </Link>
          ) : (
            <Link to="/login" className="btn btn-outline">
              {t('nav.login')}
            </Link>
          )
        }
      />
    )
  }

  return (
    <div className="space-y-space-md">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

PostList.propTypes = {
  forumId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  posts: PropTypes.array,
}

export default PostList

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  MdCalendarMonth,
  MdCategory,
  MdChevronRight,
  MdDelete,
  MdEdit,
  MdForum,
  MdReply,
  MdVisibility,
} from 'react-icons/md'
import useAuth from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import postService from '../services/postService'
import commentService from '../services/commentService'
import forumService from '../services/forumService'
import categoryService from '../services/categoryService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PostHeader from '../components/post/PostHeader'
import PostContent from '../components/post/PostContent'
import CommentList from '../components/comments/CommentList'
import CommentForm from '../components/comments/CommentForm'
import LikeButton from '../components/social/LikeButton'
import ShareButton from '../components/social/ShareButton'
import SectionCard from '../components/ui/SectionCard'
import Seo from '../components/common/SEO'
import { formatLongDate } from '../utils/formatDate'

const pillClass =
  'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface shadow-level-1 hover:text-primary transition-colors'

const toList = (response) => (Array.isArray(response) ? response : response?.content || [])

const FactRow = ({ icon, label, children }) => {
  const Icon = icon

  return (
    <div className="flex items-start gap-space-sm p-space-xs">
      <span className="p-2 rounded-base bg-surface-container text-secondary flex items-center justify-center">
        <Icon className="text-title-md" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-caption text-on-surface-variant uppercase tracking-wider">{label}</dt>
        <dd className="text-body-md font-bold text-on-surface break-words">{children}</dd>
      </div>
    </div>
  )
}

const PostDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, hasRole } = useAuth()
  const { t } = useLanguage()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [forum, setForum] = useState(null)
  const [category, setCategory] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchPost = async () => {
      try {
        setLoading(true)
        const postData = await postService.getPostById(id)
        if (cancelled) return
        setPost(postData)
        loadContext(postData)
      } catch (error) {
        console.error('Error loading post:', error)
        toast.error(t('postDetail.loadError'))
        navigate('/forums')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    // Forum, category and related posts are secondary: failures only hide those blocks
    const loadContext = async (postData) => {
      if (!postData?.forumId) return
      const [forumResult, postsResult] = await Promise.allSettled([
        forumService.getForumById(postData.forumId),
        postService.getPostsByForum(postData.forumId),
      ])
      if (cancelled) return
      if (postsResult.status === 'fulfilled') {
        setRelated(toList(postsResult.value).filter((p) => String(p.id) !== String(postData.id)).slice(0, 4))
      }
      if (forumResult.status === 'fulfilled' && forumResult.value) {
        setForum(forumResult.value)
        if (forumResult.value.categoryId) {
          try {
            const categoryData = await categoryService.getCategoryById(forumResult.value.categoryId)
            if (!cancelled) setCategory(categoryData)
          } catch {
            // Breadcrumb works without the category
          }
        }
      }
    }

    const fetchComments = async () => {
      try {
        setCommentLoading(true)
        const commentsData = await commentService.getCommentsByPost(id)
        if (!cancelled) setComments(toList(commentsData))
      } catch (error) {
        console.error('Error loading comments:', error)
        toast.error(t('comments.loadError'))
      } finally {
        if (!cancelled) setCommentLoading(false)
      }
    }

    fetchPost()
    fetchComments()
    return () => {
      cancelled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate])

  const handleDeletePost = async () => {
    if (!window.confirm(t('postDetail.confirmDelete'))) return
    try {
      await postService.deletePost(id)
      toast.success(t('postDetail.deleted'))
      navigate(`/forums/${post.forumId}`)
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error(t('postDetail.deleteError'))
    }
  }

  const handleCommentAdded = (newComment) => setComments((prev) => [...prev, newComment])
  const handleCommentUpdated = (updated) =>
    setComments((prev) => prev.map((comment) => (comment.id === updated.id ? updated : comment)))
  const handleCommentDeleted = (commentId) =>
    setComments((prev) => prev.filter((comment) => comment.id !== commentId))

  if (loading || !post) {
    return <LoadingSpinner />
  }

  const isPostAuthor = currentUser && post.createdBy === currentUser.id
  const canEditPost = isPostAuthor || hasRole('ADMIN') || hasRole('MODERATOR')
  const canDeletePost = isPostAuthor || hasRole('ADMIN')

  const postDescription = post.content
    ? post.content.replace(/<[^>]+>/g, '').slice(0, 160)
    : `Post en ForumViajeros por ${post.username}`

  const actions = (
    <>
      <span className={pillClass}>
        <LikeButton postId={post.id} size="md" />
      </span>
      <span className={pillClass}>
        <ShareButton postId={post.id} title={post.title} size="md" />
      </span>
      {canEditPost && (
        <Link to={`/posts/${id}/edit`} className={pillClass} aria-label={t('postDetail.edit')}>
          <MdEdit aria-hidden="true" />
          <span className="hidden sm:inline text-label-lg">{t('postDetail.edit')}</span>
        </Link>
      )}
      {canDeletePost && (
        <button type="button" onClick={handleDeletePost} className={`${pillClass} hover:text-error`} aria-label={t('postDetail.delete')}>
          <MdDelete aria-hidden="true" />
          <span className="hidden sm:inline text-label-lg">{t('postDetail.delete')}</span>
        </button>
      )}
    </>
  )

  return (
    <div className="flex flex-col w-full">
      <Seo
        title={post.title}
        description={postDescription}
        url={`/posts/${post.id}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'DiscussionForumPosting',
          headline: post.title,
          text: postDescription,
          author: { '@type': 'Person', name: post.username },
          url: `https://forumviajeros.com/posts/${post.id}`,
        }}
      />

      <PostHeader post={post} forum={forum} category={category} commentCount={comments.length} actions={actions} />

      <div className="max-w-7xl mx-auto w-full px-gutter-sm lg:px-gutter-lg py-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">

          {/* Main column */}
          <div className="lg:col-span-8 space-y-margin">
            <article className="bg-surface-container-lowest rounded-lg p-space-md sm:p-space-lg shadow-level-1">
              <PostContent post={post} />
              <div className="mt-space-lg pt-space-md border-t border-surface-container-high flex justify-end">
                <a href="#reply" className="btn btn-secondary">
                  <MdReply aria-hidden="true" />
                  {t('postDetail.reply')}
                </a>
              </div>
            </article>

            <section id="comments" className="space-y-space-md" aria-label={t('comments.title')}>
              {commentLoading ? (
                <LoadingSpinner />
              ) : (
                <CommentList
                  comments={comments}
                  postAuthorId={post.createdBy}
                  onCommentUpdated={handleCommentUpdated}
                  onCommentDeleted={handleCommentDeleted}
                />
              )}
              <div id="reply" className="scroll-mt-24">
                <CommentForm postId={id} onCommentAdded={handleCommentAdded} />
              </div>
            </section>
          </div>

          {/* Side rail */}
          <aside className="lg:col-span-4 space-y-space-md lg:sticky lg:top-24">
            <SectionCard title={t('postDetail.factsTitle')}>
              <dl className="space-y-space-xs">
                <FactRow icon={MdForum} label={t('postDetail.forum')}>
                  <Link to={`/forums/${post.forumId}`} className="text-primary hover:text-primary-container">
                    {forum?.title || t('postDetail.backToForum')}
                  </Link>
                </FactRow>
                {category && (
                  <FactRow icon={MdCategory} label={t('postDetail.category')}>
                    {category.name}
                  </FactRow>
                )}
                <FactRow icon={MdCalendarMonth} label={t('postDetail.publishedOn')}>
                  {formatLongDate(post.createdAt, t('postDetail.unknownDate'))}
                </FactRow>
                <FactRow icon={MdVisibility} label={t('postDetail.views')}>
                  {post.viewCount || 0}
                </FactRow>
              </dl>
            </SectionCard>

            {related.length > 0 && (
              <SectionCard title={t('postDetail.related')}>
                <ul className="divide-y divide-surface-container">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link to={`/posts/${item.id}`} className="flex items-start justify-between gap-2 py-space-sm group">
                        <span className="text-body-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                        <MdChevronRight className="text-on-surface-variant flex-shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                      </Link>
                      <span className="block -mt-1 pb-space-sm text-caption text-on-surface-variant">
                        {item.commentCount || 0} {t('postDetail.replies')}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={`/forums/${post.forumId}`}
                  className="mt-space-sm w-full py-2 px-4 rounded-base bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-on-surface text-label-md flex items-center justify-center gap-1"
                >
                  {t('postDetail.viewForum')}
                </Link>
              </SectionCard>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

export default PostDetailsPage

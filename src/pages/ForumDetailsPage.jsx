import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  MdAddCircleOutline,
  MdCalendarMonth,
  MdCategory,
  MdChatBubbleOutline,
  MdDelete,
  MdEdit,
  MdGavel,
  MdHome,
  MdVisibility,
} from 'react-icons/md'
import useAuth from '../hooks/useAuth'
import forumService from '../services/forumService'
import postService from '../services/postService'
import categoryService from '../services/categoryService'
import PostList from '../components/post/PostList'
import SectionCard from '../components/ui/SectionCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { useLanguage } from '../contexts/LanguageContext'
import { formatLongDate } from '../utils/formatDate'
import Seo from '../components/common/SEO'

const toList = (response) => (Array.isArray(response) ? response : response?.content || [])

const pillClass =
  'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface shadow-level-1 hover:text-primary text-label-lg transition-colors'

const ForumDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser, hasRole, isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const [forum, setForum] = useState(null)
  const [category, setCategory] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [postLoading, setPostLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchForumData = async () => {
      try {
        setLoading(true)
        const forumData = await forumService.getForumById(id)
        if (cancelled) return
        setForum(forumData)
        if (forumData?.categoryId) {
          categoryService
            .getCategoryById(forumData.categoryId)
            .then((data) => !cancelled && setCategory(data))
            .catch(() => {})
        }
      } catch (error) {
        console.error('Error loading forum:', error)
        toast.error(t('forums.errorLoadingForum'))
        navigate('/forums')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    const fetchPosts = async () => {
      try {
        setPostLoading(true)
        const postsData = await postService.getPostsByForum(id)
        if (!cancelled) setPosts(toList(postsData))
      } catch (error) {
        console.error('Error loading posts:', error)
        toast.error(t('forums.errorLoadingPosts'))
      } finally {
        if (!cancelled) setPostLoading(false)
      }
    }

    fetchForumData()
    fetchPosts()
    return () => {
      cancelled = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate])

  const handleDeleteForum = async () => {
    if (!window.confirm(t('forums.confirmDeleteForum'))) return
    try {
      await forumService.deleteForum(id)
      toast.success(t('forums.forumDeletedSuccess'))
      navigate('/forums')
    } catch (error) {
      console.error('Error deleting forum:', error)
      toast.error(t('forums.errorDeletingForum'))
    }
  }

  if (loading || !forum) {
    return <LoadingSpinner />
  }

  const isForumAuthor = currentUser && forum.createdBy != null && forum.createdBy === currentUser.id
  const canEditForum = isForumAuthor || hasRole('ADMIN') || hasRole('MODERATOR')
  const tags = (forum.tags || []).map((tag) => (typeof tag === 'string' ? tag : tag?.name)).filter(Boolean)
  const postCount = forum.postCount ?? posts.length

  return (
    <div className="flex flex-col w-full">
      <Seo
        title={forum.title}
        description={forum.description || `Foro de viaje: ${forum.title}. Participa en la conversación con otros viajeros.`}
        url={`/forums/${forum.id}`}
        type="website"
      />

      {/* Header */}
      <header className="relative overflow-hidden">
        {forum.imageUrl ? (
          <div className="absolute inset-0">
            <img src={forum.imageUrl} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/30" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-surface-container-high/90 via-surface-container/60 to-background" />
        )}

        <div className="relative max-w-7xl mx-auto px-gutter-sm lg:px-gutter-lg pt-space-lg pb-space-xl">
          <nav aria-label={t('postDetail.breadcrumb')} className="mb-space-md">
            <ol className="flex flex-wrap items-center gap-space-xs text-label-md text-on-surface-variant">
              <li>
                <Link to="/" className="flex items-center gap-1 text-on-surface-variant hover:text-primary">
                  <MdHome className="text-body-md" aria-hidden="true" />
                  {t('postDetail.home')}
                </Link>
              </li>
              <li aria-hidden="true" className="text-outline">/</li>
              <li><Link to="/forums" className="text-on-surface-variant hover:text-primary">{t('postDetail.forums')}</Link></li>
              {category && (
                <>
                  <li aria-hidden="true" className="text-outline">/</li>
                  <li>
                    <Link to={`/forums/category/${category.id}`} className="text-on-surface-variant hover:text-primary">{category.name}</Link>
                  </li>
                </>
              )}
              <li aria-hidden="true" className="text-outline">/</li>
              <li aria-current="page" className="text-on-surface font-semibold truncate max-w-xs sm:max-w-md">{forum.title}</li>
            </ol>
          </nav>

          {category && (
            <p className="inline-flex items-center gap-1 px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-label-md mb-space-sm">
              <MdCategory aria-hidden="true" />
              {category.name}
            </p>
          )}

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
            <div className="max-w-3xl">
              <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface">{forum.title}</h1>
              {forum.description && (
                <p className="mt-space-xs text-body-lg text-on-surface-variant">{forum.description}</p>
              )}
              <p className="mt-space-sm flex flex-wrap items-center gap-space-md text-label-md text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <MdChatBubbleOutline aria-hidden="true" />
                  {postCount} {postCount === 1 ? t('common.post') : t('common.posts')}
                </span>
                <span className="flex items-center gap-1">
                  <MdVisibility aria-hidden="true" />
                  {forum.viewCount || 0} {t('common.views')}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-space-xs">
              {isAuthenticated && (
                <Link to={`/forums/${id}/posts/create`} className="btn btn-primary">
                  <MdAddCircleOutline aria-hidden="true" />
                  {t('forums.newPost')}
                </Link>
              )}
              {canEditForum && (
                <>
                  <Link to={`/forums/${id}/edit`} className={pillClass}>
                    <MdEdit aria-hidden="true" />
                    {t('common.edit')}
                  </Link>
                  <button type="button" onClick={handleDeleteForum} className={`${pillClass} hover:text-error`}>
                    <MdDelete aria-hidden="true" />
                    {t('common.delete')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-gutter-sm lg:px-gutter-lg py-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          <section className="lg:col-span-8 space-y-space-md" aria-labelledby="forum-posts-title">
            <h2 id="forum-posts-title" className="font-headline text-headline-md text-on-surface">{t('forums.posts')}</h2>
            {postLoading ? <LoadingSpinner /> : <PostList posts={posts} forumId={id} />}
          </section>

          <aside className="lg:col-span-4 space-y-space-md lg:sticky lg:top-24">
            <SectionCard title={t('forums.factsTitle')}>
              <dl className="space-y-space-sm text-body-sm">
                {forum.createdAt && (
                  <div className="flex items-center justify-between gap-space-sm">
                    <dt className="flex items-center gap-1 text-on-surface-variant first-letter:uppercase">
                      <MdCalendarMonth aria-hidden="true" /> {t('postDetail.publishedOn')}
                    </dt>
                    <dd className="font-semibold text-on-surface">{formatLongDate(forum.createdAt)}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-space-sm">
                  <dt className="flex items-center gap-1 text-on-surface-variant first-letter:uppercase">
                    <MdChatBubbleOutline aria-hidden="true" /> {t('forums.posts')}
                  </dt>
                  <dd className="font-semibold text-on-surface">{postCount}</dd>
                </div>
                <div className="flex items-center justify-between gap-space-sm">
                  <dt className="flex items-center gap-1 text-on-surface-variant first-letter:uppercase">
                    <MdVisibility aria-hidden="true" /> {t('postDetail.views')}
                  </dt>
                  <dd className="font-semibold text-on-surface">{forum.viewCount || 0}</dd>
                </div>
              </dl>
              {tags.length > 0 && (
                <ul className="mt-space-md flex flex-wrap gap-space-xs" aria-label={t('postDetail.tags')}>
                  {tags.map((tag) => (
                    <li key={tag} className="px-space-sm py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-caption font-semibold">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            {forum.rules && (
              <SectionCard title={t('forums.rules')} icon={MdGavel}>
                <p className="text-body-sm text-on-surface-variant whitespace-pre-line">{forum.rules}</p>
              </SectionCard>
            )}

            {!isAuthenticated && (
              <div className="bg-secondary text-on-secondary rounded-lg p-space-lg shadow-level-1">
                <p className="font-headline text-headline-sm text-on-secondary">{t('home.ctaJoin')}</p>
                <Link to="/login" className="mt-space-sm inline-flex text-label-lg text-on-secondary hover:text-on-secondary underline underline-offset-4">
                  {t('comments.loginLink')}
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ForumDetailsPage

import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { MdForum, MdHome, MdSchedule, MdVisibility } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import Avatar from '../ui/Avatar'
import Breadcrumb from '../ui/Breadcrumb'
import { formatLongDate } from '../../utils/formatDate'
import { readingMinutes } from '../../utils/readingTime'

const PostHeader = ({ post, forum, category, commentCount, actions }) => {
  const { t } = useLanguage()
  const forumTitle = forum?.title || t('postDetail.backToForum')
  const wasUpdated = post.updatedAt && post.updatedAt !== post.createdAt
  const minutes = post.readingMinutes || readingMinutes(post.content)

  return (
    <header className="relative w-full pt-space-lg pb-space-xl bg-gradient-to-b from-surface-container-high/90 via-surface-container/60 to-background overflow-hidden">
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary-fixed/20 blur-3xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-80 h-80 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-gutter-sm lg:px-gutter-lg">
        <Breadcrumb
          label={t('postDetail.breadcrumb')}
          className="mb-space-md"
          items={[
            { to: '/', label: t('postDetail.home'), icon: MdHome },
            { to: '/forums', label: t('postDetail.forums') },
            category && { to: `/forums/category/${category.id}`, label: category.name },
            { to: `/forums/${post.forumId}`, label: forumTitle },
            { label: post.title },
          ].filter(Boolean)}
        />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <ul className="flex flex-wrap items-center gap-space-xs mb-space-sm" aria-label={t('postDetail.tags')}>
            {post.tags.map((tag) => (
              <li key={tag} className="px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-md">
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Title + actions */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
          <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface max-w-4xl">
            {post.title}
          </h1>
          {actions && <div className="flex items-center gap-space-xs flex-shrink-0">{actions}</div>}
        </div>

        {/* Author bar */}
        <div className="mt-space-md p-space-md bg-surface-container-lowest/80 backdrop-blur rounded-lg shadow-level-1 flex flex-wrap items-center justify-between gap-space-md">
          <Link to={`/profile/${post.createdBy}`} className="flex items-center gap-space-md group">
            <Avatar name={post.username} size="lg" tone="tertiary" />
            <span className="flex flex-col">
              <span className="text-title-md font-bold text-on-surface group-hover:text-primary transition-colors">
                @{post.username}
              </span>
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-on-surface-variant">
                <span>
                  {t('postDetail.published')}: {formatLongDate(post.createdAt, t('postDetail.unknownDate'))}
                </span>
                {wasUpdated && (
                  <span>
                    {t('postDetail.updated')}: {formatLongDate(post.updatedAt, t('postDetail.unknownDate'))}
                  </span>
                )}
              </span>
            </span>
          </Link>

          <dl className="flex items-center gap-space-lg text-on-surface-variant">
            <div className="flex items-center gap-1">
              <MdSchedule className="text-body-md" aria-hidden="true" />
              <dt className="sr-only">{t('postDetail.readingTime')}</dt>
              <dd className="text-label-md">{minutes} {t('postDetail.readingMin')}</dd>
            </div>
            <div className="flex items-center gap-1">
              <MdVisibility className="text-body-md" aria-hidden="true" />
              <dt className="sr-only">{t('postDetail.views')}</dt>
              <dd className="text-label-md">{post.viewCount || 0} {t('postDetail.views')}</dd>
            </div>
            <div className="flex items-center gap-1">
              <MdForum className="text-body-md" aria-hidden="true" />
              <dt className="sr-only">{t('postDetail.replies')}</dt>
              <dd className="text-label-md">{commentCount} {t('postDetail.replies')}</dd>
            </div>
          </dl>
        </div>
      </div>
    </header>
  )
}

PostHeader.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    username: PropTypes.string,
    createdBy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    viewCount: PropTypes.number,
    content: PropTypes.string,
    readingMinutes: PropTypes.number,
    forumId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  forum: PropTypes.shape({ title: PropTypes.string }),
  category: PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), name: PropTypes.string }),
  commentCount: PropTypes.number,
  actions: PropTypes.node,
}

export default PostHeader

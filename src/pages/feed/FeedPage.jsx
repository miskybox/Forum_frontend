import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import feedService from '../../services/feedService'
import FeedCard from '../../components/social/FeedCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import useAuth from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import { MdErrorOutline, MdPeople, MdPublic } from 'react-icons/md'
import SegmentedTabs from '../../components/ui/SegmentedTabs'
import EmptyState from '../../components/ui/EmptyState'

const FeedPage = () => {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(isAuthenticated ? 'following' : 'explore')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadFeed(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const loadFeed = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setPage(0)
      } else {
        setLoadingMore(true)
      }
      setError(null)

      const currentPage = reset ? 0 : page
      const data = activeTab === 'following'
        ? await feedService.getFollowingFeed(currentPage, 10)
        : await feedService.getExploreFeed(currentPage, 10)

      if (reset) {
        setItems(data?.content || [])
      } else {
        setItems(prev => [...prev, ...(data?.content || [])])
      }

      setHasMore(Boolean(data) && !data.last)
      setPage(currentPage + 1)
    } catch (err) {
      console.error('Error loading feed:', err)
      setError(t('feed.loadError'))
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadFeed(false)
    }
  }

  const tabs = [
    ...(isAuthenticated ? [{ id: 'following', label: t('feed.following'), icon: MdPeople }] : []),
    { id: 'explore', label: t('feed.explore'), icon: MdPublic },
  ]

  let content
  if (loading) {
    content = <LoadingSpinner />
  } else if (error) {
    content = (
      <EmptyState
        icon={MdErrorOutline}
        title={error}
        action={<button type="button" onClick={() => loadFeed(true)} className="btn btn-primary">{t('feed.retry')}</button>}
      />
    )
  } else if (items.length === 0) {
    const following = activeTab === 'following'
    content = (
      <EmptyState
        icon={following ? MdPeople : MdPublic}
        title={following ? t('feed.noPostsFollowing') : t('feed.noPostsExplore')}
        description={following ? t('feed.followToSee') : t('feed.noExploreHint')}
        action={<Link to="/forums" className="btn btn-primary">{t('feed.exploreForum')}</Link>}
      />
    )
  } else {
    content = (
      <div className="space-y-space-lg">
        {items.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
        {hasMore && (
          <div className="text-center">
            <button type="button" onClick={handleLoadMore} disabled={loadingMore} className="btn btn-outline" aria-busy={loadingMore}>
              {loadingMore ? t('common.loading') : t('feed.loadMore')}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-gutter-sm py-margin space-y-space-lg">
      <header>
        <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface">{t('nav.feed')}</h1>
        <p className="mt-space-xs text-body-lg text-on-surface-variant">{t('feed.subtitle')}</p>
      </header>

      <SegmentedTabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} idPrefix="feed" label={t('feed.tabsLabel')} />

      <div role="tabpanel" id={`feed-panel-${activeTab}`} aria-labelledby={`feed-tab-${activeTab}`}>
        {content}
      </div>
    </div>
  )
}

export default FeedPage

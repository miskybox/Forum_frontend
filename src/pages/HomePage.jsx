import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MdAddCircleOutline,
  MdArrowForward,
  MdEco,
  MdForum,
  MdHelpOutline,
  MdMap,
  MdPhotoLibrary,
  MdQuiz,
  MdSchedule,
  MdTrendingUp,
} from 'react-icons/md'
import FeedCard from '../components/social/FeedCard'
import ForumCard from '../components/forums/ForumCard'
import HomeHero from '../components/home/HomeHero'
import CategoryChannels from '../components/home/CategoryChannels'
import TopTravelers from '../components/home/TopTravelers'
import SegmentedTabs from '../components/ui/SegmentedTabs'
import SectionCard from '../components/ui/SectionCard'
import forumService from '../services/forumService'
import categoryService from '../services/categoryService'
import feedService from '../services/feedService'
import travelService from '../services/travelService'
import useAuth from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import Seo from '../components/common/SEO'

// Run each request inside a promise so sync errors are captured by allSettled too
const settle = (request) => Promise.resolve().then(request)

const toList = (response) => (Array.isArray(response) ? response : response?.content || [])

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ForumViajeros',
  url: 'https://forumviajeros.com',
  description: 'Comunidad de viajeros para compartir experiencias, consejos y rutas por todo el mundo.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://forumviajeros.com/forums?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const LoadingBlock = ({ label }) => (
  <output className="block text-center py-space-xl" aria-live="polite">
    <span className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-fixed border-t-primary" aria-hidden="true" />
    <span className="block mt-space-sm text-body-sm text-on-surface-variant">{label}</span>
  </output>
)

const EmptyBlock = ({ children }) => (
  <div className="bg-surface-container-lowest rounded-lg p-space-xl text-center shadow-level-1">
    <p className="text-body-md text-on-surface-variant">{children}</p>
  </div>
)

const EXPLORE_TAB_FILTERS = {
  trending: { sort: 'trending' },
  photos: { hasImages: true },
  unanswered: { unanswered: true },
}

const FeedTabPanel = ({ tabId, activeTab, loading, items, emptyLabel, loadingLabel }) => (
  <div
    role="tabpanel"
    id={`home-feed-panel-${tabId}`}
    aria-labelledby={`home-feed-tab-${tabId}`}
    hidden={activeTab !== tabId}
    className="space-y-space-lg"
  >
    {loading ? (
      <LoadingBlock label={loadingLabel} />
    ) : items.length > 0 ? (
      items.map((item) => <FeedCard key={item.id ?? item.postId} item={item} />)
    ) : (
      <EmptyBlock>{emptyLabel}</EmptyBlock>
    )}
  </div>
)

const HomePage = () => {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('recent')
  const [loading, setLoading] = useState(true)
  const [recentForums, setRecentForums] = useState([])
  const [feedItems, setFeedItems] = useState([])
  const [filteredFeeds, setFilteredFeeds] = useState({})
  const [filterLoading, setFilterLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [travelers, setTravelers] = useState([])

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const [forums, feed, cats, ranking] = await Promise.allSettled([
        settle(() => forumService.getAllForums(0, 4)),
        settle(() => feedService.getExploreFeed(0, 6)),
        settle(() => categoryService.getAllCategories()),
        settle(() => travelService.getRanking(5)),
      ])
      if (cancelled) return

      setRecentForums(forums.status === 'fulfilled' ? toList(forums.value) : [])
      setFeedItems(feed.status === 'fulfilled' ? toList(feed.value) : [])
      setCategories(cats.status === 'fulfilled' ? toList(cats.value) : [])
      setTravelers(ranking.status === 'fulfilled' ? toList(ranking.value) : [])
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const filters = EXPLORE_TAB_FILTERS[activeTab]
    if (!filters) return

    let cancelled = false
    setFilterLoading(true)
    feedService
      .getExploreFeed(0, 6, filters)
      .then((data) => {
        if (!cancelled) {
          setFilteredFeeds((prev) => ({ ...prev, [activeTab]: toList(data) }))
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFilteredFeeds((prev) => ({ ...prev, [activeTab]: [] }))
        }
      })
      .finally(() => {
        if (!cancelled) setFilterLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeTab])

  const tabs = [
    { id: 'recent', label: t('home.tabRecent'), icon: MdSchedule },
    { id: 'trending', label: t('home.tabTrending'), icon: MdTrendingUp },
    { id: 'photos', label: t('home.tabPhotos'), icon: MdPhotoLibrary },
    { id: 'unanswered', label: t('home.tabUnanswered'), icon: MdHelpOutline },
    { id: 'forums', label: t('home.tabForums'), icon: MdForum },
  ]

  return (
    <div className="flex flex-col w-full">
      <Seo url="/" jsonLd={jsonLd} />

      <HomeHero />

      <div className="max-w-7xl mx-auto w-full px-gutter-sm lg:px-gutter-lg py-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">

          {/* Center: community content */}
          <section className="lg:col-span-6 lg:order-2 flex flex-col gap-space-lg" aria-label={t('home.feedTabsLabel')}>
            <SegmentedTabs
              tabs={tabs}
              activeId={activeTab}
              onChange={setActiveTab}
              idPrefix="home-feed"
              label={t('home.feedTabsLabel')}
            />

            <FeedTabPanel
              tabId="recent"
              activeTab={activeTab}
              loading={loading}
              items={feedItems}
              emptyLabel={t('home.noPosts')}
              loadingLabel={t('home.loading')}
            />
            <FeedTabPanel
              tabId="trending"
              activeTab={activeTab}
              loading={filterLoading && !filteredFeeds.trending}
              items={filteredFeeds.trending || []}
              emptyLabel={t('home.noPosts')}
              loadingLabel={t('home.loading')}
            />
            <FeedTabPanel
              tabId="photos"
              activeTab={activeTab}
              loading={filterLoading && !filteredFeeds.photos}
              items={filteredFeeds.photos || []}
              emptyLabel={t('home.noPosts')}
              loadingLabel={t('home.loading')}
            />
            <FeedTabPanel
              tabId="unanswered"
              activeTab={activeTab}
              loading={filterLoading && !filteredFeeds.unanswered}
              items={filteredFeeds.unanswered || []}
              emptyLabel={t('home.noPosts')}
              loadingLabel={t('home.loading')}
            />

            <div
              role="tabpanel"
              id="home-feed-panel-forums"
              aria-labelledby="home-feed-tab-forums"
              hidden={activeTab !== 'forums'}
              className="space-y-space-lg"
            >
              {loading ? (
                <LoadingBlock label={t('home.loading')} />
              ) : recentForums.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-lg">
                  {recentForums.map((forum) => (
                    <ForumCard key={forum.id} forum={forum} />
                  ))}
                </div>
              ) : (
                <EmptyBlock>{t('home.noForums')}</EmptyBlock>
              )}
            </div>

            <Link
              to="/forums"
              className="self-center inline-flex items-center gap-space-xs text-label-lg text-primary hover:text-primary-container"
            >
              {t('home.viewAllForums')}
              <MdArrowForward aria-hidden="true" />
            </Link>
          </section>

          {/* Left rail: taxonomies */}
          <aside className="lg:col-span-3 lg:order-1 flex flex-col gap-space-lg">
            <CategoryChannels categories={categories} />

            <div className="bg-gradient-to-br from-tertiary-container/30 to-surface-container rounded-lg p-space-md shadow-level-1">
              <p className="flex items-center gap-space-xs text-secondary text-label-md uppercase tracking-wider font-bold">
                <MdEco className="text-title-md" aria-hidden="true" />
                {t('home.responsibleTitle')}
              </p>
              <p className="font-headline text-title-md text-on-surface italic mt-space-sm">
                {t('home.responsibleQuote')}
              </p>
              <p className="text-body-sm text-on-surface-variant mt-space-sm">
                {t('home.responsibleText')}
              </p>
            </div>
          </aside>

          {/* Right rail: actions and community */}
          <aside className="lg:col-span-3 lg:order-3 flex flex-col gap-space-lg">
            <SectionCard className="text-center">
              <p className="text-body-sm text-on-surface-variant mb-space-sm">{t('home.ctaQuestion')}</p>
              <Link
                to={isAuthenticated ? '/forums/create' : '/register'}
                className="w-full py-space-sm px-space-md rounded-full bg-primary hover:bg-primary-container text-on-primary hover:text-on-primary text-label-lg flex items-center justify-center gap-space-xs shadow-md transition-colors"
              >
                <MdAddCircleOutline className="text-title-md" aria-hidden="true" />
                <span>{isAuthenticated ? t('home.ctaCreate') : t('home.ctaJoin')}</span>
              </Link>
            </SectionCard>

            <TopTravelers travelers={travelers} />

            <SectionCard title={t('home.discoverTitle')}>
              <ul className="space-y-space-sm">
                <li>
                  <Link
                    to="/trivia"
                    className="flex items-center gap-space-sm p-space-sm rounded-base bg-surface-container-low hover:bg-surface-container text-body-sm text-on-surface hover:text-on-surface transition-colors"
                  >
                    <MdQuiz className="text-title-md text-primary flex-shrink-0" aria-hidden="true" />
                    <span>{t('home.triviaPromo')}</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/travel"
                    className="flex items-center gap-space-sm p-space-sm rounded-base bg-surface-container-low hover:bg-surface-container text-body-sm text-on-surface hover:text-on-surface transition-colors"
                  >
                    <MdMap className="text-title-md text-secondary flex-shrink-0" aria-hidden="true" />
                    <span>{t('home.mapPromo')}</span>
                  </Link>
                </li>
              </ul>
            </SectionCard>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default HomePage

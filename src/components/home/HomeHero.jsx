import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MdExplore, MdPinDrop, MdSearch } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import tagService from '../../services/tagService'

const quickLinkClass =
  'px-space-md py-space-xs rounded-full bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface hover:text-on-surface text-label-md transition-colors'

const HomeHero = () => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [tags, setTags] = useState([])

  useEffect(() => {
    let cancelled = false
    tagService
      .getPopular(8)
      .then((data) => {
        if (!cancelled) setTags(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setTags([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    const term = query.trim()
    navigate(term ? `/forums?q=${encodeURIComponent(term)}` : '/forums')
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-surface-container-low py-space-xl lg:py-margin-lg px-gutter-sm lg:px-gutter-lg"
      aria-labelledby="hero-title"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface-container/60 via-surface-container-low to-background pointer-events-none" />
      <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-secondary-fixed/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 rounded-full bg-primary-fixed/30 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
        <p className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high/80 text-secondary text-label-md uppercase shadow-sm mb-space-md">
          <MdExplore className="text-label-lg" aria-hidden="true" />
          <span>{t('home.heroEyebrow')}</span>
        </p>

        <h1
          id="hero-title"
          className="font-headline text-display-lg-mobile lg:text-display-lg text-on-surface max-w-4xl"
        >
          {t('home.heroTitle')}{' '}
          <span className="italic font-normal text-primary">{t('home.heroTitleAccent')}</span>
        </h1>
        <p className="mt-space-md text-body-lg text-on-surface-variant max-w-2xl">
          {t('home.heroSubtitle')}
        </p>

        {/* Search */}
        <form
          role="search"
          onSubmit={handleSubmit}
          className="mt-space-xl w-full max-w-3xl bg-surface-container-lowest rounded-xl md:rounded-full p-space-sm shadow-xl focus-within:ring-2 focus-within:ring-primary/30 flex flex-col md:flex-row items-stretch md:items-center gap-space-xs"
        >
          <div className="flex-1 flex items-center gap-space-sm px-space-md py-space-xs text-left">
            <MdPinDrop className="text-title-md text-primary flex-shrink-0" aria-hidden="true" />
            <div className="flex flex-col w-full min-w-0">
              <label htmlFor="home-search" className="text-caption uppercase tracking-wider text-on-surface-variant">
                {t('home.searchLabel')}
              </label>
              <input
                id="home-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('home.searchPlaceholder')}
                className="min-h-0 p-0 border-0 shadow-none bg-transparent outline-none text-body-sm text-on-surface"
              />
            </div>
          </div>
          <button
            type="submit"
            className="py-space-sm px-space-lg rounded-full bg-primary hover:bg-primary-container text-on-primary text-label-lg flex items-center justify-center gap-space-xs transition-colors shadow-md active:scale-95"
          >
            <MdSearch className="text-body-lg" aria-hidden="true" />
            <span>{t('home.searchButton')}</span>
          </button>
        </form>

        {/* Quick links */}
        <nav aria-label={t('home.quickLinks')} className="mt-space-lg flex flex-wrap items-center justify-center gap-space-xs sm:gap-space-sm">
          <span className="text-caption uppercase tracking-widest text-on-surface-variant">{t('home.quickLinks')}:</span>
          <Link to="/forums" className={quickLinkClass}>{t('home.exploreForum')}</Link>
          <Link to="/trivia" className={quickLinkClass}>{t('home.playTrivia')}</Link>
          <Link to="/travel" className={quickLinkClass}>{t('home.myMap')}</Link>
        </nav>

        {tags.length > 0 && (
          <nav aria-label={t('home.trendingTags')} className="mt-space-md flex flex-wrap items-center justify-center gap-space-xs">
            {tags.map((tag) => (
              <Link
                key={tag.id ?? tag.name}
                to={`/forums?q=${encodeURIComponent(tag.name)}`}
                className={quickLinkClass}
              >
                #{tag.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </section>
  )
}

export default HomeHero

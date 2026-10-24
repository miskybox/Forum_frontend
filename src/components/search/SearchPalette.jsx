import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdSearch } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import searchService from '../../services/searchService'

const groups = [
  ['posts', 'search.posts'],
  ['forums', 'search.forums'],
  ['users', 'search.users'],
  ['countries', 'search.countries'],
]

const SearchPalette = () => {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    const term = query.trim()
    if (term.length < 2) {
      setResults(null)
      return
    }
    const handle = setTimeout(() => {
      searchService.search(term).then(setResults).catch(() => setResults(null))
    }, 250)
    return () => clearTimeout(handle)
  }, [query, open])

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden xl:inline-flex items-center gap-space-xs min-h-10 px-space-md rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface text-label-md"
        aria-label={t('search.open')}
      >
        <MdSearch aria-hidden="true" />
        {t('search.placeholder')}
        <kbd className="ml-space-xs text-caption">⌘K</kbd>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[80] bg-inverse-surface/40 p-gutter-sm" role="dialog" aria-modal="true" aria-label={t('search.title')}>
      <div className="max-w-xl mx-auto mt-24 bg-surface-container-lowest rounded-lg shadow-level-3 p-space-md">
        <label className="flex items-center gap-space-sm">
          <MdSearch className="text-title-md text-primary" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('search.placeholder')}
            className="w-full bg-transparent outline-none text-body-md text-on-surface"
          />
        </label>
        <div className="mt-space-md max-h-80 overflow-y-auto space-y-space-md">
          {groups.map(([key, label]) => {
            const items = results?.[key] || []
            if (items.length === 0) return null
            return (
              <section key={key}>
                <h2 className="text-caption uppercase text-on-surface-variant mb-space-xs">{t(label)}</h2>
                <ul>
                  {items.map((item) => (
                    <li key={`${item.type}-${item.id}`}>
                      <Link
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="block py-space-xs text-body-sm text-on-surface hover:text-primary"
                      >
                        {item.title}
                        {item.subtitle && (
                          <span className="block text-caption text-on-surface-variant">{item.subtitle}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
          {query.trim().length >= 2 && results && groups.every(([key]) => (results[key] || []).length === 0) && (
            <p className="text-body-sm text-on-surface-variant">{t('search.empty')}</p>
          )}
        </div>
        <button type="button" className="mt-space-sm text-label-md text-on-surface-variant" onClick={() => setOpen(false)}>
          {t('common.back')}
        </button>
      </div>
    </div>
  )
}

export default SearchPalette

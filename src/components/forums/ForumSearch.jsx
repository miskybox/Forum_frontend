import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { MdSearch } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'

const ForumSearch = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const { t } = useLanguage()

  // Keep the input in sync when the parent clears the search
  useEffect(() => {
    setSearchTerm(initialValue)
  }, [initialValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm.trim())
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="w-full md:max-w-md flex items-center gap-space-xs p-1 pl-space-md bg-surface-container-lowest rounded-full shadow-level-1 focus-within:ring-2 focus-within:ring-primary/30"
    >
      <MdSearch className="text-body-lg text-on-surface-variant flex-shrink-0" aria-hidden="true" />
      <label htmlFor="forum-search" className="sr-only">{t('forumList.searchPlaceholder')}</label>
      <input
        id="forum-search"
        type="search"
        className="min-h-0 py-2 px-0 border-0 shadow-none bg-transparent outline-none text-body-sm"
        placeholder={t('forumList.searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="px-space-md py-2 rounded-full bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary text-label-lg transition-colors whitespace-nowrap">
        {t('forumList.search')}
      </button>
    </form>
  )
}

ForumSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
}

export default ForumSearch

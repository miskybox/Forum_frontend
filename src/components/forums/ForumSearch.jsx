import { useState } from 'react'
import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * ForumSearch con estilo retro Adventure
 */
const ForumSearch = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const { t } = useLanguage()

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label htmlFor="forum-search" className="sr-only">{t('forumList.searchPlaceholder')}</label>
      <div className="flex items-center gap-2">
        <input
          id="forum-search"
          type="text"
          className="input w-full border-adventure-gold"
          placeholder={t('forumList.searchPlaceholder') || 'Buscar foros...'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-secondary whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          {t('forumList.search')}
        </button>
      </div>
    </form>
  )
}
ForumSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
  initialValue: PropTypes.string
}

export default ForumSearch

import { useState } from 'react'
import PropTypes from 'prop-types'

/**
 * ForumSearch con estilo retro Adventure
 */
const ForumSearch = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label htmlFor="forum-search" className="sr-only">Buscar foros</label>
      <div className="relative flex items-center">
        <input
          id="forum-search"
          type="text"
          className="input w-full pr-12 border-adventure-gold"
          placeholder="Buscar foros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 p-2 text-golden hover:text-teal hover:scale-110 transition-all"
          aria-label="Buscar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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

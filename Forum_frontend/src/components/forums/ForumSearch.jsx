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
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-golden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          type="text"
          className="input pl-10 pr-12 w-full border-adventure-gold"
          placeholder="BUSCAR FOROS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar foros"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform z-10"
          aria-label="Buscar"
        >
          <svg className="w-5 h-5 text-golden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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

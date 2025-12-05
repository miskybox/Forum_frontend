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
        <input
          type="text"
          className="input pr-12 w-full border-adventure-gold"
          placeholder="🔍 BUSCAR FOROS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar foros"
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:scale-110 transition-transform"
          aria-label="Buscar"
        >
          <span className="text-adventure-gold text-xl">🔍</span>
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

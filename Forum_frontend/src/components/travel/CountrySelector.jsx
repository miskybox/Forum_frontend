import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import countryService from '../../services/countryService'

/**
 * Componente selector de país con búsqueda
 */
const CountrySelector = ({ onSelect, selectedCountry }) => {
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedContinent, setSelectedContinent] = useState('all')
  const [continents, setContinents] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCountries()
    loadContinents()
  }, [])

  useEffect(() => {
    filterCountries()
  }, [searchQuery, selectedContinent, countries])

  const loadCountries = async () => {
    try {
      const data = await countryService.getAllCountries()
      setCountries(data)
      setFilteredCountries(data)
    } catch (error) {
      console.error('Error cargando países:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadContinents = async () => {
    try {
      const data = await countryService.getAllContinents()
      setContinents(data)
    } catch (error) {
      console.error('Error cargando continentes:', error)
    }
  }

  const filterCountries = () => {
    let filtered = [...countries]

    if (selectedContinent !== 'all') {
      filtered = filtered.filter(c => c.continent === selectedContinent)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.capital?.toLowerCase().includes(query)
      )
    }

    setFilteredCountries(filtered)
  }

  const handleSelect = (country) => {
    onSelect(country)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className="relative z-10">
      {/* Overlay para cerrar - debe ir primero para estar debajo del dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Input de búsqueda */}
      <button
        type="button"
        className="flex items-center gap-2 bg-primary-light border-2 border-accent rounded-lg px-4 py-3 cursor-pointer hover:border-secondary transition-colors w-full text-left relative z-10"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selectedCountry ? (
          <>
            <span className="text-2xl">{selectedCountry.flagEmoji}</span>
            <span className="font-medium text-text">{selectedCountry.name}</span>
            <span className="text-text-light text-sm">({selectedCountry.capital})</span>
          </>
        ) : (
          <>
            <span className="text-text-light">🔍</span>
            <span className="text-text-light">Selecciona un país...</span>
          </>
        )}
        <span className="ml-auto text-text-light">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-primary-light rounded-lg shadow-2xl border-2 border-accent z-50 max-h-96 overflow-hidden">
          {/* Barra de búsqueda */}
          <div className="p-3 border-b border-primary-dark">
            <input
              type="text"
              placeholder="Buscar país o capital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full"
              autoFocus
            />
          </div>

          {/* Filtro por continente */}
          <div className="p-3 border-b border-primary-dark flex flex-wrap gap-2 bg-primary">
            <button
              type="button"
              onClick={() => setSelectedContinent('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedContinent === 'all'
                  ? 'bg-secondary text-text border border-secondary-dark'
                  : 'bg-primary-light text-text-light border border-accent hover:bg-primary-dark'
              }`}
            >
              Todos
            </button>
            {continents.map(continent => (
              <button
                type="button"
                key={continent}
                onClick={() => setSelectedContinent(continent)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedContinent === continent
                    ? 'bg-secondary text-text border border-secondary-dark'
                    : 'bg-primary-light text-text-light border border-accent hover:bg-primary-dark'
                }`}
              >
                {continent}
              </button>
            ))}
          </div>

          {/* Lista de países */}
          <div className="max-h-56 overflow-y-auto">
            {loading && (
              <div className="p-8 text-center text-text-light">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary border-t-transparent mx-auto mb-2" />
                Cargando países...
              </div>
            )}
            {!loading && filteredCountries.length === 0 && (
              <div className="p-8 text-center text-text-light">
                No se encontraron países
              </div>
            )}
            {!loading && filteredCountries.length > 0 && (
              filteredCountries.map(country => (
                <button
                  type="button"
                  key={country.id}
                  onClick={() => handleSelect(country)}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-secondary/20 cursor-pointer transition-colors border-b border-primary-dark last:border-0 w-full text-left ${
                    selectedCountry?.id === country.id ? 'bg-secondary/30' : ''
                  }`}
                >
                  <span className="text-2xl">{country.flagEmoji}</span>
                  <div>
                    <p className="font-medium text-text">{country.name}</p>
                    <p className="text-sm text-text-light">{country.capital} • {country.continent}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

CountrySelector.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedCountry: PropTypes.object
}

export default CountrySelector


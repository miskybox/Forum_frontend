import { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import countryService from '../../services/countryService'

const ALL_CONTINENTS_KEY = '__all__'
const COLLATOR = new Intl.Collator('es-ES', { sensitivity: 'base', usage: 'sort' })

const normalizeText = (value) => {
  if (!value) return ''
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const isoToEmoji = (code) => {
  if (!code || code.length !== 2) return '🌐'
  const chars = code.toUpperCase().split('').map((char) => 0x1f1e6 + (char.charCodeAt(0) - 65))
  return String.fromCodePoint(...chars)
}

const getCountryName = (country) => {
  if (!country) return ''
  if (typeof country.name === 'string') return country.name
  return (
    country.name?.common ||
    country.name?.official ||
    country.name?.es ||
    country.translation?.es ||
    country.translation?.esES ||
    country.countryName ||
    ''
  )
}

const getCountryCapital = (country) => {
  if (!country) return ''
  if (Array.isArray(country.capital)) return country.capital[0] || ''
  if (typeof country.capital === 'string') return country.capital
  return ''
}

const getCountryId = (country, fallbackIndex) => {
  return (
    country.id ||
    country.countryId ||
    country.isoCode ||
    country.code ||
    country.alpha2Code ||
    country.cca2 ||
    `country-${fallbackIndex}`
  )
}

const getCountryContinent = (country) => {
  return (
    country.continent ||
    country.continentName ||
    country.region ||
    country.subregion ||
    'Otros'
  )
}

const getContinentEmoji = (continent) => {
  if (!continent) return '🌐'
  const normalized = normalizeText(continent)
  const cleaned = normalized.replace(/\b(del?|de|the|of)\b/g, ' ')
  const collapsed = cleaned.replace(/[^a-z0-9]/g, '')

  const emojiMap = {
    africa: '🌍',
    americas: '🌎',
    america: '🌎',
    europa: '🏰',
    europe: '🏰',
    asia: '🌏',
    oceania: '🏝️',
    australia: '🏝️',
    pacifico: '🏝️',
    pacific: '🏝️',
    antarctica: '🧊',
    antartida: '🧊',
    middleeast: '🕌',
    mediooriente: '🕌',
    mideast: '🕌',
    oriente: '🕌',
    westasia: '🕌',
    otros: '🌐'
  }

  if (emojiMap[collapsed]) {
    return emojiMap[collapsed]
  }

  const simplified = collapsed.replace(/(north|south|central|west|east|northern|southern|western|eastern|northwest|northeast|southwest|southeast|noroeste|noreste|suroeste|sureste|norte|sur|centro|occidental|oriental)/g, '')
  if (simplified && emojiMap[simplified]) {
    return emojiMap[simplified]
  }

  return '🌐'
}

const getCountryIdentifier = (country, fallbackIndex) => {
  if (!country) return fallbackIndex != null ? `country-${fallbackIndex}` : null
  return (
    country.id ||
    country.countryId ||
    country.isoCode ||
    country.code ||
    country.alpha2Code ||
    country.cca2 ||
    (fallbackIndex != null ? `country-${fallbackIndex}` : null)
  )
}

const getCountryEmoji = (country) => {
  if (!country) return '🌐'
  if (country.flagEmoji) return country.flagEmoji
  if (country.emoji) return country.emoji
  const code = country.isoCode || country.code || country.alpha2Code || country.cca2
  return isoToEmoji(code || '')
}

const buildCountry = (country, index) => {
  const name = getCountryName(country)
  const capital = getCountryCapital(country)
  const continent = getCountryContinent(country)
  const normalizedContinent = normalizeText(continent)
  const iso = (country.isoCode || country.code || country.alpha2Code || country.cca2 || '').toUpperCase()
  const displayName = name || iso || `País ${index + 1}`
  const emoji = getCountryEmoji({ ...country, isoCode: iso })
  const identifier = getCountryId(country, index)
  const original = {
    ...country,
    flagEmoji: country.flagEmoji || emoji,
    isoCode: country.isoCode || iso,
    displayName,
    displayCapital: capital,
    continent: country.continent || continent,
    id: country.id || identifier
  }

  return {
    id: identifier,
    name: displayName,
    capital,
    emoji,
    continent,
    normalizedContinent,
    searchIndex: normalizeText(`${displayName} ${capital} ${continent}`),
    original
  }
}

/**
 * CountrySelector - Nueva paleta del logo
 * Teal (#5A8A7A), Terracota (#A67C52), Dark Green (#3D5F54)
 */
const CountrySelector = ({ onSelect, selectedCountry }) => {
  const [countries, setCountries] = useState([])
  const [rawContinents, setRawContinents] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContinent, setSelectedContinent] = useState(ALL_CONTINENTS_KEY)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([loadCountries(), loadContinents()])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadCountries = async () => {
    try {
      const data = await countryService.getAllCountries()
      const processed = data.map((country, index) => buildCountry(country, index))
      const sorted = processed.sort((a, b) => COLLATOR.compare(a.name, b.name))
      setCountries(sorted)
    } catch (error) {
      console.error('Error cargando países:', error)
    }
  }

  const loadContinents = async () => {
    try {
      const data = await countryService.getAllContinents()
      if (Array.isArray(data)) {
        setRawContinents(data)
      }
    } catch (error) {
      console.error('Error cargando continentes:', error)
    }
  }

  const continentOptions = useMemo(() => {
    const map = new Map()

    map.set(ALL_CONTINENTS_KEY, {
      value: ALL_CONTINENTS_KEY,
      label: 'Todos los continentes',
      emoji: '🌐',
      count: countries.length
    })

    rawContinents.forEach((item) => {
      const label = item || 'Otros'
      const key = normalizeText(label)
      map.set(key, {
        value: key,
        label,
        emoji: getContinentEmoji(label),
        count: 0
      })
    })

    countries.forEach((country) => {
      const key = country.normalizedContinent || 'otros'
      const existing = map.get(key) || {
        value: key,
        label: country.continent || 'Otros',
        emoji: getContinentEmoji(country.continent || 'Otros'),
        count: 0
      }
      existing.label = existing.label || country.continent || 'Otros'
      existing.count += 1
      map.set(key, existing)
    })

    return Array.from(map.values())
      .filter((option) => option.value === ALL_CONTINENTS_KEY || option.count > 0)
      .sort((a, b) => {
        if (a.value === ALL_CONTINENTS_KEY) return -1
        if (b.value === ALL_CONTINENTS_KEY) return 1
        return COLLATOR.compare(a.label, b.label)
      })
  }, [countries, rawContinents])

  const filteredCountries = useMemo(() => {
    const query = normalizeText(searchQuery)
    return countries
      .filter((country) => {
        const matchesContinent =
          selectedContinent === ALL_CONTINENTS_KEY ||
          country.normalizedContinent === selectedContinent
        if (!matchesContinent) return false
        if (!query) return true
        return country.searchIndex.includes(query)
      })
      .sort((a, b) => COLLATOR.compare(a.name, b.name))
  }, [countries, selectedContinent, searchQuery])

  const activeContinent = useMemo(() => {
    return continentOptions.find((option) => option.value === selectedContinent) || continentOptions[0]
  }, [continentOptions, selectedContinent])

  const handleContinentSelect = (value) => {
    setSelectedContinent(value)
    setSearchQuery('')
  }

  const handleCountrySelect = (country) => {
    onSelect(country.original)
    setIsOpen(false)
  }

  const selectedCountryId = getCountryIdentifier(selectedCountry)
  const normalizedSelectedId = selectedCountryId != null ? selectedCountryId.toString() : null
  const selectedCountryName = getCountryName(selectedCountry) || selectedCountry?.displayName || ''
  const selectedCountryCapital = getCountryCapital(selectedCountry) || selectedCountry?.displayCapital || ''
  const selectedEmoji = getCountryEmoji(selectedCountry)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white border-2 border-accent rounded-xl cursor-pointer hover:border-secondary hover:shadow-md transition-all text-left"
      >
        {selectedCountry ? (
          <>
            <span className="text-2xl shrink-0">{selectedEmoji}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text truncate text-sm">{selectedCountryName || 'País seleccionado'}</p>
              {selectedCountryCapital && (
                <p className="text-xs text-text-light truncate">{selectedCountryCapital}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <span className="text-xl text-secondary">🌍</span>
            <span className="text-text-light text-sm">Selecciona un país...</span>
          </>
        )}
        <span className="ml-auto text-text-light text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-white border-2 border-accent rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 sm:p-5 space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-secondary">Filtra por continente</span>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {continentOptions.map((option) => {
                    const isActive = option.value === selectedContinent
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleContinentSelect(option.value)}
                        aria-pressed={isActive}
                        className={`flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-secondary/15 border-secondary text-text shadow-sm'
                            : 'border-primary-dark text-text-light hover:border-secondary hover:text-secondary'
                        }`}
                      >
                        <span>{option.emoji}</span>
                        <span>{option.label}</span>
                        <span className="text-[10px] uppercase tracking-wide text-text-lighter">{option.count}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="country-search" className="block text-xs font-semibold text-text uppercase tracking-wide">
                  Busca tu destino
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light text-sm">🔍</span>
                  <input
                    id="country-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Escribe el nombre del país o su capital"
                    className="w-full pl-9 pr-3 py-2.5 border-2 border-accent rounded-xl text-sm text-text placeholder-text-lighter focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-light">
                <span className="flex items-center gap-1">
                  <span>{activeContinent?.emoji}</span>
                  <span>{activeContinent?.label}</span>
                </span>
                <span>
                  {filteredCountries.length} de {countries.length} países
                </span>
              </div>

              {loading ? (
                <div className="py-8 text-center text-text-light">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-secondary border-t-transparent mx-auto mb-3" />
                  <p className="text-sm">Cargando destinos...</p>
                </div>
              ) : filteredCountries.length === 0 ? (
                <div className="py-8 text-center text-text-light">
                  <div className="text-3xl mb-2">🧭</div>
                  <p className="text-sm">No encontramos resultados. Prueba con otro nombre.</p>
                  {selectedContinent !== ALL_CONTINENTS_KEY && (
                    <button
                      type="button"
                      onClick={() => handleContinentSelect(ALL_CONTINENTS_KEY)}
                      className="mt-4 inline-flex items-center gap-2 text-secondary text-sm font-semibold hover:text-secondary-dark"
                    >
                      Mostrar todos los continentes
                    </button>
                  )}
                </div>
              ) : (
                <div
                  role="listbox"
                  aria-label="Países disponibles"
                  className="max-h-72 overflow-y-auto pr-1"
                >
                  <div className="grid gap-2 sm:grid-cols-2">
                    {filteredCountries.map((country) => {
                      const candidateId = getCountryIdentifier(country.original)
                      const baseId = candidateId != null ? candidateId : country.id
                      const comparisonId = baseId != null ? baseId.toString() : null
                      const isActive = Boolean(normalizedSelectedId && comparisonId === normalizedSelectedId)
                      return (
                        <button
                          key={country.id}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          onClick={() => handleCountrySelect(country)}
                          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-left transition-all ${
                            isActive
                              ? 'border-secondary bg-secondary/10 text-text shadow-sm'
                              : 'border-primary-dark bg-white hover:border-secondary hover:bg-secondary/5'
                          }`}
                        >
                          <span className="text-2xl shrink-0">{country.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text truncate">{country.name}</p>
                            <p className="text-xs text-text-light truncate">
                              {country.capital ? `${country.capital} • ${country.continent}` : country.continent}
                            </p>
                          </div>
                          {isActive && <span className="text-secondary text-base">✓</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-primary-dark pt-4 mt-2">
                <p className="text-xs text-text-light">
                  Selecciona un país para continuar y guarda tu experiencia.
                </p>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-secondary hover:text-secondary-dark hover:bg-secondary/10 transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
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

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
  if (!code || code.length !== 2) return '--'
  return code.toUpperCase()
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

const getContinentLabel = (continent) => {
  if (!continent) return 'GL'
  const normalized = normalizeText(continent)
  const cleaned = normalized.replace(/\b(del?|de|the|of)\b/g, ' ')
  const collapsed = cleaned.replace(/[^a-z0-9]/g, '')

  const labelMap = {
    africa: 'AF',
    americas: 'AM',
    america: 'AM',
    europa: 'EU',
    europe: 'EU',
    asia: 'AS',
    oceania: 'OC',
    australia: 'OC',
    pacifico: 'OC',
    pacific: 'OC',
    antarctica: 'AN',
    antartida: 'AN',
    middleeast: 'ME',
    mediooriente: 'ME',
    mideast: 'ME',
    oriente: 'ME',
    westasia: 'ME',
    otros: 'GL'
  }

  if (labelMap[collapsed]) {
    return labelMap[collapsed]
  }

  const simplified = collapsed.replace(/(north|south|central|west|east|northern|southern|western|eastern|northwest|northeast|southwest|southeast|noroeste|noreste|suroeste|sureste|norte|sur|centro|occidental|oriental)/g, '')
  if (simplified && labelMap[simplified]) {
    return labelMap[simplified]
  }

  return 'GL'
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
  if (!country) return '--'
  const code = country.isoCode || country.code || country.alpha2Code || country.cca2
  return code ? code.toUpperCase() : '--'
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
      abbr: 'GL',
      count: countries.length
    })

    rawContinents.forEach((item) => {
      const label = item || 'Otros'
      const key = normalizeText(label)
      map.set(key, {
        value: key,
        label,
        abbr: getContinentLabel(label),
        count: 0
      })
    })

    countries.forEach((country) => {
      const key = country.normalizedContinent || 'otros'
      const existing = map.get(key) || {
        value: key,
        label: country.continent || 'Otros',
        abbr: getContinentLabel(country.continent || 'Otros'),
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
    <div className="relative w-full min-w-[360px] sm:min-w-[480px] max-w-lg" ref={dropdownRef} role="combobox" aria-expanded={isOpen} aria-haspopup="listbox" aria-label="Selector de país">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-white border-2 border-accent rounded-xl cursor-pointer hover:border-secondary hover:shadow-lg transition-all text-left min-h-[60px]"
        aria-controls="country-selector-listbox"
        aria-label={selectedCountryName ? `País seleccionado: ${selectedCountryName}` : 'Abrir selector de país'}
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
            <span className="w-6 h-6 bg-golden rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </span>
            <span className="text-text-light text-sm">Selecciona un país...</span>
          </>
        )}
        <span className="ml-auto text-text-light text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="bg-white border-2 border-accent rounded-2xl shadow-xl overflow-hidden w-full" id="country-selector-listbox">
            <div className="p-5 sm:p-6 space-y-5">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wide text-secondary block">Selecciona un continente</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {continentOptions.map((option) => {
                    const isActive = option.value === selectedContinent
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleContinentSelect(option.value)}
                        aria-pressed={isActive}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all min-h-[48px] ${
                          isActive
                            ? 'bg-golden border-midnight text-midnight shadow-md'
                            : 'border-accent text-text hover:border-teal hover:bg-teal/10 hover:text-teal'
                        }`}
                      >
                        <span className="font-bold">{option.abbr}</span>
                        <span className="hidden sm:inline">{option.label}</span>
                        <span className="text-xs opacity-70">({option.count})</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="country-search" className="block text-xs font-bold text-text uppercase tracking-wide">
                  O busca por nombre
                </label>
                <div className="relative flex items-center">
                  <input
                    id="country-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nombre del país o capital..."
                    className="w-full pl-4 pr-10 py-3 border-2 border-accent rounded-xl text-sm text-text placeholder-text-light focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition min-h-[48px]"
                  />
                  <svg className="absolute right-3 w-5 h-5 text-text-light pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-text-light">
                <span className="flex items-center gap-1">
                  <span className="font-bold text-golden">{activeContinent?.abbr}</span>
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
                  <div className="w-10 h-10 mx-auto mb-3 bg-aqua rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
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
                          <span className="w-10 h-10 rounded-lg bg-midnight/10 flex items-center justify-center text-sm font-bold text-midnight shrink-0">{country.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-text truncate">{country.name}</p>
                            <p className="text-xs text-text-light truncate">
                              {country.capital ? `${country.capital} • ${country.continent}` : country.continent}
                            </p>
                          </div>
                          {isActive && (
                            <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          )}
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

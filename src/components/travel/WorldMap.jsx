import { useState, useEffect, useMemo, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { geoMercator, geoPath } from 'd3-geo'
import { MdClose, MdOpenInFull } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import Button from '../ui/Button'

const VERTICAL_LINES = Array.from({ length: 18 }, (_, i) => ({
  id: `v-${i}`,
  index: i
}))

const HORIZONTAL_LINES = Array.from({ length: 9 }, (_, i) => ({
  id: `h-${i}`,
  index: i
}))

/**
 * Interactive world map. Atlas palette (sand land, turquoise ocean) is the
 * same in light and dark; chrome around the map follows the page theme.
 */
const getIsoCode = (feature) => feature.properties['ISO3166-1-Alpha-2'] ?? feature.properties.ISO_A2
const getCountryName = (feature) => feature.properties.name ?? feature.properties.ADMIN

const STATUS_COLORS = {
  VISITED: 'var(--map-visited)',
  WISHLIST: 'var(--map-wishlist)',
  LIVED: 'var(--map-lived)',
  LIVING: 'var(--map-living)',
  default: 'var(--map-land)',
}

const WorldMap = ({ visitedPlaces = [], onCountryClick, selectedCountry, compact = false }) => {
  const { t } = useLanguage()
  const uid = useId().replace(/:/g, '')
  const mapPaneRef = useRef(null)
  const [geoData, setGeoData] = useState(null)
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 })
  const [expanded, setExpanded] = useState(false)

  const width = 960
  const height = 500

  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const response = await fetch('/data/countries.geojson')
        if (response.ok) {
          const data = await response.json()
          setGeoData(data)
        } else {
          const cdnResponse = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
          const data = await cdnResponse.json()
          setGeoData(data)
        }
      } catch (error) {
        console.error('Error cargando GeoJSON:', error)
        try {
          const cdnResponse = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
          const data = await cdnResponse.json()
          setGeoData(data)
        } catch (cdnError) {
          console.error('Error cargando desde CDN:', cdnError)
        }
      }
    }
    loadGeoData()
  }, [])

  const visitedMap = useMemo(() => {
    return visitedPlaces.reduce((acc, place) => {
      const code = place.country?.isoCode || place.countryCode
      if (code) {
        acc[code] = place.status
      }
      return acc
    }, {})
  }, [visitedPlaces])

  const markedCount = Object.keys(visitedMap).length

  const projection = useMemo(() => {
    return geoMercator()
      .scale(140)
      .translate([width / 2, height / 1.5])
  }, [])

  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection])

  const getCountryColor = (isoCode) => {
    const status = visitedMap[isoCode]
    if (status) {
      return STATUS_COLORS[status]
    }
    return STATUS_COLORS.default
  }

  const getCountryOpacity = (isoCode) => {
    if (selectedCountry && selectedCountry === isoCode) return 1
    if (hoveredCountry === isoCode) return 0.9
    if (visitedMap[isoCode]) return 0.9
    return 1
  }

  const handleMouseMove = (e, country) => {
    const pane = mapPaneRef.current
    if (!pane) return
    const rect = pane.getBoundingClientRect()
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setHoveredCountry(getIsoCode(country))
  }

  const handleMouseLeave = () => {
    setHoveredCountry(null)
  }

  const handleClick = (isoCode) => {
    if (onCountryClick && isoCode !== '-99') {
      setExpanded(false)
      onCountryClick(isoCode)
    }
  }

  useEffect(() => {
    if (!expanded) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        setExpanded(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [expanded])

  const legendItems = [
    { status: 'VISITED', label: t('travel.visited'), color: STATUS_COLORS.VISITED },
    { status: 'WISHLIST', label: t('travel.wantToGo'), color: STATUS_COLORS.WISHLIST },
    { status: 'LIVED', label: t('travel.lived'), color: STATUS_COLORS.LIVED },
    { status: 'LIVING', label: t('travel.living'), color: STATUS_COLORS.LIVING },
  ]

  if (!geoData) {
    return (
      <div className={`w-full rounded-lg bg-surface-container-low ${compact ? 'p-2' : 'p-6'}`}>
        <div className="aspect-[2/1] w-full flex items-center justify-center">
          <div className={`animate-spin rounded-full border-b-2 border-primary ${compact ? 'h-6 w-6' : 'h-12 w-12'}`} />
          {!compact && <span className="ml-4 text-on-surface">{t('travel.loadingMap') || 'Cargando mapa...'}</span>}
        </div>
      </div>
    )
  }

  const mapSvg = (
    <svg
      role="img"
      aria-label={t('travel.title')}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
      overflow="hidden"
    >
      <defs>
        <linearGradient id={`${uid}-ocean`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--map-ocean-0)" />
          <stop offset="50%" stopColor="var(--map-ocean-1)" />
          <stop offset="100%" stopColor="var(--map-ocean-2)" />
        </linearGradient>
        <filter id={`${uid}-glow`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width={width} height={height} fill={`url(#${uid}-ocean)`} />

      <g style={{ opacity: 'var(--map-grid-opacity)' }}>
        {VERTICAL_LINES.map((line) => (
          <line
            key={line.id}
            x1={line.index * (width / 18)}
            y1={0}
            x2={line.index * (width / 18)}
            y2={height}
            stroke="var(--map-grid)"
            strokeWidth="0.5"
          />
        ))}
        {HORIZONTAL_LINES.map((line) => (
          <line
            key={line.id}
            x1={0}
            y1={line.index * (height / 9)}
            x2={width}
            y2={line.index * (height / 9)}
            stroke="var(--map-grid)"
            strokeWidth="0.5"
          />
        ))}
      </g>

      <g>
        {geoData.features.map((country, index) => {
          const isoCode = getIsoCode(country)
          const isSelected = Boolean(selectedCountry) && selectedCountry === isoCode
          const path = pathGenerator(country)
          if (!path) return null

          return (
            <path
              key={`${isoCode}-${index}`}
              d={path}
              fill={getCountryColor(isoCode)}
              fillOpacity={getCountryOpacity(isoCode)}
              stroke={isSelected ? 'var(--map-selected)' : 'var(--map-stroke)'}
              strokeWidth={isSelected ? 2 : 0.5}
              className={`transition-all duration-200 ${onCountryClick ? 'cursor-pointer' : ''}`}
              style={{
                filter: hoveredCountry === isoCode ? `url(#${uid}-glow)` : 'none'
              }}
              onMouseMove={(e) => handleMouseMove(e, country)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(isoCode)}
            />
          )
        })}
      </g>
    </svg>
  )

  if (compact) {
    return (
      <div ref={mapPaneRef} className="relative w-full overflow-hidden rounded-base">
        <div className="aspect-[2/1] w-full">{mapSvg}</div>
      </div>
    )
  }

  const layout = (
    <div
      className="flex w-full flex-col gap-4 md:flex-row md:items-stretch"
    >
      <div
        ref={mapPaneRef}
        className="relative min-w-0 flex-1 overflow-hidden rounded-lg shadow-level-1 ring-1 ring-outline-variant/50"
      >
        <div className="aspect-[2/1] w-full">
          {mapSvg}
        </div>

        {hoveredCountry && (
          <div
            className="absolute z-10 pointer-events-none -translate-x-1/2 -translate-y-full rounded-base bg-surface-container-lowest px-3 py-2 shadow-level-2"
            style={{
              left: tooltip.x,
              top: tooltip.y - 10,
              minWidth: '140px'
            }}
          >
            <span className="font-semibold text-on-surface text-body-sm">
              {(() => {
                const feature = geoData.features.find(f => getIsoCode(f) === hoveredCountry)
                return (feature && getCountryName(feature)) || hoveredCountry
              })()}
            </span>
            {visitedMap[hoveredCountry] && (
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-surface-container px-2 py-0.5 text-caption font-medium text-on-surface">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[visitedMap[hoveredCountry]] }} aria-hidden="true" />
                {visitedMap[hoveredCountry]}
              </span>
            )}
          </div>
        )}
      </div>

      <aside className="flex shrink-0 flex-col gap-3 sm:flex-row md:w-44 md:flex-col lg:w-48">
        <div className="flex flex-1 flex-col justify-center rounded-lg bg-primary-fixed px-4 py-3 md:flex-none">
          <p className="font-headline text-headline-md text-on-primary-fixed leading-none">{markedCount}</p>
          <p className="mt-1 text-label-md font-semibold text-on-primary-fixed">
            {t('travel.countriesMarked')}
          </p>
        </div>

        <div className="flex flex-1 flex-col rounded-lg bg-surface-container-low px-4 py-3">
          <h4 className="mb-2 text-label-md font-semibold uppercase tracking-wide text-on-surface">
            {t('travel.legend')}
          </h4>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-2 md:grid-cols-1">
            {legendItems.map((item) => (
              <li key={item.status} className="flex items-center gap-2">
                <span
                  className="h-3.5 w-3.5 shrink-0 rounded-sm shadow-sm"
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span className="text-caption font-medium text-on-surface">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          variant={expanded ? 'ghost' : 'secondary'}
          className="w-full sm:w-auto md:w-full"
          icon={expanded ? MdClose : MdOpenInFull}
          autoFocus={expanded}
          onClick={() => setExpanded((open) => !open)}
        >
          {expanded ? t('travel.closeMap') : t('travel.enlargeMap')}
        </Button>
      </aside>
    </div>
  )

  if (expanded) {
    return createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center p-3 md:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={t('travel.title')}
      >
        <div
          className="absolute inset-0 bg-inverse-surface/55 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
          aria-hidden="true"
        />
        <div className="relative z-10 w-full rounded-lg bg-surface-container-lowest p-3 shadow-level-3 md:p-4">
          {layout}
        </div>
      </div>,
      document.body
    )
  }

  return layout
}

WorldMap.propTypes = {
  visitedPlaces: PropTypes.array,
  onCountryClick: PropTypes.func,
  selectedCountry: PropTypes.string,
  compact: PropTypes.bool,
}

export default WorldMap

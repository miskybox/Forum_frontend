import { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { geoMercator, geoPath } from 'd3-geo'
import { useLanguage } from '../../contexts/LanguageContext'

// Constantes pre-generadas para elementos decorativos (evita recalcular en cada render)
const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: `star-${i}`,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 3
}))

const VERTICAL_LINES = Array.from({ length: 18 }, (_, i) => ({
  id: `v-${i}`,
  index: i
}))

const HORIZONTAL_LINES = Array.from({ length: 9 }, (_, i) => ({
  id: `h-${i}`,
  index: i
}))

/**
 * Componente de mapa mundial interactivo con GeoJSON real
 * Muestra países coloreados según su estado de visita
 */
// countries.geojson uses ISO3166-1-Alpha-2/name; older Natural Earth files use ISO_A2/ADMIN
const getIsoCode = (feature) => feature.properties['ISO3166-1-Alpha-2'] ?? feature.properties.ISO_A2
const getCountryName = (feature) => feature.properties.name ?? feature.properties.ADMIN

const WorldMap = ({ visitedPlaces = [], onCountryClick, selectedCountry }) => {
  const { t } = useLanguage()
  const [geoData, setGeoData] = useState(null)
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 })

  // Dimensiones del mapa
  const width = 960
  const height = 500

  // Status colors from the Tierra & Rumbo palette
  const statusColors = {
    VISITED: '#476558',    // secondary (sage)
    WISHLIST: '#ffb691',   // primary-fixed-dim (peach)
    LIVED: '#b05f32',      // primary-container (terracotta)
    LIVING: '#763308',     // on-primary-fixed-variant (clay)
    default: '#dee4df'     // surface-container-highest (land)
  }

  // Cargar GeoJSON
  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const response = await fetch('/data/countries.geojson')
        if (response.ok) {
          const data = await response.json()
          setGeoData(data)
        } else {
          // Fallback: cargar desde CDN si el archivo local no está disponible
          const cdnResponse = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
          const data = await cdnResponse.json()
          setGeoData(data)
        }
      } catch (error) {
        console.error('Error cargando GeoJSON:', error)
        // Cargar desde CDN como fallback
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

  // Crear mapa de países visitados para búsqueda rápida
  const visitedMap = useMemo(() => {
    return visitedPlaces.reduce((acc, place) => {
      const code = place.country?.isoCode || place.countryCode
      if (code) {
        acc[code] = place.status
      }
      return acc
    }, {})
  }, [visitedPlaces])

  // Configurar proyección
  const projection = useMemo(() => {
    return geoMercator()
      .scale(140)
      .translate([width / 2, height / 1.5])
  }, [])

  // Crear generador de paths
  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection])

  const getCountryColor = (isoCode) => {
    const status = visitedMap[isoCode]
    if (status) {
      return statusColors[status]
    }
    return statusColors.default
  }

  const getCountryOpacity = (isoCode) => {
    if (selectedCountry && selectedCountry === isoCode) return 1
    if (hoveredCountry === isoCode) return 0.9
    if (visitedMap[isoCode]) return 0.9
    return 1
  }

  const handleMouseMove = (e, country) => {
    const rect = e.currentTarget.getBoundingClientRect()
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
      onCountryClick(isoCode)
    }
  }

  if (!geoData) {
    return (
      <div className="relative w-full bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-lg p-6">
        <div className="aspect-[2/1] w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-4 text-on-surface">Cargando mapa...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-lg p-2 md:p-4 overflow-hidden">
      {/* Estrellas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-30"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Leyenda — oculta en móvil, visible en sm+ */}
      <div className="hidden sm:block absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md rounded-base p-2 md:p-3 z-20 shadow-level-1">
        <h4
          className="font-semibold mb-2 text-xs md:text-sm flex items-center gap-2 text-on-surface"
        >
          {t('travel.legend')}
        </h4>
        <div className="space-y-1 md:space-y-2">
          {[
            { status: 'VISITED', label: t('travel.visited'), color: statusColors.VISITED },
            { status: 'WISHLIST', label: t('travel.wantToGo'), color: statusColors.WISHLIST },
            { status: 'LIVED', label: t('travel.lived'), color: statusColors.LIVED },
            { status: 'LIVING', label: t('travel.living'), color: statusColors.LIVING },
          ].map(item => (
            <div key={item.status} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 md:w-4 md:h-4 rounded-sm shadow-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span
                className="text-xs font-medium text-on-surface"
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCountry && (
        <div
          className="absolute bg-surface-container-lowest rounded-base px-4 py-2 shadow-level-2 z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            minWidth: '150px'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-on-surface">
              {(() => {
                const feature = geoData.features.find(f => getIsoCode(f) === hoveredCountry)
                return (feature && getCountryName(feature)) || hoveredCountry
              })()}
            </span>
          </div>
          {visitedMap[hoveredCountry] && (
            <span className="inline-flex items-center gap-1.5 mt-1 text-xs px-2 py-1 rounded-full bg-surface-container text-on-surface font-medium">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[visitedMap[hoveredCountry]] }} aria-hidden="true" />
              {visitedMap[hoveredCountry]}
            </span>
          )}
        </div>
      )}

      {/* Estadísticas rápidas con outline para accesibilidad */}
      <div className="absolute top-4 left-4 bg-primary-fixed/90 backdrop-blur-md rounded-base p-3 z-20 shadow-level-1">
        <div className="text-sm">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-bold text-lg text-on-primary-fixed"
            >
              {Object.keys(visitedMap).length}
            </span>
          </div>
          <span
            className="text-xs font-semibold text-on-primary-fixed"
          >
            {t('travel.countriesMarked')}
          </span>
        </div>
      </div>

      {/* Mapa SVG */}
      <div className="relative aspect-[2/1] w-full">
        <svg
          role="img"
          aria-label={t('travel.title')}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          overflow="hidden"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
        >
          {/* Gradiente para océano */}
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eef6f3" />
              <stop offset="50%" stopColor="#e2efeb" />
              <stop offset="100%" stopColor="#d6e8e2" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Océano */}
          <rect x="0" y="0" width={width} height={height} fill="url(#oceanGradient)" />

          {/* Líneas de grid */}
          <g className="opacity-10">
            {VERTICAL_LINES.map((line) => (
              <line
                key={line.id}
                x1={line.index * (width / 18)}
                y1={0}
                x2={line.index * (width / 18)}
                y2={height}
                stroke="#476558"
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
                stroke="#476558"
                strokeWidth="0.5"
              />
            ))}
          </g>

          {/* Países */}
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
                  stroke={isSelected ? '#91471c' : '#ffffff'}
                  strokeWidth={isSelected ? 2 : 0.5}
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter: hoveredCountry === isoCode ? 'url(#glow)' : 'none'
                  }}
                  onMouseMove={(e) => handleMouseMove(e, country)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(isoCode)}
                />
              )
            })}
          </g>
        </svg>

      </div>
    </div>
  )
}

WorldMap.propTypes = {
  visitedPlaces: PropTypes.array,
  onCountryClick: PropTypes.func,
  selectedCountry: PropTypes.string
}

export default WorldMap

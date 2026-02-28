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
const WorldMap = ({ visitedPlaces = [], onCountryClick, selectedCountry }) => {
  const { t } = useLanguage()
  const [geoData, setGeoData] = useState(null)
  const [hoveredCountry, setHoveredCountry] = useState(null)
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 })

  // Dimensiones del mapa
  const width = 960
  const height = 500

  // Colores según estado (paleta accesible)
  const statusColors = {
    VISITED: '#24968d',    // Turquesa profundo
    WISHLIST: '#f23d36',   // Coral intenso
    LIVED: '#3f7eb8',      // Azul océano
    LIVING: '#2356a3',     // Azul atlántico
    default: '#0f403c'     // Verde mar oscuro
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
    if (selectedCountry === isoCode) return 1
    if (hoveredCountry === isoCode) return 0.9
    if (visitedMap[isoCode]) return 0.85
    return 0.6
  }

  const handleMouseMove = (e, country) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setHoveredCountry(country.properties.ISO_A2)
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
      <div className="relative w-full bg-gradient-to-br from-primary-light to-primary-dark rounded-2xl p-6 shadow-2xl">
        <div className="aspect-[2/1] w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success"></div>
          <span className="ml-4 text-text">Cargando mapa...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full bg-gradient-to-br from-primary-light to-primary-dark rounded-2xl p-4 md:p-6 shadow-2xl overflow-hidden">
      {/* Estrellas decorativas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-accent rounded-full opacity-30"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      {/* Leyenda — oculta en móvil, visible en sm+ */}
      <div className="hidden sm:block absolute top-4 right-4 bg-primary-light/90 backdrop-blur-md rounded-xl p-2 md:p-4 z-20 border border-secondary">
        <h4
          className="font-semibold mb-2 text-xs md:text-sm flex items-center gap-2"
          style={{
            color: '#FFFFFF',
            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 8px rgba(0,0,0,0.8)'
          }}
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
                className="text-xs font-medium"
                style={{
                  color: '#FFFFFF',
                  textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 6px rgba(0,0,0,0.7)'
                }}
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
          className="absolute bg-primary-light border border-secondary rounded-lg px-4 py-2 shadow-xl z-30 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: tooltip.x,
            top: tooltip.y - 10,
            minWidth: '150px'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              {geoData.features.find(f => f.properties.ISO_A2 === hoveredCountry)?.properties.ADMIN || hoveredCountry}
            </span>
          </div>
          {visitedMap[hoveredCountry] && (
            <span
              className="inline-block mt-1 text-xs px-2 py-1 rounded-full text-white font-medium"
              style={{ backgroundColor: statusColors[visitedMap[hoveredCountry]] }}
            >
              {visitedMap[hoveredCountry]}
            </span>
          )}
        </div>
      )}

      {/* Estadísticas rápidas con outline para accesibilidad */}
      <div className="absolute top-4 left-4 bg-golden/90 backdrop-blur-md rounded-xl p-4 z-20 border border-midnight">
        <div className="text-sm">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-bold text-lg"
              style={{
                color: '#213638',
                textShadow: '-1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF'
              }}
            >
              {Object.keys(visitedMap).length}
            </span>
          </div>
          <span
            className="text-xs font-semibold"
            style={{
              color: '#213638',
              textShadow: '-1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF'
            }}
          >
            {t('travel.countriesMarked')}
          </span>
        </div>
      </div>

      {/* Mapa SVG */}
      <div className="relative aspect-[2/1] w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          overflow="hidden"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
        >
          {/* Gradiente para océano */}
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0d1b2e" />
              <stop offset="50%" stopColor="#13305b" />
              <stop offset="100%" stopColor="#0f403c" />
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
                stroke="#f7fbff"
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
                stroke="#f7fbff"
                strokeWidth="0.5"
              />
            ))}
          </g>

          {/* Países */}
          <g>
            {geoData.features.map((country, index) => {
              const isoCode = country.properties.ISO_A2
              const path = pathGenerator(country)
              if (!path) return null

              return (
                <path
                  key={`${isoCode}-${index}`}
                  d={path}
                  fill={getCountryColor(isoCode)}
                  fillOpacity={getCountryOpacity(isoCode)}
                  stroke={selectedCountry === isoCode ? '#33b0a7' : '#0f403c'}
                  strokeWidth={selectedCountry === isoCode ? 2 : 0.5}
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

import { useId } from 'react'
import PropTypes from 'prop-types'

const WIDTH = 320
const HEIGHT = 72
const PAD_Y = 6

const toPoints = (values) => {
  if (!values.length) return []
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  return values.map((value, index) => {
    const x = values.length === 1 ? WIDTH / 2 : (index / (values.length - 1)) * WIDTH
    const y = HEIGHT - PAD_Y - ((value - min) / span) * (HEIGHT - PAD_Y * 2)
    return { x, y }
  })
}

/**
 * Inline SVG sparkline for a route elevation track (terracotta stroke + fill).
 */
const ElevationProfile = ({
  points = [],
  labels = [],
  label = 'Perfil de elevación',
  className = '',
}) => {
  const gradientId = useId()
  const coords = toPoints(points)
  const line = coords.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')
  const area = coords.length
    ? `M0 ${HEIGHT} ${coords.map(({ x, y }) => `L${x} ${y}`).join(' ')} L${WIDTH} ${HEIGHT} Z`
    : ''

  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-20"
        role="img"
        aria-label={label}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {area && <path d={area} fill={`url(#${gradientId})`} />}
        {line && (
          <path
            d={line}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {coords.map((point, index) => (
          <circle
            key={`${point.x}-${index}`}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="var(--color-primary)"
            stroke="var(--color-background)"
            strokeWidth="1.5"
          />
        ))}
      </svg>
      {labels.length > 0 && (
        <figcaption className="mt-space-xs flex justify-between text-caption text-on-surface-variant">
          {labels.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </figcaption>
      )}
    </figure>
  )
}

ElevationProfile.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number),
  labels: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  className: PropTypes.string,
}

export default ElevationProfile

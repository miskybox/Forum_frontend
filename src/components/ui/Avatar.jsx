import { useState } from 'react'
import PropTypes from 'prop-types'

const SIZES = {
  xs: 'w-6 h-6 text-caption',
  sm: 'w-8 h-8 text-caption',
  md: 'w-10 h-10 text-label-md',
  lg: 'w-12 h-12 text-label-lg',
  xl: 'w-32 h-32 lg:w-36 lg:h-36 text-headline-md',
}

const TONES = {
  primary: 'bg-primary text-on-primary',
  primarySoft: 'bg-primary-fixed text-on-primary-fixed',
  secondary: 'bg-secondary text-on-secondary',
  secondarySoft: 'bg-secondary-fixed text-on-secondary-fixed',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
  tertiarySoft: 'bg-tertiary-fixed text-on-tertiary-fixed',
}

const TONE_KEYS = Object.keys(TONES)

const getInitials = (name = '') => {
  const clean = name.replace(/^@/, '').trim()
  if (!clean) return '?'
  const parts = clean.split(/[\s._-]+/).filter(Boolean)
  const letters = parts.length > 1 ? parts[0][0] + parts[1][0] : clean.slice(0, 2)
  return letters.toUpperCase()
}

// Stable tone per name so the same user always gets the same color
const toneFor = (name = '') => {
  let hash = 0
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return TONE_KEYS[hash % TONE_KEYS.length]
}

const Avatar = ({ name, src, size = 'md', tone, className = '' }) => {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = src && !imageFailed
  const toneClass = TONES[tone || toneFor(name)]

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 rounded-full overflow-hidden font-bold select-none ${SIZES[size]} ${showImage ? 'bg-surface-container' : toneClass} ${className}`}
      aria-hidden="true"
    >
      {showImage ? (
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          onError={() => setImageFailed(true)}
        />
      ) : (
        getInitials(name)
      )}
    </span>
  )
}

Avatar.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(SIZES)),
  tone: PropTypes.oneOf(TONE_KEYS),
  className: PropTypes.string,
}

export default Avatar

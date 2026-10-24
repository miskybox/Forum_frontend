import { useState } from 'react'
import PropTypes from 'prop-types'
import { MdVerified } from 'react-icons/md'

const SIZES = {
  xs: 'w-6 h-6 text-caption',
  sm: 'w-8 h-8 text-caption',
  md: 'w-10 h-10 text-label-md',
  lg: 'w-12 h-12 text-label-lg',
  xl: 'w-32 h-32 lg:w-36 lg:h-36 text-headline-md',
}

const VERIFIED_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-8 h-8',
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

const Avatar = ({ name, src, size = 'md', tone, verified = false, className = '' }) => {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = src && !imageFailed
  const toneClass = TONES[tone || toneFor(name)]

  return (
    <span className={`relative inline-flex flex-shrink-0 ${className}`}>
      <span
        className={`inline-flex items-center justify-center rounded-full overflow-hidden font-bold select-none ${SIZES[size]} ${showImage ? 'bg-surface-container' : toneClass}`}
        aria-hidden="true"
      >
        {showImage ? (
          <img
            src={src}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          getInitials(name)
        )}
      </span>
      {verified && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 inline-flex items-center justify-center rounded-full bg-secondary text-on-secondary ring-2 ring-surface ${VERIFIED_SIZES[size]}`}
          title="Verificado"
          aria-label="Verificado"
        >
          <MdVerified className="w-[80%] h-[80%]" aria-hidden="true" />
        </span>
      )}
    </span>
  )
}

Avatar.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  size: PropTypes.oneOf(Object.keys(SIZES)),
  tone: PropTypes.oneOf(TONE_KEYS),
  verified: PropTypes.bool,
  className: PropTypes.string,
}

export const AvatarStack = ({ people = [], max = 4, size = 'sm', className = '' }) => {
  const visible = people.slice(0, max)
  const extra = people.length - visible.length

  return (
    <div className={`flex items-center ${className}`} role="group" aria-label="Avatares">
      {visible.map((person, index) => (
        <Avatar
          key={person.id ?? person.name ?? index}
          name={person.name}
          src={person.src}
          size={size}
          tone={person.tone}
          verified={person.verified}
          className={`ring-2 ring-surface ${index > 0 ? '-ml-2' : ''}`}
        />
      ))}
      {extra > 0 && (
        <span
          className={`inline-flex items-center justify-center -ml-2 rounded-full bg-surface-container-high text-on-surface-variant font-bold ring-2 ring-surface ${SIZES[size]}`}
        >
          +{extra}
        </span>
      )}
    </div>
  )
}

AvatarStack.propTypes = {
  people: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      src: PropTypes.string,
      tone: PropTypes.oneOf(TONE_KEYS),
      verified: PropTypes.bool,
    })
  ),
  max: PropTypes.number,
  size: PropTypes.oneOf(Object.keys(SIZES)),
  className: PropTypes.string,
}

export default Avatar

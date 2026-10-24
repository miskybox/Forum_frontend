export const TONE_BY_CATEGORY = {
  General: 'sage',
  Europa: 'clay',
  Asia: 'forest',
  África: 'sage',
  América: 'clay',
  'América del Norte': 'clay',
  'América del Sur': 'clay',
  Oceanía: 'forest',
  Antártida: 'mist',
}

export const SURFACE_TONES = {
  sage: {
    article: 'bg-secondary-fixed text-on-secondary-fixed',
    muted: 'text-on-secondary-fixed-variant',
    tag: 'bg-secondary-container text-on-secondary-container',
    border: 'border-on-secondary-fixed/15',
    title: 'text-on-secondary-fixed hover:text-on-secondary-fixed-variant',
    action: 'text-on-secondary-fixed-variant hover:text-on-secondary-fixed',
    placeholder: 'from-secondary-container/50 to-secondary-fixed',
  },
  clay: {
    article: 'tone-clay-article text-on-primary-fixed',
    muted: 'text-on-primary-fixed-variant',
    tag: 'bg-primary-container text-on-primary-container',
    border: 'border-on-primary-fixed/15',
    title: 'text-on-primary-fixed hover:text-on-primary-fixed-variant',
    action: 'text-on-primary-fixed-variant hover:text-on-primary-fixed',
    placeholder: 'from-primary-container/40 to-primary-fixed',
  },
  forest: {
    article: 'bg-tertiary-fixed text-on-tertiary-fixed',
    muted: 'text-on-tertiary-fixed-variant',
    tag: 'bg-tertiary-container text-on-tertiary-container',
    border: 'border-on-tertiary-fixed/15',
    title: 'text-on-tertiary-fixed hover:text-on-tertiary-fixed-variant',
    action: 'text-on-tertiary-fixed-variant hover:text-on-tertiary-fixed',
    placeholder: 'from-tertiary-container/40 to-tertiary-fixed',
  },
  mist: {
    article: 'bg-surface-container text-on-surface',
    muted: 'text-on-surface-variant',
    tag: 'bg-surface-container-highest text-on-surface',
    border: 'border-outline-variant/60',
    title: 'text-on-surface hover:text-primary',
    action: 'text-primary hover:text-primary-container',
    placeholder: 'from-secondary-fixed to-surface-container',
  },
}

const FALLBACK_KEYS = ['sage', 'clay', 'forest', 'mist']

export const surfaceToneFor = ({ categoryName, forumName, id } = {}) => {
  const named = TONE_BY_CATEGORY[categoryName] || TONE_BY_CATEGORY[forumName]
  if (named) return SURFACE_TONES[named]
  const index = Math.abs(Number(id) || 0) % FALLBACK_KEYS.length
  return SURFACE_TONES[FALLBACK_KEYS[index]]
}

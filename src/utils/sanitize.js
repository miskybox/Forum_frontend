import DOMPurify from 'dompurify'

/**
 * Configuración de sanitización para diferentes contextos
 */
const SANITIZE_CONFIG = {
  // Configuración estricta: solo texto, sin HTML
  STRICT: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  },

  // Configuración básica: formato simple permitido
  BASIC: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  },

  // Configuración media: más formato y listas
  MEDIUM: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p', 'ul', 'ol', 'li', 'blockquote'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  },

  // Configuración para enlaces: permite links
  WITH_LINKS: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br', 'p', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
    KEEP_CONTENT: true
  }
}

/**
 * Sanitiza un string usando DOMPurify
 * @param {string} input - El texto a sanitizar
 * @param {string} level - Nivel de sanitización: 'STRICT', 'BASIC', 'MEDIUM', 'WITH_LINKS'
 * @returns {string} - Texto sanitizado
 */
export const sanitizeInput = (input, level = 'BASIC') => {
  if (!input || typeof input !== 'string') {
    return input
  }

  const config = SANITIZE_CONFIG[level] || SANITIZE_CONFIG.BASIC
  return DOMPurify.sanitize(input, config)
}

/**
 * Sanitiza un array de strings
 * @param {Array<string>} array - Array de textos a sanitizar
 * @param {string} level - Nivel de sanitización
 * @returns {Array<string>} - Array de textos sanitizados
 */
export const sanitizeArray = (array, level = 'STRICT') => {
  if (!Array.isArray(array)) {
    return array
  }

  return array.map(item => sanitizeInput(item, level))
}

/**
 * Sanitiza un objeto completo, procesando solo las propiedades string
 * @param {Object} obj - Objeto a sanitizar
 * @param {Object} fieldConfig - Configuración por campo: { fieldName: 'LEVEL' }
 * @returns {Object} - Objeto sanitizado
 */
export const sanitizeObject = (obj, fieldConfig = {}) => {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  const sanitized = { ...obj }

  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key]
    const level = fieldConfig[key] || 'BASIC'

    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value, level)
    } else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
      sanitized[key] = sanitizeArray(value, level)
    }
  })

  return sanitized
}

/**
 * Valida la longitud de un string
 * @param {string} input - Texto a validar
 * @param {number} min - Longitud mínima
 * @param {number} max - Longitud máxima
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateLength = (input, min = 0, max = Infinity) => {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'El campo es obligatorio' }
  }

  const trimmed = input.trim()

  if (trimmed.length < min) {
    return { valid: false, error: `Debe tener al menos ${min} caracteres` }
  }

  if (trimmed.length > max) {
    return { valid: false, error: `No puede exceder ${max} caracteres` }
  }

  return { valid: true, error: null }
}

/**
 * Limpia y valida un tag
 * @param {string} tag - Tag a validar
 * @returns {Object} - { valid: boolean, cleaned: string, error: string }
 */
export const validateTag = (tag) => {
  if (!tag || typeof tag !== 'string') {
    return { valid: false, cleaned: '', error: 'Tag inválido' }
  }

  // Sanitizar el tag
  const cleaned = sanitizeInput(tag.trim(), 'STRICT')

  // Validar longitud
  if (cleaned.length < 2) {
    return { valid: false, cleaned, error: 'El tag debe tener al menos 2 caracteres' }
  }

  if (cleaned.length > 30) {
    return { valid: false, cleaned, error: 'El tag no puede exceder 30 caracteres' }
  }

  // Validar caracteres permitidos (solo alfanuméricos, espacios, guiones)
  const validPattern = /^[a-zA-Z0-9\sáéíóúñÁÉÍÓÚÑ-]+$/
  if (!validPattern.test(cleaned)) {
    return { valid: false, cleaned, error: 'El tag contiene caracteres no permitidos' }
  }

  return { valid: true, cleaned, error: null }
}

/**
 * Constantes de límites de longitud para formularios
 */
export const LENGTH_LIMITS = {
  FORUM_TITLE: { min: 5, max: 100 },
  FORUM_DESCRIPTION: { min: 10, max: 500 },
  POST_TITLE: { min: 5, max: 150 },
  POST_CONTENT: { min: 10, max: 10000 },
  COMMENT_CONTENT: { min: 1, max: 2000 },
  TAG: { min: 2, max: 30 },
  TAG_MAX_COUNT: 10
}

/**
 * Security: Lista de rutas permitidas para redirección
 * Previene ataques de open redirect
 */
const ALLOWED_REDIRECT_PATHS = [
  '/',
  '/forums',
  '/trivia',
  '/travel',
  '/profile',
  '/feed',
  '/contenido',
  '/blog',
  '/notifications',
  '/messages',
  '/login',
  '/register'
]

/**
 * Security: Valida y sanitiza una ruta de redirección
 * Previene ataques de open redirect permitiendo solo rutas locales válidas
 * @param {string} path - Ruta a validar
 * @param {string} fallback - Ruta por defecto si la validación falla
 * @returns {string} - Ruta segura
 */
export const getSafeRedirectPath = (path, fallback = '/') => {
  // Si no hay ruta o no es string, devolver fallback
  if (!path || typeof path !== 'string') {
    return fallback
  }

  // Eliminar espacios y normalizar
  const cleanPath = path.trim()

  // Debe empezar con / (ruta relativa local)
  if (!cleanPath.startsWith('/')) {
    return fallback
  }

  // No permitir protocolo (previene //evil.com)
  if (cleanPath.startsWith('//')) {
    return fallback
  }

  // No permitir path traversal
  if (cleanPath.includes('..') || cleanPath.includes('\\')) {
    return fallback
  }

  // Obtener la ruta base (sin query params o hash)
  const basePath = cleanPath.split('?')[0].split('#')[0]

  // Verificar si la ruta base está en la lista permitida
  const isAllowed = ALLOWED_REDIRECT_PATHS.some(allowed => {
    // Coincidencia exacta o ruta que empieza con el path permitido seguido de /
    return basePath === allowed || basePath.startsWith(allowed + '/')
  })

  if (isAllowed) {
    return cleanPath
  }

  return fallback
}

export default {
  sanitizeInput,
  sanitizeArray,
  sanitizeObject,
  validateLength,
  validateTag,
  getSafeRedirectPath,
  LENGTH_LIMITS
}

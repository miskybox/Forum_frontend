/**
 * Long Spanish date ("12 de mayo de 2026"); returns `fallback` for missing or invalid input.
 */
export const formatLongDate = (dateString, fallback = '') => {
  if (!dateString) return fallback
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return fallback
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

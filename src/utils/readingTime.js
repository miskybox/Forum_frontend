const WORDS_PER_MINUTE = 200

const toPlainText = (value) => String(value || '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim()

export const readingMinutes = (htmlOrText = '') => {
  const words = toPlainText(htmlOrText).split(' ').filter(Boolean).length
  if (words === 0) return 1
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

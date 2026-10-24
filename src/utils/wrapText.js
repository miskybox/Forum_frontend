export const wrapText = (value, start, end, before, after = before, fallback = 'texto') => {
  const from = Math.max(0, start)
  const to = Math.max(from, end)
  const selected = value.slice(from, to)
  const inner = selected || fallback
  const next = `${value.slice(0, from)}${before}${inner}${after}${value.slice(to)}`
  const innerStart = from + before.length
  return {
    value: next,
    selectionStart: innerStart,
    selectionEnd: innerStart + inner.length,
  }
}

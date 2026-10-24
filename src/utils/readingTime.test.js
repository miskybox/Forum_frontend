import { readingMinutes } from './readingTime'

describe('readingMinutes', () => {
  it('returns at least one minute for empty content', () => {
    expect(readingMinutes('')).toBe(1)
    expect(readingMinutes('<p></p>')).toBe(1)
  })

  it('counts words in HTML and rounds up', () => {
    const words = Array.from({ length: 250 }, (_, index) => `palabra${index}`).join(' ')
    expect(readingMinutes(`<p>${words}</p>`)).toBe(2)
  })
})

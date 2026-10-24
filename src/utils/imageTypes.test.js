import { ACCEPTED_IMAGE_ACCEPT, isAcceptedImageFile } from './imageTypes'

describe('imageTypes', () => {
  it('accepts jpeg, png and webp only', () => {
    expect(isAcceptedImageFile({ type: 'image/jpeg' })).toBe(true)
    expect(isAcceptedImageFile({ type: 'image/png' })).toBe(true)
    expect(isAcceptedImageFile({ type: 'image/webp' })).toBe(true)
    expect(isAcceptedImageFile({ type: 'image/gif' })).toBe(false)
    expect(isAcceptedImageFile({ type: 'image/svg+xml' })).toBe(false)
    expect(isAcceptedImageFile({ type: 'text/html' })).toBe(false)
  })

  it('exposes a file input accept list without wildcards', () => {
    expect(ACCEPTED_IMAGE_ACCEPT).toBe('image/jpeg,image/png,image/webp')
  })
})

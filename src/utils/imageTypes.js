export const ACCEPTED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const ACCEPTED_IMAGE_ACCEPT = ACCEPTED_IMAGE_MIME_TYPES.join(',')

export const isAcceptedImageFile = (file) => {
  if (!file) return false
  const type = String(file.type || '').split(';')[0].trim().toLowerCase()
  return ACCEPTED_IMAGE_MIME_TYPES.includes(type)
}

/**
 * Creates a cropped image Blob from a source image URL and pixel crop area.
 * Used by the image crop UI in ForumForm / CategoryForm.
 *
 * @param {string} imageSrc  - data URL or object URL of the source image
 * @param {Object} pixelCrop - { x, y, width, height } in pixels
 * @param {string} [mimeType='image/jpeg']
 * @returns {Promise<Blob>}
 */
export async function getCroppedImg(imageSrc, pixelCrop, mimeType = 'image/jpeg') {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas toBlob failed'))
    }, mimeType, 0.92)
  })
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.addEventListener('load', () => resolve(img))
    img.addEventListener('error', reject)
    img.setAttribute('crossOrigin', 'anonymous')
    img.src = url
  })
}

/**
 * compress-assets.mjs
 * Optimiza todas las imágenes estáticas de src/assets:
 *  - Fotos JPG → max 1200px ancho, calidad 82, sobrescribe en el mismo archivo
 *  - Logos PNG → convierte a WebP con transparencia (mucho más ligero)
 *  - Elimina archivos huérfanos no usados en el código
 *
 * Uso: node scripts/compress-assets.mjs
 */

import sharp from 'sharp'
import { readdir, unlink, rename, stat } from 'fs/promises'
import { join, extname, basename } from 'path'

const ASSETS = 'src/assets'
const MAX_PHOTO_WIDTH = 1200
const JPEG_QUALITY = 82
const WEBP_QUALITY = 85

// Archivos huérfanos (no importados en ningún componente)
const ORPHANS = ['logoFV_bg.png', 'logo2.png']

// Logos PNG que se convierten a WebP (se genera el .webp, se elimina el .png)
const PNG_TO_WEBP = ['logoFV.png', 'logo-bubble_FV.png']

async function formatKB(filePath) {
  const s = await stat(filePath)
  return `${Math.round(s.size / 1024)} KB`
}

async function main() {
  const files = await readdir(ASSETS)

  // 1. Eliminar huérfanos
  for (const orphan of ORPHANS) {
    const fullPath = join(ASSETS, orphan)
    try {
      const before = await formatKB(fullPath)
      await unlink(fullPath)
      console.log(`🗑  Eliminado (huérfano): ${orphan}  [${before}]`)
    } catch {
      console.log(`⚠  No encontrado: ${orphan}`)
    }
  }

  // 2. Comprimir fotos JPG en sitio
  const photos = files.filter(f =>
    /\.(jpg|jpeg|JPG|JPEG)$/i.test(f) &&
    !PNG_TO_WEBP.includes(f)
  )

  for (const photo of photos) {
    const fullPath = join(ASSETS, photo)
    const before = await formatKB(fullPath)

    const tmp = fullPath + '.tmp.jpg'
    const meta = await sharp(fullPath).metadata()
    const resize = meta.width > MAX_PHOTO_WIDTH
      ? { width: MAX_PHOTO_WIDTH }
      : {}

    await sharp(fullPath)
      .resize(resize)
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(tmp)

    await rename(tmp, fullPath)
    const after = await formatKB(fullPath)
    console.log(`✅ ${photo.padEnd(50)} ${before.padStart(8)} → ${after.padStart(8)}`)
  }

  // 3. Convertir logos PNG → WebP
  for (const pngName of PNG_TO_WEBP) {
    const pngPath = join(ASSETS, pngName)
    const webpName = pngName.replace(/\.png$/, '.webp')
    const webpPath = join(ASSETS, webpName)

    try {
      const before = await formatKB(pngPath)
      await sharp(pngPath)
        .webp({ quality: WEBP_QUALITY, lossless: false, alphaQuality: 95 })
        .toFile(webpPath)
      const after = await formatKB(webpPath)
      await unlink(pngPath)
      console.log(`🔄 ${pngName.padEnd(50)} ${before.padStart(8)} → ${after.padStart(8)} [WebP]`)
    } catch {
      console.log(`⚠  No se pudo convertir: ${pngName}`)
    }
  }

  console.log('\nListo. Actualiza los imports:\n  logoFV.png → logoFV.webp\n  logo-bubble_FV.png → logo-bubble_FV.webp')
}

main().catch(console.error)

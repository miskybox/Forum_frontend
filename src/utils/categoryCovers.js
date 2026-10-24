import imgEuropa from '../assets/paris-moulin-europa.JPG'
import imgAmerica from '../assets/patagonia-américa.jpg'
import imgAsia from '../assets/tailandia-asia.jpg'
import imgAfrica from '../assets/egipto-áfrica.jpg'
import imgGeneral from '../assets/mapa-amstedman.jpg'
import imgAntartida from '../assets/antártida.JPG'
const imgOceania =
  'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&auto=format&fit=crop&q=80'

/**
 * Fotos originales de sigu usadas en la portada de continentes.
 * Se priorizan frente a imageUrl del API para no perder las portadas de la web.
 */
export const CATEGORY_IMAGES = {
  General: imgGeneral,
  Europa: imgEuropa,
  Asia: imgAsia,
  'América del Norte': imgAmerica,
  'América del Sur': imgAmerica,
  América: imgAmerica,
  África: imgAfrica,
  Oceanía: imgOceania,
  Antártida: imgAntartida,
}

export const CATEGORY_ALT = {
  General: 'Photo by sigu / Amsterdam, Países Bajos',
  Europa: 'Photo by sigu / París, Francia',
  Asia: 'Photo by sigu / Tailandia',
  'América del Norte': 'Photo by sigu / Patagonia, Argentina',
  'América del Sur': 'Photo by sigu / Patagonia, Argentina',
  América: 'Photo by sigu / Patagonia, Argentina',
  África: 'Photo by sigu / Egipto',
  Oceanía: 'Photo by sigu / Sídney, Australia',
  Antártida: 'Photo by sigu / Antártida',
}

export const getCategoryCover = (name) => CATEGORY_IMAGES[name] || null

export const getCategoryAlt = (name) => CATEGORY_ALT[name] || name

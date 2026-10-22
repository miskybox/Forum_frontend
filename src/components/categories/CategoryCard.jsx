import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { MdPublic } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import imgEuropa    from '../../assets/paris-moulin-europa.JPG'
import imgAmerica   from '../../assets/patagonia-américa.jpg'
import imgAsia      from '../../assets/tailandia-asia.jpg'
import imgAfrica    from '../../assets/egipto-áfrica.jpg'
import imgGeneral   from '../../assets/mapa-amstedman.jpg'
import imgAntartida from '../../assets/antártida.JPG'

// Mapa de imágenes por nombre exacto de categoría (según la DB)
const CATEGORY_IMAGES = {
  'General':           imgGeneral,
  'Europa':            imgEuropa,
  'Asia':              imgAsia,
  'América del Norte': imgAmerica,
  'América del Sur':   imgAmerica,
  'América':           imgAmerica,
  'África':            imgAfrica,
  'Oceanía':           'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?w=800&auto=format&fit=crop&q=80',
  'Antártida':         imgAntartida,
}

// Alt text descriptivo por categoría
const CATEGORY_ALT = {
  'General':           'Photo by sigu / Amsterdam, Países Bajos',
  'Europa':            'Photo by sigu / París, Francia',
  'Asia':              'Photo by sigu / Tailandia',
  'América del Norte': 'Photo by sigu / Patagonia, Argentina',
  'América del Sur':   'Photo by sigu / Patagonia, Argentina',
  'América':           'Photo by sigu / Patagonia, Argentina',
  'África':            'Photo by sigu / Egipto',
  'Oceanía':           'Photo by sigu / Sídney, Australia',
  'Antártida':         'Photo by sigu / Antártida',
}

// English translations for category names coming from DB (always Spanish)
const CATEGORY_NAMES_EN = {
  'General':           'General',
  'Europa':            'Europe',
  'Asia':              'Asia',
  'América':           'Americas',
  'América del Norte': 'North America',
  'América del Sur':   'South America',
  'África':            'Africa',
  'Oceanía':           'Oceania',
  'Antártida':         'Antarctica',
}

const CategoryCard = ({ category }) => {
  const { language, t } = useLanguage()
  const imageUrl = category.imageUrl || CATEGORY_IMAGES[category.name]
  const displayName = language === 'en'
    ? (CATEGORY_NAMES_EN[category.name] || category.name)
    : category.name

  return (
    <Link
      to={`/forums/category/${category.id}`}
      className="group block bg-surface-container-lowest rounded-lg overflow-hidden shadow-level-1 hover:shadow-level-2 transition-shadow text-on-surface hover:text-on-surface"
    >
      <div className="aspect-video relative bg-surface-container overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={CATEGORY_ALT[category.name] || category.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-secondary-fixed to-surface-container">
            <MdPublic className="text-[3rem] text-secondary/60" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent" />
        <h3 className="absolute bottom-0 left-0 right-0 px-space-md py-space-sm font-headline text-headline-sm text-on-primary truncate">
          {displayName}
        </h3>
      </div>
      <div className="p-space-md">
        <p className="text-label-md text-secondary">
          {category.forumCount || 0} {category.forumCount === 1 ? t('categories.forum') : t('categories.forums')} {t('categories.available')}
        </p>
        {category.description && (
          <p className="mt-space-xs text-body-sm text-on-surface-variant line-clamp-2 break-words">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  )
}
CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    forumCount: PropTypes.number,
    description: PropTypes.string,
  }).isRequired,
};

export default CategoryCard

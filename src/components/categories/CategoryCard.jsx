import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { MdPublic } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import { getCategoryAlt, getCategoryCover } from '../../utils/categoryCovers'

const CATEGORY_NAMES_EN = {
  General: 'General',
  Europa: 'Europe',
  Asia: 'Asia',
  América: 'Americas',
  'América del Norte': 'North America',
  'América del Sur': 'South America',
  África: 'Africa',
  Oceanía: 'Oceania',
  Antártida: 'Antarctica',
}

const CategoryCard = ({ category }) => {
  const { language, t } = useLanguage()
  const originalCover = getCategoryCover(category.name)
  const imageUrl = originalCover || category.imageUrl
  const displayName = language === 'en'
    ? (CATEGORY_NAMES_EN[category.name] || category.name)
    : category.name
  const forumCount = category.forumCount || 0
  const countLabel = `${forumCount} ${forumCount === 1 ? t('categories.forum') : t('categories.forums')} ${t('categories.available')}`

  return (
    <Link
      to={`/forums/category/${category.id}`}
      className="group block rounded-lg overflow-hidden shadow-level-1 hover:shadow-level-2 transition-shadow text-on-surface hover:text-on-surface"
    >
      <div className="aspect-video relative bg-surface-container overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={getCategoryAlt(category.name) || category.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-secondary-fixed to-surface-container">
            <MdPublic className="text-[3rem] text-secondary/60" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-transparent to-transparent" />
        <h3 className="absolute bottom-0 left-0 right-0 px-space-md py-space-sm font-headline text-headline-sm text-inverse-on-surface [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] truncate">
          {displayName}
        </h3>
        <span className="sr-only">{countLabel}</span>
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
    postCount: PropTypes.number,
    icon: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
}

export default CategoryCard

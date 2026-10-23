import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { MdForum, MdPublic } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import SectionCard from '../ui/SectionCard'

const byName = (a, b) => a.name.localeCompare(b.name, 'es')

const CategoryChannels = ({ categories }) => {
  const { t } = useLanguage()
  const general = categories.filter((c) => c.type !== 'CONTINENT').sort(byName)
  const continents = categories.filter((c) => c.type === 'CONTINENT').sort(byName)

  return (
    <>
      {general.length > 0 && (
        <SectionCard title={t('home.channels')} icon={MdForum}>
          <ul className="space-y-space-xs">
            {general.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/forums/category/${category.id}`}
                  className="flex items-center justify-between gap-space-sm px-space-sm py-space-xs rounded-base text-body-sm text-on-surface hover:text-primary hover:bg-surface-container-low transition-colors"
                >
                  <span className="flex items-center gap-space-sm min-w-0">
                    {category.icon ? (
                      <span className="text-title-md leading-none flex-shrink-0" aria-hidden="true">{category.icon}</span>
                    ) : category.imageUrl ? (
                      <img src={category.imageUrl} alt="" className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <MdForum className="text-title-md text-secondary flex-shrink-0" aria-hidden="true" />
                    )}
                    <span className="font-medium truncate">{category.name}</span>
                  </span>
                  <span className="text-caption text-on-surface-variant bg-surface-container-high px-space-xs py-0.5 rounded-full">
                    {category.postCount ?? category.forumCount ?? 0}
                    <span className="sr-only"> {t('home.postsCount')}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {continents.length > 0 && (
        <SectionCard title={t('home.byContinent')}>
          <ul className="grid grid-cols-2 gap-space-xs">
            {continents.map((continent, index) => (
              <li
                key={continent.id}
                className={continents.length % 2 === 1 && index === continents.length - 1 ? 'col-span-2' : ''}
              >
                <Link
                  to={`/forums/category/${continent.id}`}
                  className="flex items-center gap-space-xs px-space-sm py-space-xs rounded-base bg-surface-container-low hover:bg-secondary-fixed text-body-sm text-on-surface hover:text-on-surface transition-colors"
                >
                  {continent.icon ? (
                    <span className="text-body-md leading-none flex-shrink-0" aria-hidden="true">{continent.icon}</span>
                  ) : (
                    <MdPublic className="text-body-md text-secondary flex-shrink-0" aria-hidden="true" />
                  )}
                  <span className="truncate">{continent.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </>
  )
}

CategoryChannels.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      imageUrl: PropTypes.string,
      icon: PropTypes.string,
      forumCount: PropTypes.number,
      postCount: PropTypes.number,
    })
  ).isRequired,
}

export default CategoryChannels

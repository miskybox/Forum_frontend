import PropTypes from 'prop-types'
import { MdEmojiEvents, MdFavorite, MdLocationOn, MdPublic, MdStar } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import SectionCard from '../ui/SectionCard'

const TravelStats = ({ stats }) => {
  const { t } = useLanguage()

  if (!stats) return null

  const progressPercentage = Math.min(100, Math.max(0, stats.worldPercentageByCountries || 0))

  return (
    <SectionCard
      title={stats.username || t('travel.statistics')}
      action={
        stats.globalRanking ? (
          <span className="text-title-md font-bold text-primary">#{stats.globalRanking}</span>
        ) : (
          <MdEmojiEvents className="text-title-md text-primary" aria-hidden="true" />
        )
      }
    >
      {stats.travelerLevel && (
        <p className="text-body-sm text-on-surface-variant">{stats.travelerLevel}</p>
      )}

      <div className="mt-space-md">
        <div className="flex justify-between text-label-md mb-space-xs">
          <span id="travel-progress-label">{t('travel.statistics')}</span>
          <span className="font-bold text-on-surface">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="h-2 rounded-full bg-surface-container-highest overflow-hidden">
          <progress className="sr-only" value={progressPercentage} max={100} aria-labelledby="travel-progress-label">
            {progressPercentage.toFixed(1)}%
          </progress>
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${progressPercentage}%` }}
            aria-hidden="true"
          />
        </div>
        {stats.totalAreaVisitedSqKm != null && (
          <p className="mt-space-xs text-caption text-on-surface-variant">
            {stats.totalAreaVisitedSqKm.toLocaleString()} {t('travel.kmExplored')}
          </p>
        )}
      </div>

      <ul className="mt-space-md grid grid-cols-2 gap-space-sm">
        <StatCard icon={MdPublic} value={stats.countriesVisited || 0} label={t('travel.countriesVisited')} hint="/195" />
        <StatCard icon={MdLocationOn} value={stats.citiesVisited || 0} label={t('travel.cities')} />
        <StatCard icon={MdPublic} value={stats.continentsVisited || 0} label={t('travel.continents')} hint="/7" />
        <StatCard icon={MdStar} value={stats.countriesWishlist || 0} label={t('travel.inWishlist')} />
      </ul>

      {stats.continentsList?.length > 0 && (
        <div className="mt-space-md">
          <h4 className="text-label-md text-on-surface mb-space-xs">{t('footer.continents')}</h4>
          <ul className="flex flex-wrap gap-space-xs">
            {stats.continentsList.map((continent) => (
              <li key={continent} className="px-3 py-1 rounded-full bg-surface-container text-label-md text-on-surface">
                {continent}
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.badges?.length > 0 && (
        <div className="mt-space-md">
          <h4 className="text-label-md text-on-surface mb-space-xs">{t('travel.achievementsUnlocked')}</h4>
          <ul className="flex flex-wrap gap-space-xs">
            {stats.badges.slice(0, 6).map((badge) => (
              <li key={badge} className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-label-md" title={badge}>
                {badge}
              </li>
            ))}
            {stats.badges.length > 6 && (
              <li className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-md">
                +{stats.badges.length - 6} {t('travel.more')}
              </li>
            )}
          </ul>
        </div>
      )}

      {stats.favoritePlace && (
        <p className="mt-space-md pt-space-md border-t border-outline-variant/40 text-body-sm text-on-surface-variant flex items-center gap-space-xs">
          <MdFavorite className="text-primary" aria-hidden="true" />
          {t('travel.favoritePlace')}: <strong className="text-on-surface">{stats.favoritePlace}</strong>
        </p>
      )}
    </SectionCard>
  )
}

const StatCard = ({ icon: Icon, value, label, hint }) => (
  <li className="bg-surface-container-low rounded-lg p-space-sm text-center">
    {Icon && <Icon className="mx-auto text-title-md text-secondary" aria-hidden="true" />}
    <p className="mt-1 font-headline text-headline-sm text-on-surface">
      {value}
      {hint && <span className="text-caption font-normal text-on-surface-variant">{hint}</span>}
    </p>
    <p className="text-caption text-on-surface-variant truncate">{label}</p>
  </li>
)

StatCard.propTypes = {
  icon: PropTypes.elementType,
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
}

TravelStats.propTypes = {
  stats: PropTypes.shape({
    username: PropTypes.string,
    travelerLevel: PropTypes.string,
    globalRanking: PropTypes.number,
    worldPercentageByCountries: PropTypes.number,
    totalAreaVisitedSqKm: PropTypes.number,
    countriesVisited: PropTypes.number,
    citiesVisited: PropTypes.number,
    continentsVisited: PropTypes.number,
    countriesWishlist: PropTypes.number,
    continentsList: PropTypes.arrayOf(PropTypes.string),
    badges: PropTypes.arrayOf(PropTypes.string),
    favoritePlace: PropTypes.string,
  }),
}

export default TravelStats

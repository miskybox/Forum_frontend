import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { MdMap, MdMilitaryTech, MdVerified } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import SectionCard from '../ui/SectionCard'
import WorldMap from '../travel/WorldMap'

const BADGE_TONES = [
  'bg-secondary text-on-secondary',
  'bg-primary text-on-primary',
  'bg-tertiary-container text-on-tertiary-container',
  'bg-primary-container text-on-primary-container',
]

const TravelPassport = ({ stats, visitedPlaces = [], isOwnProfile }) => {
  const { t } = useLanguage()
  const hasStats = stats && (stats.countriesVisited > 0 || stats.badges?.length > 0)
  const worldPercent = Math.min(100, Math.round((stats?.worldPercentageByCountries ?? 0) * 10) / 10)

  return (
    <>
      <SectionCard
        title={t('profile.passportTitle')}
        action={
          stats?.travelerLevel ? (
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-caption font-bold">
              {t('profile.level')}: {stats.travelerLevel}
            </span>
          ) : (
            <MdMilitaryTech className="text-title-md text-primary" aria-hidden="true" />
          )
        }
      >
        {hasStats ? (
          <>
            {stats.badges?.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                {stats.badges.map((badge, index) => (
                  <li key={badge} className="bg-surface-container-low p-space-sm rounded-md flex items-center gap-3">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${BADGE_TONES[index % BADGE_TONES.length]}`}>
                      <MdVerified aria-hidden="true" />
                    </span>
                    <span className="text-label-md text-on-surface">{badge}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-space-md p-space-sm bg-surface-container rounded-base">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface font-medium">
                  {stats.continentsVisited ?? 0} {t('profile.continents')}
                </span>
                <span className="text-primary font-bold">
                  {worldPercent}% {t('profile.worldExplored')}
                </span>
              </div>
              <div className="mt-space-xs h-2 rounded-full bg-surface-container-highest overflow-hidden" aria-hidden="true">
                <div className="h-full rounded-full bg-primary" style={{ width: `${worldPercent}%` }} />
              </div>
            </div>
          </>
        ) : (
          <p className="text-body-sm text-on-surface-variant">{t('profile.noTravelStats')}</p>
        )}
      </SectionCard>

      <SectionCard title={t('profile.territoryTitle')} icon={MdMap}>
        <p className="text-body-sm text-on-surface-variant">
          <strong className="text-on-surface">{stats?.countriesVisited ?? 0}</strong> {t('profile.countriesVisited')}
          {stats?.countriesWishlist > 0 && (
            <> · <strong className="text-on-surface">{stats.countriesWishlist}</strong> {t('profile.wishlist')}</>
          )}
        </p>
        {visitedPlaces.length > 0 && (
          <div className="mt-space-sm rounded-base overflow-hidden">
            <WorldMap visitedPlaces={visitedPlaces} compact />
          </div>
        )}
        {stats?.continentsList?.length > 0 && (
          <ul className="flex flex-wrap gap-space-xs mt-space-sm">
            {stats.continentsList.map((continent, index) => (
              <li key={continent} className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-label-md">
                <span className={`w-2 h-2 rounded-full ${['bg-secondary', 'bg-primary', 'bg-tertiary'][index % 3]}`} aria-hidden="true" />
                {continent}
              </li>
            ))}
          </ul>
        )}
        {isOwnProfile && (
          <Link
            to="/travel"
            className="mt-space-md w-full py-2 px-4 rounded-base bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-on-surface text-label-md flex items-center justify-center gap-1"
          >
            <MdMap aria-hidden="true" />
            {t('profile.openMap')}
          </Link>
        )}
      </SectionCard>
    </>
  )
}

TravelPassport.propTypes = {
  stats: PropTypes.shape({
    travelerLevel: PropTypes.string,
    badges: PropTypes.arrayOf(PropTypes.string),
    countriesVisited: PropTypes.number,
    countriesWishlist: PropTypes.number,
    continentsVisited: PropTypes.number,
    continentsList: PropTypes.arrayOf(PropTypes.string),
    worldPercentageByCountries: PropTypes.number,
  }),
  visitedPlaces: PropTypes.array,
  isOwnProfile: PropTypes.bool,
}

export default TravelPassport

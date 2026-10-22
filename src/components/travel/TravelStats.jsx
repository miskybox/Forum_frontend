import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * TravelStats - Paleta única #A0937D #E7D4B5 #F6E6CB #B6C7AA
 */
const TravelStats = ({ stats }) => {
  const { t } = useLanguage()

  if (!stats) return null

  const progressPercentage = stats.worldPercentageByCountries || 0

  return (
    <div className="bg-gradient-to-br from-surface-container-low to-secondary-fixed rounded-2xl p-5 text-on-surface shadow-level-2 border-2 border-outline-variant overflow-hidden">
      {/* Header con nivel */}
      <div className="flex items-center justify-between mb-5 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-on-surface truncate">{stats.username}</h3>
          <p className="text-on-surface-variant font-semibold text-sm truncate">{stats.travelerLevel}</p>
        </div>
        {stats.globalRanking && (
          <div className="text-right">
            <span className="text-2xl md:text-4xl font-bold text-primary">#{stats.globalRanking}</span>
            <p className="text-on-surface-variant text-sm font-semibold">{t('trivia.globalRanking')}</p>
          </div>
        )}
      </div>

      {/* Barra de progreso del mundo */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 font-semibold">
          <span className="text-on-surface" id="progress-label">{t('travel.statistics')}</span>
          <span className="font-bold text-on-surface">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="h-4 bg-surface-container-highest rounded-full overflow-hidden">
          <progress
            className="sr-only"
            value={progressPercentage}
            max={100}
            aria-labelledby="progress-label"
          >
            {progressPercentage.toFixed(1)}%
          </progress>
          <div
            className="h-full bg-gradient-to-r from-primary to-on-primary-fixed-variant rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(progressPercentage * 2, 100)}%` }}
            aria-hidden="true"
          />
        </div>
        <p className="text-on-surface-variant text-xs mt-1 font-semibold">
          {stats.totalAreaVisitedSqKm?.toLocaleString()} {t('travel.kmExplored')}
        </p>
      </div>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard
          icon={null}
          value={stats.countriesVisited || 0}
          label={t('travel.countriesVisited')}
          subLabel="/195"
          bgColor="bg-primary-fixed/20"
        />
        <StatCard
          icon={null}
          value={stats.citiesVisited || 0}
          label={t('travel.cities')}
          bgColor="bg-secondary-container/30"
        />
        <StatCard
          icon={null}
          value={stats.continentsVisited || 0}
          label={t('travel.continents')}
          subLabel="/7"
          bgColor="bg-inverse-surface/20"
        />
        <StatCard
          icon={null}
          value={stats.countriesWishlist || 0}
          label={t('travel.inWishlist')}
          bgColor="bg-primary-fixed/20"
        />
      </div>

      {/* Continentes visitados */}
      {stats.continentsList && stats.continentsList.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-on-surface mb-2">{t('footer.continents')}</h4>
          <div className="flex flex-wrap gap-2">
            {stats.continentsList.map(continent => (
              <span
                key={continent}
                className="px-3 py-1 bg-primary-fixed/30 rounded-full text-sm text-on-surface font-medium border border-primary-fixed-dim"
              >
                {continent}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {stats.badges && stats.badges.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-on-surface mb-2">{t('travel.achievementsUnlocked')}</h4>
          <div className="flex flex-wrap gap-2">
            {stats.badges.slice(0, 6).map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 bg-primary-container border border-outline-variant rounded-full text-sm text-on-surface font-semibold"
                title={badge}
              >
                {badge}
              </span>
            ))}
            {stats.badges.length > 6 && (
              <span className="px-3 py-1 bg-secondary rounded-full text-sm text-on-surface font-medium">
                +{stats.badges.length - 6} {t('travel.more')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Lugar favorito */}
      {stats.favoritePlace && (
        <div className="mt-4 pt-4 border-t border-outline-variant flex items-center gap-2">
          <span className="text-on-surface-variant text-sm font-semibold">{t('travel.favoritePlace')}</span>
          <span className="font-bold text-primary">{stats.favoritePlace}</span>
        </div>
      )}
    </div>
  )
}

/**
 * Tarjeta individual de estadística
 */
const StatCard = ({ icon, value, label, subLabel, bgColor = 'bg-surface-container-lowest' }) => (
  <div className={`${bgColor} rounded-lg p-3 text-center backdrop-blur-sm border border-outline-variant overflow-hidden`}>
    {icon && <span className="text-xl" aria-hidden="true">{icon}</span>}
    <div className="text-xl font-bold mt-1 text-on-surface">
      {value}
      {subLabel && <span className="text-xs font-normal text-on-surface-variant">{subLabel}</span>}
    </div>
    <p className="text-on-surface-variant text-xs font-semibold truncate">{label}</p>
  </div>
)

StatCard.propTypes = {
  icon: PropTypes.string,
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  subLabel: PropTypes.string,
  bgColor: PropTypes.string
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
    favoritePlace: PropTypes.string
  })
}

export default TravelStats

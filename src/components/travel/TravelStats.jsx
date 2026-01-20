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
    <div className="bg-gradient-to-br from-primary-dark to-secondary-light rounded-2xl p-5 text-text shadow-xl border-2 border-accent overflow-hidden">
      {/* Header con nivel */}
      <div className="flex items-center justify-between mb-5 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-bold text-text truncate">{stats.username}</h3>
          <p className="text-text-light font-semibold text-sm truncate">{stats.travelerLevel}</p>
        </div>
        {stats.globalRanking && (
          <div className="text-right">
            <span className="text-4xl font-bold text-accent">#{stats.globalRanking}</span>
            <p className="text-text-light text-sm font-semibold">{t('trivia.globalRanking')}</p>
          </div>
        )}
      </div>

      {/* Barra de progreso del mundo */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 font-semibold">
          <span className="text-text" id="progress-label">{t('travel.statistics')}</span>
          <span className="font-bold text-text">{progressPercentage.toFixed(1)}%</span>
        </div>
        <div className="h-4 bg-primary rounded-full overflow-hidden">
          <progress
            className="sr-only"
            value={progressPercentage}
            max={100}
            aria-labelledby="progress-label"
          >
            {progressPercentage.toFixed(1)}%
          </progress>
          <div
            className="h-full bg-gradient-to-r from-accent to-accent-dark rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(progressPercentage * 2, 100)}%` }}
            aria-hidden="true"
          />
        </div>
        <p className="text-text-light text-xs mt-1 font-semibold">
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
          bgColor="bg-golden/20"
        />
        <StatCard
          icon={null}
          value={stats.citiesVisited || 0}
          label={t('travel.cities')}
          bgColor="bg-aqua/30"
        />
        <StatCard
          icon={null}
          value={stats.continentsVisited || 0}
          label={t('travel.continents')}
          subLabel="/7"
          bgColor="bg-midnight/20"
        />
        <StatCard
          icon={null}
          value={stats.countriesWishlist || 0}
          label={t('travel.inWishlist')}
          bgColor="bg-golden/20"
        />
      </div>

      {/* Continentes visitados */}
      {stats.continentsList && stats.continentsList.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-text mb-2">{t('footer.continents')}</h4>
          <div className="flex flex-wrap gap-2">
            {stats.continentsList.map(continent => (
              <span
                key={continent}
                className="px-3 py-1 bg-golden/30 rounded-full text-sm text-text font-medium border border-golden"
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
          <h4 className="text-sm font-bold text-text mb-2">{t('travel.achievementsUnlocked')}</h4>
          <div className="flex flex-wrap gap-2">
            {stats.badges.slice(0, 6).map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 bg-accent-light border border-accent rounded-full text-sm text-text font-semibold"
                title={badge}
              >
                {badge}
              </span>
            ))}
            {stats.badges.length > 6 && (
              <span className="px-3 py-1 bg-secondary rounded-full text-sm text-text font-medium">
                +{stats.badges.length - 6} {t('travel.more')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Lugar favorito */}
      {stats.favoritePlace && (
        <div className="mt-4 pt-4 border-t border-accent flex items-center gap-2">
          <span className="text-text-light text-sm font-semibold">{t('travel.favoritePlace')}</span>
          <span className="font-bold text-accent">{stats.favoritePlace}</span>
        </div>
      )}
    </div>
  )
}

/**
 * Tarjeta individual de estadística
 */
const StatCard = ({ icon, value, label, subLabel, bgColor = 'bg-primary-light' }) => (
  <div className={`${bgColor} rounded-xl p-3 text-center backdrop-blur-sm border border-accent overflow-hidden`}>
    {icon && <span className="text-xl" aria-hidden="true">{icon}</span>}
    <div className="text-xl font-bold mt-1 text-text">
      {value}
      {subLabel && <span className="text-xs font-normal text-text-light">{subLabel}</span>}
    </div>
    <p className="text-text-light text-xs font-semibold truncate">{label}</p>
  </div>
)

StatCard.propTypes = {
  icon: PropTypes.string,
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  subLabel: PropTypes.string,
  bgColor: PropTypes.string
}

/**
 * Obtiene abreviatura según continente
 */
const getContinentLabel = (continent) => {
  const labels = {
    'Europa': 'EU',
    'América': 'AM',
    'Asia': 'AS',
    'África': 'AF',
    'Oceanía': 'OC',
    'Antártida': 'AN'
  }
  return labels[continent] || continent.slice(0, 2).toUpperCase()
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

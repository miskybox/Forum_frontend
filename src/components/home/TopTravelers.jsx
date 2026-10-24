import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { MdMilitaryTech } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import SectionCard from '../ui/SectionCard'
import Avatar from '../ui/Avatar'

const TONES = ['secondary', 'primary', 'tertiary']

const TopTravelers = ({ travelers }) => {
  const { t } = useLanguage()

  return (
    <SectionCard title={t('home.topTravelers')} icon={MdMilitaryTech} tone="sage">
      {travelers.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant">{t('home.noRanking')}</p>
      ) : (
        <ol className="space-y-space-sm">
          {travelers.map((traveler, index) => (
            <li key={traveler.userId} className="flex items-center justify-between gap-space-sm">
              <Link to={`/profile/${traveler.userId}`} className="flex items-center gap-space-sm min-w-0 group">
                <Avatar name={traveler.username} tone={TONES[index % TONES.length]} />
                <span className="min-w-0">
                  <span className="block text-body-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                    @{traveler.username}
                  </span>
                  {traveler.travelerLevel && (
                    <span className="block text-caption text-secondary font-semibold">{traveler.travelerLevel}</span>
                  )}
                </span>
              </Link>
              <span className="text-caption text-on-surface-variant font-bold whitespace-nowrap">
                {traveler.countriesVisited ?? 0} {t('home.countriesShort')}
              </span>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  )
}

TopTravelers.propTypes = {
  travelers: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      username: PropTypes.string.isRequired,
      countriesVisited: PropTypes.number,
      travelerLevel: PropTypes.string,
    })
  ).isRequired,
}

export default TopTravelers

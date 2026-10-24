import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { MdEmojiEvents } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import SectionCard from '../ui/SectionCard'
import Avatar from '../ui/Avatar'

const TONES = ['secondary', 'primary', 'tertiary']

const roleLabel = (role, t) => {
  if (role === 'ADMIN') return t('demo.roleAdmin')
  if (role === 'MODERATOR') return t('demo.roleMod')
  return t('demo.roleUser')
}

const TopContributors = ({ contributors }) => {
  const { t } = useLanguage()

  return (
    <SectionCard title={t('home.topContributors')} icon={MdEmojiEvents} tone="clay">
      {contributors.length === 0 ? (
        <p className="text-body-sm text-on-surface-variant">{t('home.noContributors')}</p>
      ) : (
        <ol className="space-y-space-sm">
          {contributors.map((person, index) => (
            <li key={person.userId} className="flex items-center justify-between gap-space-sm">
              <Link to={`/profile/${person.userId}`} className="flex items-center gap-space-sm min-w-0 group">
                <Avatar name={person.username} src={person.avatarUrl} tone={TONES[index % TONES.length]} />
                <span className="min-w-0">
                  <span className="block text-body-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                    @{person.username}
                  </span>
                  <span className="block text-caption text-secondary font-semibold">
                    {roleLabel(person.role, t)}
                  </span>
                </span>
              </Link>
              <span className="text-caption text-on-surface-variant font-bold whitespace-nowrap">
                {person.points ?? 0} {t('home.pointsShort')}
              </span>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  )
}

TopContributors.propTypes = {
  contributors: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      username: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string,
      role: PropTypes.string,
      points: PropTypes.number,
    })
  ).isRequired,
}

export default TopContributors

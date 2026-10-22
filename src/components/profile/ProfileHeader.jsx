import PropTypes from 'prop-types'
import { MdChatBubbleOutline, MdEdit, MdForum, MdLocationOn, MdPublic, MdTravelExplore } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import Avatar from '../ui/Avatar'
import FollowButton from '../common/FollowButton'
import defaultCover from '../../assets/whale-patagonia-argentina-by_sigu.jpg'

const formatMemberSince = (dateString) => {
  if (!dateString) return null
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

const Metric = ({ icon, value, label, tone }) => {
  const Icon = icon
  return (
    <div className="flex items-center gap-3">
      <span className={`w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm ${tone}`}>
        <Icon className="text-title-md" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-headline-sm text-on-surface leading-tight">{value}</span>
        <span className="text-caption text-on-surface-variant uppercase tracking-wider">{label}</span>
      </span>
    </div>
  )
}

Metric.propTypes = {
  icon: PropTypes.elementType.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  tone: PropTypes.string,
}

const ProfileHeader = ({ user, travelStats, isOwnProfile, isFollowing, onFollowChange, onEdit }) => {
  const { t } = useLanguage()
  const displayName = user.fullName || user.username
  const memberSince = formatMemberSince(user.createdAt)

  return (
    <>
      {/* Cover */}
      <div className="relative w-full h-56 sm:h-72 lg:h-80 bg-surface-container-high overflow-hidden">
        <img src={user.coverImageUrl || defaultCover} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-surface-container-highest/20 to-transparent" />
      </div>

      {/* Identity card */}
      <div className="max-w-7xl mx-auto w-full px-gutter-sm lg:px-gutter-lg -mt-20 lg:-mt-24 relative z-10">
        <section className="bg-surface-container-lowest rounded-lg shadow-level-3 p-space-md lg:p-space-lg" aria-labelledby="profile-name">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-space-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-space-md lg:gap-space-lg w-full lg:w-auto">
              <div className="-mt-16 sm:-mt-20 rounded-full ring-4 ring-surface-container-lowest shadow-level-2">
                <Avatar name={user.username} src={user.profileImageUrl} size="xl" tone="secondary" />
              </div>
              <div className="min-w-0">
                <h1 id="profile-name" className="font-headline text-headline-md text-on-surface">{displayName}</h1>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-caption text-on-surface-variant">
                  <span className="text-label-lg text-primary">@{user.username}</span>
                  {memberSince && <span>{t('profile.memberSince')} {memberSince}</span>}
                  {user.location && (
                    <span className="flex items-center gap-0.5">
                      <MdLocationOn aria-hidden="true" /> {user.location}
                    </span>
                  )}
                </p>
                {user.biography && (
                  <p className="mt-space-sm text-body-md text-on-surface-variant max-w-2xl whitespace-pre-line">{user.biography}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-space-xs w-full lg:w-auto justify-end">
              {isOwnProfile ? (
                <button type="button" onClick={onEdit} className="btn btn-outline">
                  <MdEdit aria-hidden="true" />
                  {t('profile.editProfile')}
                </button>
              ) : (
                <FollowButton userId={user.id} isFollowing={isFollowing} onChange={onFollowChange} />
              )}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mt-space-lg bg-surface-container-low rounded-lg p-space-md">
            <Metric icon={MdChatBubbleOutline} value={user.postCount ?? 0} label={t('profile.statPosts')} tone="text-primary" />
            <Metric icon={MdForum} value={user.forumCount ?? 0} label={t('profile.statForums')} tone="text-secondary" />
            <Metric icon={MdPublic} value={user.commentCount ?? 0} label={t('profile.statComments')} tone="text-primary" />
            <Metric icon={MdTravelExplore} value={travelStats?.countriesVisited ?? 0} label={t('profile.statCountries')} tone="text-tertiary" />
          </div>
        </section>
      </div>
    </>
  )
}

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    username: PropTypes.string,
    fullName: PropTypes.string,
    biography: PropTypes.string,
    location: PropTypes.string,
    profileImageUrl: PropTypes.string,
    coverImageUrl: PropTypes.string,
    createdAt: PropTypes.string,
    postCount: PropTypes.number,
    forumCount: PropTypes.number,
    commentCount: PropTypes.number,
  }).isRequired,
  travelStats: PropTypes.shape({ countriesVisited: PropTypes.number }),
  isOwnProfile: PropTypes.bool,
  isFollowing: PropTypes.bool,
  onFollowChange: PropTypes.func,
  onEdit: PropTypes.func,
}

export default ProfileHeader

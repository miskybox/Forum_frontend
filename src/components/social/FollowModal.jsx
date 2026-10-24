import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { MdPeople } from 'react-icons/md'
import { useLanguage } from '../../contexts/LanguageContext'
import Modal from '../ui/Modal'
import SegmentedTabs from '../ui/SegmentedTabs'
import FollowList from './FollowList'

const FollowModal = ({ userId, isOpen, onClose, initialTab = 'followers', stats }) => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState(initialTab)

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab)
  }, [initialTab, isOpen])

  if (!isOpen) return null

  const tabs = [
    {
      id: 'followers',
      label: stats?.followersCount
        ? `${t('users.followers')} (${stats.followersCount})`
        : t('users.followers'),
      icon: MdPeople,
    },
    {
      id: 'following',
      label: stats?.followingCount
        ? `${t('users.following')} (${stats.followingCount})`
        : t('users.following'),
      icon: MdPeople,
    },
  ]

  return (
    <Modal
      title={activeTab === 'followers' ? t('users.followers') : t('users.following')}
      onClose={onClose}
      size="md"
    >
      <div className="mt-space-md space-y-space-md">
        <SegmentedTabs
          tabs={tabs}
          activeId={activeTab}
          onChange={setActiveTab}
          idPrefix="follow"
          label={t('users.socialLists')}
        />
        <div role="tabpanel" id={`follow-panel-${activeTab}`} aria-labelledby={`follow-tab-${activeTab}`}>
          <FollowList userId={userId} type={activeTab} onClose={onClose} />
        </div>
      </div>
    </Modal>
  )
}

FollowModal.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  initialTab: PropTypes.oneOf(['followers', 'following']),
  stats: PropTypes.shape({
    followersCount: PropTypes.number,
    followingCount: PropTypes.number,
  }),
}

export default FollowModal

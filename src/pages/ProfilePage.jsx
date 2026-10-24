import { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { MdChatBubbleOutline, MdEdit, MdForum, MdLock, MdLockOutline, MdMail } from 'react-icons/md'
import useAuth from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import userService from '../services/userService'
import followService from '../services/followService'
import travelService from '../services/travelService'
import postService from '../services/postService'
import forumService from '../services/forumService'
import ProfileHeader from '../components/profile/ProfileHeader'
import TravelPassport from '../components/profile/TravelPassport'
import ProfileEditForm from '../components/profile/ProfileEditForm'
import PasswordForm from '../components/profile/PasswordForm'
import PostList from '../components/post/PostList'
import ForumCard from '../components/forums/ForumCard'
import SegmentedTabs from '../components/ui/SegmentedTabs'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SendPrivateMessageForm from '../components/common/SendPrivateMessageForm'
import PrivateMessagesInbox from '../components/common/PrivateMessagesInbox'

const toList = (response) => (Array.isArray(response) ? response : response?.content || [])

const ProfilePage = () => {
  const { userId } = useParams()
  const { currentUser, isAuthenticated, refreshUser } = useAuth()
  const { t } = useLanguage()

  const isOwnProfile = !userId || (currentUser && userId === String(currentUser.id))
  const profileId = isOwnProfile ? currentUser?.id : userId

  const [user, setUser] = useState(null)
  const [travelStats, setTravelStats] = useState(null)
  const [visitedPlaces, setVisitedPlaces] = useState([])
  const [posts, setPosts] = useState([])
  const [forums, setForums] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async () => {
    if (!profileId) return
    setLoading(true)
    try {
      const response = await userService.getUserById(profileId)
      setUser(response?.data || response)
    } catch (error) {
      console.error('Error loading profile:', error)
      if (isOwnProfile && currentUser) {
        setUser(currentUser)
      } else {
        toast.error(t('profile.loadError') || 'Error al cargar el perfil')
      }
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId, isOwnProfile])

  useEffect(() => {
    if (!isAuthenticated || !profileId) {
      setLoading(false)
      return
    }
    setActiveTab('posts')
    loadProfile()

    let cancelled = false
    const loadExtras = async () => {
      const [statsResult, postsResult, forumsResult, followResult, placesResult] = await Promise.allSettled([
        isOwnProfile ? travelService.getMyStats() : travelService.getUserStats(profileId),
        postService.getPostsByUser(profileId, 0, 20),
        forumService.getForumsByUser(profileId, 0, 20),
        isOwnProfile ? Promise.resolve(false) : followService.isFollowing(profileId),
        isOwnProfile ? travelService.getMyPlaces() : travelService.getUserPlaces(profileId),
      ])
      if (cancelled) return

      setTravelStats(statsResult.status === 'fulfilled' ? statsResult.value : null)
      setVisitedPlaces(placesResult.status === 'fulfilled' ? toList(placesResult.value) : [])
      setPosts(postsResult.status === 'fulfilled' ? toList(postsResult.value) : [])
      setForums(forumsResult.status === 'fulfilled' ? toList(forumsResult.value) : [])
      const follow = followResult.status === 'fulfilled' ? followResult.value : false
      setIsFollowing(follow === true || follow?.following === true)
    }
    loadExtras()

    return () => {
      cancelled = true
    }
  }, [isAuthenticated, profileId, isOwnProfile, loadProfile])

  const handleProfileSaved = async () => {
    await loadProfile()
    try {
      await refreshUser?.()
    } catch {
      // The profile page already shows the new data
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-gutter-sm py-margin-lg">
        <EmptyState
          icon={MdLock}
          title={t('profile.mustLogin')}
          action={<Link to="/login" className="btn btn-primary">{t('auth.loginButton')}</Link>}
        />
      </div>
    )
  }

  if (loading || !user) {
    return <LoadingSpinner />
  }

  const tabs = isOwnProfile
    ? [
        { id: 'posts', label: t('profile.tabs.posts'), icon: MdChatBubbleOutline },
        { id: 'forums', label: t('profile.tabs.forums'), icon: MdForum },
        { id: 'edit', label: t('profile.tabs.edit'), icon: MdEdit },
        { id: 'password', label: t('profile.tabs.password'), icon: MdLockOutline },
        { id: 'messages', label: t('profile.tabs.messages'), icon: MdMail },
      ]
    : [
        { id: 'posts', label: t('profile.tabs.posts'), icon: MdChatBubbleOutline },
        { id: 'forums', label: t('profile.tabs.forums'), icon: MdForum },
        { id: 'messages', label: t('profile.sendMessage'), icon: MdMail },
      ]

  const panelProps = (id) => ({
    role: 'tabpanel',
    id: `profile-panel-${id}`,
    'aria-labelledby': `profile-tab-${id}`,
  })

  return (
    <div className="flex flex-col w-full">
      <ProfileHeader
        user={user}
        travelStats={travelStats}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onFollowChange={setIsFollowing}
        onEdit={() => setActiveTab('edit')}
      />

      <div className="max-w-7xl mx-auto w-full px-gutter-sm lg:px-gutter-lg mt-space-lg grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        <aside className="lg:col-span-5 space-y-space-md">
          <TravelPassport stats={travelStats} visitedPlaces={visitedPlaces} isOwnProfile={isOwnProfile} />
        </aside>

        <section className="lg:col-span-7 space-y-space-md">
          <SegmentedTabs
            tabs={tabs}
            activeId={activeTab}
            onChange={setActiveTab}
            idPrefix="profile"
            label={t('profile.tabsLabel')}
            className="rounded-lg"
          />

          {activeTab === 'posts' && (
            <div {...panelProps('posts')}>
              {posts.length > 0 ? (
                <PostList posts={posts} />
              ) : (
                <EmptyState
                  icon={MdChatBubbleOutline}
                  title={isOwnProfile ? t('profile.noPosts') : t('profile.noPostsOther')}
                  action={isOwnProfile && <Link to="/forums" className="btn btn-primary">{t('home.exploreForum')}</Link>}
                />
              )}
            </div>
          )}

          {activeTab === 'forums' && (
            <div {...panelProps('forums')}>
              {forums.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-lg">
                  {forums.map((forum) => <ForumCard key={forum.id} forum={forum} />)}
                </div>
              ) : (
                <EmptyState
                  icon={MdForum}
                  title={isOwnProfile ? t('profile.noForums') : t('profile.noForumsOther')}
                  action={isOwnProfile && <Link to="/forums/create" className="btn btn-primary">{t('profile.createForum')}</Link>}
                />
              )}
            </div>
          )}

          {activeTab === 'edit' && isOwnProfile && (
            <div {...panelProps('edit')}>
              <ProfileEditForm user={user} onSaved={handleProfileSaved} />
            </div>
          )}

          {activeTab === 'password' && isOwnProfile && (
            <div {...panelProps('password')}>
              <PasswordForm userId={user.id} />
            </div>
          )}

          {activeTab === 'messages' && (
            <div {...panelProps('messages')} className="bg-surface-container-lowest rounded-lg p-space-md sm:p-space-lg shadow-level-1">
              {isOwnProfile ? <PrivateMessagesInbox /> : <SendPrivateMessageForm toId={user.id} />}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default ProfilePage

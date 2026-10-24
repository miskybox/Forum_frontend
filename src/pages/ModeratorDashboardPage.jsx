import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdDashboard, MdPeople, MdForum, MdArticle, MdComment, MdVisibilityOff } from 'react-icons/md'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import userService from '../services/userService'
import forumService from '../services/forumService'
import postService from '../services/postService'
import commentService from '../services/commentService'
import PageContainer from '../components/ui/PageContainer'
import SegmentedTabs from '../components/ui/SegmentedTabs'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/common/LoadingSpinner'
import DashboardStatCard from '../components/dashboard/DashboardStatCard'
import DashboardTable from '../components/dashboard/DashboardTable'
import ConfirmDialog from '../components/dashboard/ConfirmDialog'
import StatusChip from '../components/dashboard/StatusChip'

const authorOf = (item) => item?.creatorUsername || item?.username || item?.authorUsername || '—'

const ModeratorDashboardPage = () => {
  const { user: currentUser } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalForums: 0,
    totalPosts: 0,
    totalComments: 0,
    hiddenContent: 0,
  })
  const [users, setUsers] = useState([])
  const [forums, setForums] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const [usersData, forumsData, postsData, commentsData] = await Promise.all([
        userService.getAllUsers(0, 100),
        forumService.getAllForums(0, 100),
        postService.getAllPosts(0, 100),
        commentService.getAllComments(),
      ])

      const usersList = usersData.content || usersData || []
      const forumsList = forumsData.content || forumsData || []
      const postsList = postsData.content || postsData || []
      const commentsList = commentsData.content || commentsData || []

      setUsers(usersList)
      setForums(forumsList)
      setComments(commentsList)

      setStats({
        totalUsers: usersList.length,
        totalForums: forumsList.length,
        totalPosts: postsList.length,
        totalComments: commentsList.length,
        hiddenContent: forumsList.filter((f) => f.status === 'HIDDEN').length
          + commentsList.filter((c) => c.status === 'HIDDEN').length,
      })
    } catch (err) {
      setError(err.message || t('admin.loadError'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  const ask = (opts) => setConfirm(opts)
  const closeConfirm = () => setConfirm(null)

  const handleHideForum = (forumId) => ask({
    title: t('admin.hide'),
    message: t('admin.confirmHideForum'),
    danger: true,
    onConfirm: async () => {
      closeConfirm()
      await forumService.hideForum(forumId)
      loadDashboardData()
    },
  })

  const handleShowForum = (forumId) => ask({
    title: t('admin.show'),
    message: t('admin.confirmShowForum'),
    onConfirm: async () => {
      closeConfirm()
      await forumService.showForum(forumId)
      loadDashboardData()
    },
  })

  const handleHideComment = (commentId) => ask({
    title: t('admin.hide'),
    message: t('admin.confirmHideComment'),
    danger: true,
    onConfirm: async () => {
      closeConfirm()
      await commentService.hideComment(commentId)
      loadDashboardData()
    },
  })

  const handleShowComment = (commentId) => ask({
    title: t('admin.show'),
    message: t('admin.confirmShowComment'),
    onConfirm: async () => {
      closeConfirm()
      await commentService.showComment(commentId)
      loadDashboardData()
    },
  })

  const handleBlockUser = (userId) => ask({
    title: t('admin.block'),
    message: t('admin.confirmBlock'),
    danger: true,
    onConfirm: async () => {
      closeConfirm()
      await userService.blockUser(userId)
      loadDashboardData()
    },
  })

  const handleUnblockUser = (userId) => ask({
    title: t('admin.unblock'),
    message: t('admin.confirmUnblock'),
    onConfirm: async () => {
      closeConfirm()
      await userService.unblockUser(userId)
      loadDashboardData()
    },
  })

  if (loading) {
    return (
      <PageContainer className="py-margin">
        <LoadingSpinner label={t('common.loading')} />
      </PageContainer>
    )
  }

  const tabs = [
    { id: 'overview', label: t('admin.overview'), icon: MdDashboard },
    { id: 'forums', label: t('admin.forums'), icon: MdForum },
    { id: 'comments', label: t('admin.comments'), icon: MdComment },
    { id: 'users', label: t('admin.users'), icon: MdPeople },
  ]

  return (
    <PageContainer className="py-margin space-y-space-lg">
      <header>
        <h1 className="font-headline text-headline-lg text-on-surface">{t('admin.moderatorPanel')}</h1>
        <p className="mt-space-xs text-body-md text-on-surface-variant">
          {t('admin.welcome')}, @{currentUser?.username}
        </p>
        <p className="text-body-sm text-on-surface-variant">{t('admin.permissionsMod')}</p>
      </header>

      {error && (
        <p role="alert" className="text-body-md text-error">{error}</p>
      )}

      <SegmentedTabs
        tabs={tabs}
        activeId={activeTab}
        onChange={setActiveTab}
        idPrefix="moderator"
        label={t('admin.moderatorPanel')}
      />

      {activeTab === 'overview' && (
        <div
          role="tabpanel"
          id="moderator-panel-overview"
          aria-labelledby="moderator-tab-overview"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md"
        >
          <DashboardStatCard title={t('admin.users')} value={stats.totalUsers} icon={MdPeople} />
          <DashboardStatCard title={t('admin.forums')} value={stats.totalForums} icon={MdForum} />
          <DashboardStatCard title={t('admin.posts')} value={stats.totalPosts} icon={MdArticle} />
          <DashboardStatCard title={t('admin.comments')} value={stats.totalComments} icon={MdComment} />
          <DashboardStatCard title={t('admin.hiddenContent')} value={stats.hiddenContent} icon={MdVisibilityOff} />
        </div>
      )}

      {activeTab === 'forums' && (
        <section
          role="tabpanel"
          id="moderator-panel-forums"
          aria-labelledby="moderator-tab-forums"
          className="space-y-space-sm"
        >
          <h2 className="font-headline text-title-lg text-on-surface">
            {t('admin.manageForums')} ({forums.length})
          </h2>
          <p className="text-body-sm text-on-surface-variant">{t('admin.modForumsHint')}</p>
          <DashboardTable
            emptyIcon={MdForum}
            emptyTitle={t('admin.noForums')}
            rows={forums}
            columns={[
              {
                key: 'title',
                header: t('admin.title'),
                render: (forum) => (
                  <button
                    type="button"
                    className="font-medium text-on-surface hover:text-secondary text-left"
                    onClick={() => navigate(`/forums/${forum.id}`)}
                  >
                    {forum.title}
                  </button>
                ),
              },
              { key: 'author', header: t('admin.author'), render: authorOf },
              {
                key: 'status',
                header: t('admin.status'),
                render: (forum) => (
                  <StatusChip tone={forum.status === 'HIDDEN' ? 'error' : 'success'}>
                    {forum.status === 'HIDDEN' ? t('admin.hidden') : t('admin.active')}
                  </StatusChip>
                ),
              },
              {
                key: 'actions',
                header: t('admin.actions'),
                render: (forum) => (
                  forum.status === 'HIDDEN' ? (
                    <Button size="sm" variant="ghost" onClick={() => handleShowForum(forum.id)}>
                      {t('admin.show')}
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => handleHideForum(forum.id)}>
                      {t('admin.hide')}
                    </Button>
                  )
                ),
              },
            ]}
          />
        </section>
      )}

      {activeTab === 'comments' && (
        <section
          role="tabpanel"
          id="moderator-panel-comments"
          aria-labelledby="moderator-tab-comments"
          className="space-y-space-sm"
        >
          <h2 className="font-headline text-title-lg text-on-surface">
            {t('admin.manageComments')} ({comments.length})
          </h2>
          <p className="text-body-sm text-on-surface-variant">{t('admin.modCommentsHint')}</p>
          <DashboardTable
            emptyIcon={MdComment}
            emptyTitle={t('admin.noComments')}
            rows={comments}
            columns={[
              {
                key: 'content',
                header: t('admin.content'),
                render: (comment) => (
                  <span className="max-w-xs truncate block text-on-surface">
                    {(comment.content || '').slice(0, 80)}
                  </span>
                ),
              },
              { key: 'author', header: t('admin.author'), render: authorOf },
              {
                key: 'status',
                header: t('admin.status'),
                render: (comment) => (
                  <StatusChip tone={comment.status === 'HIDDEN' ? 'error' : 'success'}>
                    {comment.status === 'HIDDEN' ? t('admin.hidden') : t('admin.active')}
                  </StatusChip>
                ),
              },
              {
                key: 'actions',
                header: t('admin.actions'),
                render: (comment) => (
                  comment.status === 'HIDDEN' ? (
                    <Button size="sm" variant="ghost" onClick={() => handleShowComment(comment.id)}>
                      {t('admin.show')}
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => handleHideComment(comment.id)}>
                      {t('admin.hide')}
                    </Button>
                  )
                ),
              },
            ]}
          />
        </section>
      )}

      {activeTab === 'users' && (
        <section
          role="tabpanel"
          id="moderator-panel-users"
          aria-labelledby="moderator-tab-users"
          className="space-y-space-sm"
        >
          <h2 className="font-headline text-title-lg text-on-surface">
            {t('admin.manageUsers')} ({users.length})
          </h2>
          <p className="text-body-sm text-on-surface-variant">{t('admin.modUsersHint')}</p>
          <DashboardTable
            emptyIcon={MdPeople}
            emptyTitle={t('admin.noUsers')}
            rows={users}
            columns={[
              {
                key: 'user',
                header: t('admin.username'),
                render: (user) => <span className="font-medium text-on-surface">{user.username}</span>,
              },
              { key: 'email', header: t('admin.email'), render: (user) => user.email },
              {
                key: 'status',
                header: t('admin.status'),
                render: (user) => (
                  <StatusChip tone={user.status === 'BANNED' ? 'error' : 'success'}>
                    {user.status === 'BANNED' ? t('admin.banned') : t('admin.active')}
                  </StatusChip>
                ),
              },
              {
                key: 'actions',
                header: t('admin.actions'),
                render: (user) => (
                  user.status === 'BANNED' ? (
                    <Button size="sm" variant="ghost" onClick={() => handleUnblockUser(user.id)}>
                      {t('admin.unblock')}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={user.username === currentUser?.username}
                      onClick={() => handleBlockUser(user.id)}
                    >
                      {t('admin.block')}
                    </Button>
                  )
                ),
              },
            ]}
          />
        </section>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title || t('admin.confirm')}
        message={confirm?.message || ''}
        confirmLabel={t('admin.confirm')}
        cancelLabel={t('admin.cancel')}
        danger={confirm?.danger}
        onConfirm={confirm?.onConfirm || closeConfirm}
        onCancel={closeConfirm}
      />
    </PageContainer>
  )
}

export default ModeratorDashboardPage

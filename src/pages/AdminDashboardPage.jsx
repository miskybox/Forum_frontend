import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdDashboard,
  MdPeople,
  MdForum,
  MdArticle,
  MdComment,
  MdCategory,
  MdVisibilityOff,
  MdBlock,
} from 'react-icons/md'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import userService from '../services/userService'
import forumService from '../services/forumService'
import postService from '../services/postService'
import commentService from '../services/commentService'
import categoryService from '../services/categoryService'
import roleService from '../services/roleService'
import PageContainer from '../components/ui/PageContainer'
import SegmentedTabs from '../components/ui/SegmentedTabs'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Checkbox from '../components/ui/Checkbox'
import LoadingSpinner from '../components/common/LoadingSpinner'
import DashboardStatCard from '../components/dashboard/DashboardStatCard'
import DashboardTable from '../components/dashboard/DashboardTable'
import ConfirmDialog from '../components/dashboard/ConfirmDialog'
import StatusChip from '../components/dashboard/StatusChip'

const authorOf = (item) => item?.creatorUsername || item?.username || item?.authorUsername || '—'

const AdminDashboardPage = () => {
  const { user: currentUser } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalForums: 0,
    totalPosts: 0,
    totalComments: 0,
    totalCategories: 0,
    hiddenContent: 0,
    bannedUsers: 0,
  })
  const [users, setUsers] = useState([])
  const [forums, setForums] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [selectedRoles, setSelectedRoles] = useState([])
  const [confirm, setConfirm] = useState(null)

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      const [usersData, forumsData, postsData, commentsData, categoriesData, rolesData] = await Promise.all([
        userService.getAllUsers(0, 100),
        forumService.getAllForums(0, 100),
        postService.getAllPosts(0, 100),
        commentService.getAllComments(),
        categoryService.getAllCategories(),
        roleService.getAllRoles(),
      ])

      const usersList = usersData.content || usersData || []
      const forumsList = forumsData.content || forumsData || []
      const postsList = postsData.content || postsData || []
      const commentsList = commentsData.content || commentsData || []
      const categoriesList = categoriesData.content || categoriesData || []

      setUsers(usersList)
      setForums(forumsList)
      setPosts(postsList)
      setComments(commentsList)
      setRoles(rolesData || [])

      setStats({
        totalUsers: usersList.length,
        totalForums: forumsList.length,
        totalPosts: postsList.length,
        totalComments: commentsList.length,
        totalCategories: categoriesList.length,
        hiddenContent: forumsList.filter((f) => f.status === 'HIDDEN').length
          + commentsList.filter((c) => c.status === 'HIDDEN').length,
        bannedUsers: usersList.filter((u) => u.status === 'BANNED').length,
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

  const handleDeleteUser = (userId) => ask({
    title: t('admin.delete'),
    message: t('admin.confirmDeleteUser'),
    danger: true,
    onConfirm: async () => {
      closeConfirm()
      await userService.deleteUser(userId)
      loadDashboardData()
    },
  })

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

  const handleDeleteForum = (forumId) => ask({
    title: t('admin.delete'),
    message: t('admin.confirmDeleteForum'),
    danger: true,
    onConfirm: async () => {
      closeConfirm()
      await forumService.deleteForum(forumId)
      loadDashboardData()
    },
  })

  const handleDeletePost = (postId) => ask({
    title: t('admin.delete'),
    message: t('admin.confirmDeletePost'),
    danger: true,
    onConfirm: async () => {
      closeConfirm()
      await postService.deletePost(postId)
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

  const handleDeleteComment = (commentId) => ask({
    title: t('admin.delete'),
    message: t('admin.confirmDeleteComment'),
    danger: true,
    onConfirm: async () => {
      closeConfirm()
      await commentService.deleteComment(commentId)
      loadDashboardData()
    },
  })

  const handleOpenRoleModal = (user) => {
    setEditingUser(user)
    setSelectedRoles(user.roles || [])
    setShowRoleModal(true)
  }

  const handleSaveRoles = async () => {
    try {
      await userService.updateUserRoles(editingUser.id, selectedRoles)
      setShowRoleModal(false)
      loadDashboardData()
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleRole = (roleName, checked) => {
    setSelectedRoles((current) => (
      checked ? [...current, roleName] : current.filter((name) => name !== roleName)
    ))
  }

  if (loading) {
    return (
      <PageContainer className="py-margin">
        <LoadingSpinner label={t('common.loading')} />
      </PageContainer>
    )
  }

  const tabs = [
    { id: 'overview', label: t('admin.overview'), icon: MdDashboard },
    { id: 'users', label: t('admin.users'), icon: MdPeople },
    { id: 'forums', label: t('admin.forums'), icon: MdForum },
    { id: 'posts', label: t('admin.posts'), icon: MdArticle },
    { id: 'comments', label: t('admin.comments'), icon: MdComment },
  ]

  return (
    <PageContainer className="py-margin space-y-space-lg">
      <header>
        <h1 className="font-headline text-headline-lg text-on-surface">{t('admin.adminPanel')}</h1>
        <p className="mt-space-xs text-body-md text-on-surface-variant">
          {t('admin.welcome')}, @{currentUser?.username}
        </p>
        <p className="text-body-sm text-on-surface-variant">{t('admin.permissionsAdmin')}</p>
      </header>

      {error && (
        <p role="alert" className="text-body-md text-error">{error}</p>
      )}

      <SegmentedTabs
        tabs={tabs}
        activeId={activeTab}
        onChange={setActiveTab}
        idPrefix="admin"
        label={t('admin.adminPanel')}
      />

      {activeTab === 'overview' && (
        <div
          role="tabpanel"
          id="admin-panel-overview"
          aria-labelledby="admin-tab-overview"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md"
        >
          <DashboardStatCard title={t('admin.users')} value={stats.totalUsers} icon={MdPeople} />
          <DashboardStatCard title={t('admin.forums')} value={stats.totalForums} icon={MdForum} />
          <DashboardStatCard title={t('admin.posts')} value={stats.totalPosts} icon={MdArticle} />
          <DashboardStatCard title={t('admin.comments')} value={stats.totalComments} icon={MdComment} />
          <DashboardStatCard title={t('admin.categories')} value={stats.totalCategories} icon={MdCategory} />
          <DashboardStatCard title={t('admin.hiddenContent')} value={stats.hiddenContent} icon={MdVisibilityOff} />
          <DashboardStatCard title={t('admin.bannedUsers')} value={stats.bannedUsers} icon={MdBlock} />
        </div>
      )}

      {activeTab === 'users' && (
        <section
          role="tabpanel"
          id="admin-panel-users"
          aria-labelledby="admin-tab-users"
          className="space-y-space-sm"
        >
          <h2 className="font-headline text-title-lg text-on-surface">
            {t('admin.manageUsers')} ({users.length})
          </h2>
          <p className="text-body-sm text-on-surface-variant">{t('admin.usersHint')}</p>
          <DashboardTable
            emptyIcon={MdPeople}
            emptyTitle={t('admin.noUsers')}
            rows={users}
            columns={[
              {
                key: 'user',
                header: t('admin.username'),
                render: (user) => (
                  <span className="font-medium text-on-surface">{user.username}</span>
                ),
              },
              { key: 'email', header: t('admin.email'), render: (user) => user.email },
              {
                key: 'roles',
                header: t('admin.roles'),
                render: (user) => (
                  <div className="flex flex-wrap gap-1">
                    {(user.roles || []).map((role) => (
                      <StatusChip
                        key={role}
                        tone={role === 'ROLE_ADMIN' ? 'tertiary' : role === 'ROLE_MODERATOR' ? 'warning' : 'muted'}
                      >
                        {role.replace('ROLE_', '')}
                      </StatusChip>
                    ))}
                  </div>
                ),
              },
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
                render: (user) => {
                  const isSelf = user.username === currentUser?.username
                  return (
                    <div className="flex flex-wrap gap-space-xs">
                      <Button size="sm" variant="secondary" onClick={() => handleOpenRoleModal(user)}>
                        {t('admin.roles')}
                      </Button>
                      {user.status === 'BANNED' ? (
                        <Button size="sm" variant="ghost" onClick={() => handleUnblockUser(user.id)}>
                          {t('admin.unblock')}
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled={isSelf} onClick={() => handleBlockUser(user.id)}>
                          {t('admin.block')}
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" disabled={isSelf} onClick={() => handleDeleteUser(user.id)}>
                        {t('admin.delete')}
                      </Button>
                    </div>
                  )
                },
              },
            ]}
          />
        </section>
      )}

      {activeTab === 'forums' && (
        <section
          role="tabpanel"
          id="admin-panel-forums"
          aria-labelledby="admin-tab-forums"
          className="space-y-space-sm"
        >
          <h2 className="font-headline text-title-lg text-on-surface">
            {t('admin.manageForums')} ({forums.length})
          </h2>
          <p className="text-body-sm text-on-surface-variant">{t('admin.forumsHint')}</p>
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
                  <div className="flex flex-wrap gap-space-xs">
                    <Button size="sm" variant="secondary" onClick={() => navigate(`/forums/${forum.id}/edit`)}>
                      {t('admin.edit')}
                    </Button>
                    {forum.status === 'HIDDEN' ? (
                      <Button size="sm" variant="ghost" onClick={() => handleShowForum(forum.id)}>
                        {t('admin.show')}
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handleHideForum(forum.id)}>
                        {t('admin.hide')}
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteForum(forum.id)}>
                      {t('admin.delete')}
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </section>
      )}

      {activeTab === 'posts' && (
        <section
          role="tabpanel"
          id="admin-panel-posts"
          aria-labelledby="admin-tab-posts"
          className="space-y-space-sm"
        >
          <h2 className="font-headline text-title-lg text-on-surface">
            {t('admin.managePosts')} ({posts.length})
          </h2>
          <p className="text-body-sm text-on-surface-variant">{t('admin.postsHint')}</p>
          <DashboardTable
            emptyIcon={MdArticle}
            emptyTitle={t('admin.noPosts')}
            rows={posts}
            columns={[
              {
                key: 'title',
                header: t('admin.title'),
                render: (post) => <span className="font-medium text-on-surface">{post.title || '—'}</span>,
              },
              { key: 'author', header: t('admin.author'), render: authorOf },
              { key: 'forum', header: t('admin.forum'), render: (post) => post.forumTitle || '—' },
              {
                key: 'actions',
                header: t('admin.actions'),
                render: (post) => (
                  <Button size="sm" variant="ghost" onClick={() => handleDeletePost(post.id)}>
                    {t('admin.delete')}
                  </Button>
                ),
              },
            ]}
          />
        </section>
      )}

      {activeTab === 'comments' && (
        <section
          role="tabpanel"
          id="admin-panel-comments"
          aria-labelledby="admin-tab-comments"
          className="space-y-space-sm"
        >
          <h2 className="font-headline text-title-lg text-on-surface">
            {t('admin.manageComments')} ({comments.length})
          </h2>
          <p className="text-body-sm text-on-surface-variant">{t('admin.commentsHint')}</p>
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
                  <div className="flex flex-wrap gap-space-xs">
                    {comment.status === 'HIDDEN' ? (
                      <Button size="sm" variant="ghost" onClick={() => handleShowComment(comment.id)}>
                        {t('admin.show')}
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => handleHideComment(comment.id)}>
                        {t('admin.hide')}
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteComment(comment.id)}>
                      {t('admin.delete')}
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        </section>
      )}

      {showRoleModal && editingUser && (
        <Modal title={`${t('admin.editRolesOf')} ${editingUser.username}`} onClose={() => setShowRoleModal(false)}>
          <div className="mt-space-md space-y-space-sm">
            {roles.map((role) => (
              <Checkbox
                key={role.id || role.name}
                id={`role-${role.name}`}
                label={role.name?.replace('ROLE_', '')}
                checked={selectedRoles.includes(role.name)}
                onChange={(event) => toggleRole(role.name, event.target.checked)}
              />
            ))}
          </div>
          <div className="mt-space-lg flex justify-end gap-space-sm">
            <Button variant="ghost" onClick={() => setShowRoleModal(false)}>{t('admin.cancel')}</Button>
            <Button onClick={handleSaveRoles}>{t('admin.save')}</Button>
          </div>
        </Modal>
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

export default AdminDashboardPage

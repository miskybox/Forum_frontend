import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import userService from '../services/userService'
import forumService from '../services/forumService'
import postService from '../services/postService'
import commentService from '../services/commentService'
import categoryService from '../services/categoryService'
import roleService from '../services/roleService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { toast } from 'react-hot-toast'
import PropTypes from 'prop-types'

const StatCard = ({ title, value, icon }) => (
  <div className="bg-surface-container-lowest rounded-lg p-space-lg shadow-level-1">
    <div className="flex items-center justify-between gap-space-sm">
      <div>
        <p className="text-label-md uppercase tracking-wider text-on-surface-variant">{title}</p>
        <p className="mt-1 font-headline text-headline-lg text-on-surface">{value}</p>
      </div>
      <span className="w-12 h-12 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </span>
    </div>
  </div>
)

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
}

const AdminDashboardPage = () => {
  const { currentUser, hasRole } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalForums: 0,
    totalPosts: 0,
    totalComments: 0,
    totalCategories: 0,
    hiddenContent: 0,
    bannedUsers: 0
  })

  const [users, setUsers] = useState([])
  const [forums, setForums] = useState([])
  const [posts, setPosts] = useState([])
  const [comments, setComments] = useState([])
  const [roles, setRoles] = useState([])

  const [editingUser, setEditingUser] = useState(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState([])

  useEffect(() => {
    if (!currentUser || !hasRole('ROLE_ADMIN')) {
      navigate('/')
      return
    }
    loadDashboardData()
  }, [currentUser, hasRole, navigate])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      const [usersData, forumsData, postsData, commentsData, categoriesData, rolesData] = await Promise.all([
        userService.getAllUsers().catch(() => []),
        forumService.getAllForums(0, 100).catch(() => ({ totalElements: 0, content: [] })),
        postService.getAllPosts(0, 100).catch(() => ({ totalElements: 0, content: [] })),
        commentService.getAllComments().catch(() => []),
        categoryService.getAllCategories().catch(() => []),
        roleService.getAllRoles().catch(() => [])
      ])

      const usersList = Array.isArray(usersData) ? usersData : usersData.content || []
      const forumsList = forumsData.content || []
      const postsList = postsData.content || []
      const commentsList = Array.isArray(commentsData) ? commentsData : []

      const hiddenForums = forumsList.filter(f => f.status === 'HIDDEN').length
      const hiddenComments = commentsList.filter(c => c.status === 'HIDDEN').length
      const bannedUsers = usersList.filter(u => u.status === 'BANNED').length

      setStats({
        totalUsers: usersList.length,
        totalForums: forumsData.totalElements || forumsList.length,
        totalPosts: postsData.totalElements || postsList.length,
        totalComments: commentsList.length,
        totalCategories: categoriesData.length || 0,
        hiddenContent: hiddenForums + hiddenComments,
        bannedUsers
      })

      setUsers(usersList)
      setForums(forumsList)
      setPosts(postsList)
      setComments(commentsList)
      setRoles(rolesData)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar el dashboard')
    } finally {
      setLoading(false)
    }
  }

  // User actions
  const handleBlockUser = async (userId) => {
    if (!window.confirm('Bloquear este usuario?')) return
    try {
      await userService.blockUser(userId)
      toast.success('Usuario bloqueado')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al bloquear usuario')
    }
  }

  const handleUnblockUser = async (userId) => {
    try {
      await userService.unblockUser(userId)
      toast.success('Usuario desbloqueado')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al desbloquear usuario')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Eliminar este usuario permanentemente? Esta accion no se puede deshacer.')) return
    try {
      await userService.deleteUser(userId)
      toast.success('Usuario eliminado')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar usuario')
    }
  }

  const handleOpenRoleModal = (user) => {
    setEditingUser(user)
    setSelectedRoles(user.roles || [])
    setShowRoleModal(true)
  }

  const handleSaveRoles = async () => {
    if (!editingUser) return
    try {
      await userService.updateUserRoles(editingUser.id, selectedRoles)
      toast.success('Roles actualizados')
      setShowRoleModal(false)
      setEditingUser(null)
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar roles')
    }
  }

  // Forum actions
  const handleHideForum = async (forumId) => {
    if (!window.confirm('Ocultar este foro?')) return
    try {
      await forumService.hideForum(forumId)
      toast.success('Foro ocultado')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al ocultar foro')
    }
  }

  const handleShowForum = async (forumId) => {
    try {
      await forumService.showForum(forumId)
      toast.success('Foro visible')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al mostrar foro')
    }
  }

  const handleDeleteForum = async (forumId) => {
    if (!window.confirm('Eliminar este foro permanentemente?')) return
    try {
      await forumService.deleteForum(forumId)
      toast.success('Foro eliminado')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar foro')
    }
  }

  // Comment actions
  const handleHideComment = async (commentId) => {
    if (!window.confirm('Ocultar este comentario?')) return
    try {
      await commentService.hideComment(commentId)
      toast.success('Comentario ocultado')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al ocultar comentario')
    }
  }

  const handleShowComment = async (commentId) => {
    try {
      await commentService.showComment(commentId)
      toast.success('Comentario visible')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al mostrar comentario')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Eliminar este comentario permanentemente?')) return
    try {
      await commentService.deleteComment(commentId)
      toast.success('Comentario eliminado')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar comentario')
    }
  }

  // Post actions
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Eliminar este post permanentemente?')) return
    try {
      await postService.deletePost(postId)
      toast.success('Post eliminado')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al eliminar post')
    }
  }

  if (loading) return <LoadingSpinner />

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'users', label: 'Usuarios', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'forums', label: 'Foros', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: 'posts', label: 'Posts', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'comments', label: 'Comentarios', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' }
  ]

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-primary to-primary-container rounded-lg p-6 shadow-level-2">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{t('admin.adminPanel') || 'Panel de Administrador'}</h1>
              <p className="text-white/80">
                Bienvenido, <span className="font-semibold">{currentUser?.username}</span> - Control total del sistema
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-6 bg-secondary-container/50 border-l-4 border-primary p-4 rounded-r-lg">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-primary mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-on-primary-fixed-variant">Permisos de Administrador</h3>
              <ul className="text-sm mt-1 list-disc list-inside text-on-surface">
                <li>Gestionar usuarios: bloquear, desbloquear, eliminar y asignar roles</li>
                <li>Moderar contenido: ocultar y eliminar foros, posts y comentarios</li>
                <li>Acceso completo a todas las funciones del sistema</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-surface-container-high pb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-label-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-secondary text-on-secondary shadow-level-1'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container shadow-level-1'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Usuarios" value={stats.totalUsers} icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            <StatCard title="Foros" value={stats.totalForums} icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            <StatCard title="Posts" value={stats.totalPosts} icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            <StatCard title="Comentarios" value={stats.totalComments} icon="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            <StatCard title="Categorias" value={stats.totalCategories} icon="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            <StatCard title="Contenido oculto" value={stats.hiddenContent} icon="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            <StatCard title="Usuarios bloqueados" value={stats.bannedUsers} icon="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-surface-container-lowest rounded-lg shadow-level-2 overflow-hidden">
            <div className="p-4 bg-secondary">
              <h2 className="text-xl font-bold text-white">Gestionar Usuarios ({users.length})</h2>
              <p className="text-secondary-fixed text-sm">Control total: bloquear, desbloquear, eliminar y asignar roles</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Usuario</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Roles</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Estado</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-surface-container-high hover:bg-surface-container-low">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold text-sm">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-on-surface font-medium">{user.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">{user.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles?.map(role => (
                            <span key={role} className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                              role === 'ROLE_ADMIN' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                              role === 'ROLE_MODERATOR' ? 'bg-warning-light text-warning-dark' :
                              'bg-surface-container text-on-surface'
                            }`}>
                              {role.replace('ROLE_', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          user.status === 'BANNED' ? 'bg-error-light text-error-dark' : 'bg-success-light text-success-dark'
                        }`}>
                          {user.status === 'BANNED' ? 'Bloqueado' : 'Activo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenRoleModal(user)}
                            className="px-2 py-1 text-xs bg-tertiary-fixed text-on-tertiary-fixed-variant rounded hover:bg-tertiary-fixed-dim"
                            title="Editar roles"
                          >
                            Roles
                          </button>
                          {user.status === 'BANNED' ? (
                            <button onClick={() => handleUnblockUser(user.id)} className="px-2 py-1 text-xs bg-success-light text-success-dark rounded hover:bg-secondary-fixed-dim">
                              Desbloquear
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlockUser(user.id)}
                              className="px-2 py-1 text-xs bg-warning-light text-warning-dark rounded hover:bg-primary-fixed"
                              disabled={user.username === currentUser?.username}
                            >
                              Bloquear
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="px-2 py-1 text-xs bg-error-light text-error-dark rounded hover:bg-error-container"
                            disabled={user.username === currentUser?.username}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Forums Tab */}
        {activeTab === 'forums' && (
          <div className="bg-surface-container-lowest rounded-lg shadow-level-2 overflow-hidden">
            <div className="p-4 bg-secondary">
              <h2 className="text-xl font-bold text-white">Gestionar Foros ({forums.length})</h2>
              <p className="text-secondary-fixed text-sm">Ocultar o eliminar foros permanentemente</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Titulo</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Autor</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Estado</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {forums.map((forum) => (
                    <tr key={forum.id} className="border-b border-surface-container-high hover:bg-surface-container-low">
                      <td className="py-3 px-4">
                        <span className="text-on-surface font-medium hover:text-secondary cursor-pointer" onClick={() => navigate(`/forums/${forum.id}`)}>
                          {forum.title}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">{forum.authorUsername || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          forum.status === 'HIDDEN' ? 'bg-error-light text-error-dark' : 'bg-success-light text-success-dark'
                        }`}>
                          {forum.status === 'HIDDEN' ? 'Oculto' : 'Activo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 flex-wrap">
                          <button onClick={() => navigate(`/forums/${forum.id}/edit`)} className="px-2 py-1 text-xs bg-secondary-fixed text-on-secondary-fixed-variant rounded hover:bg-secondary-fixed-dim">
                            Editar
                          </button>
                          {forum.status === 'HIDDEN' ? (
                            <button onClick={() => handleShowForum(forum.id)} className="px-2 py-1 text-xs bg-success-light text-success-dark rounded hover:bg-secondary-fixed-dim">
                              Mostrar
                            </button>
                          ) : (
                            <button onClick={() => handleHideForum(forum.id)} className="px-2 py-1 text-xs bg-warning-light text-warning-dark rounded hover:bg-primary-fixed">
                              Ocultar
                            </button>
                          )}
                          <button onClick={() => handleDeleteForum(forum.id)} className="px-2 py-1 text-xs bg-error-light text-error-dark rounded hover:bg-error-container">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="bg-surface-container-lowest rounded-lg shadow-level-2 overflow-hidden">
            <div className="p-4 bg-secondary">
              <h2 className="text-xl font-bold text-white">Gestionar Posts ({posts.length})</h2>
              <p className="text-secondary-fixed text-sm">Ver y eliminar posts</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Titulo</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Autor</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Foro</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-surface-container-high hover:bg-surface-container-low">
                      <td className="py-3 px-4">
                        <span className="text-on-surface font-medium">{post.title || 'Sin titulo'}</span>
                      </td>
                      <td className="py-3 px-4 text-on-surface-variant">{post.authorUsername || 'N/A'}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{post.forumTitle || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleDeletePost(post.id)} className="px-2 py-1 text-xs bg-error-light text-error-dark rounded hover:bg-error-container">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-on-surface-variant">No hay posts</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="bg-surface-container-lowest rounded-lg shadow-level-2 overflow-hidden">
            <div className="p-4 bg-secondary">
              <h2 className="text-xl font-bold text-white">Gestionar Comentarios ({comments.length})</h2>
              <p className="text-secondary-fixed text-sm">Ocultar o eliminar comentarios permanentemente</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Contenido</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Autor</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Estado</th>
                    <th className="text-left py-3 px-4 text-on-surface-variant font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr key={comment.id} className="border-b border-surface-container-high hover:bg-surface-container-low">
                      <td className="py-3 px-4 text-on-surface max-w-xs truncate">{comment.content?.substring(0, 80)}...</td>
                      <td className="py-3 px-4 text-on-surface-variant">{comment.authorUsername || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          comment.status === 'HIDDEN' ? 'bg-error-light text-error-dark' : 'bg-success-light text-success-dark'
                        }`}>
                          {comment.status === 'HIDDEN' ? 'Oculto' : 'Activo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {comment.status === 'HIDDEN' ? (
                            <button onClick={() => handleShowComment(comment.id)} className="px-2 py-1 text-xs bg-success-light text-success-dark rounded hover:bg-secondary-fixed-dim">
                              Mostrar
                            </button>
                          ) : (
                            <button onClick={() => handleHideComment(comment.id)} className="px-2 py-1 text-xs bg-warning-light text-warning-dark rounded hover:bg-primary-fixed">
                              Ocultar
                            </button>
                          )}
                          <button onClick={() => handleDeleteComment(comment.id)} className="px-2 py-1 text-xs bg-error-light text-error-dark rounded hover:bg-error-container">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Role Modal */}
        {showRoleModal && editingUser && (
          <div className="fixed inset-0 bg-inverse-surface/50 flex items-center justify-center z-50">
            <div className="bg-surface-container-lowest rounded-lg p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-xl font-bold text-on-surface mb-4">
                Editar roles de {editingUser.username}
              </h3>
              <div className="space-y-3 mb-6">
                {roles.map(role => (
                  <label key={role.id || role.name} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.name)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRoles([...selectedRoles, role.name])
                        } else {
                          setSelectedRoles(selectedRoles.filter(r => r !== role.name))
                        }
                      }}
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      role.name === 'ROLE_ADMIN' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                      role.name === 'ROLE_MODERATOR' ? 'bg-warning-light text-warning-dark' :
                      'bg-surface-container text-on-surface'
                    }`}>
                      {role.name?.replace('ROLE_', '')}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 px-4 py-2 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-high"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveRoles}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-container"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboardPage

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import forumService from '../services/forumService'
import commentService from '../services/commentService'
import userService from '../services/userService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { toast } from 'react-hot-toast'
import PropTypes from 'prop-types'

const ModeratorDashboardPage = () => {
  const { currentUser, hasRole } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalForums: 0,
    totalComments: 0,
    activeUsers: 0,
    hiddenContent: 0
  })
  const [forums, setForums] = useState([])
  const [comments, setComments] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (!currentUser || (!hasRole('ROLE_MODERATOR') && !hasRole('ROLE_ADMIN'))) {
      navigate('/')
      return
    }

    loadDashboardData()
  }, [currentUser, hasRole, navigate])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [forumsData, commentsData, usersData] = await Promise.all([
        forumService.getAllForums(0, 100).catch(() => ({ totalElements: 0, content: [] })),
        commentService.getAllComments().catch(() => []),
        userService.getAllUsers().catch(() => [])
      ])

      const forumsList = forumsData.content || []
      const commentsList = Array.isArray(commentsData) ? commentsData : []
      const usersList = Array.isArray(usersData) ? usersData : []

      const hiddenForums = forumsList.filter(f => f.status === 'HIDDEN').length
      const hiddenComments = commentsList.filter(c => c.status === 'HIDDEN').length

      setStats({
        totalForums: forumsData.totalElements || forumsList.length,
        totalComments: commentsList.length,
        activeUsers: usersList.filter(u => u.status === 'ACTIVE').length,
        hiddenContent: hiddenForums + hiddenComments
      })

      setForums(forumsList)
      setComments(commentsList)
      setUsers(usersList.filter(u => !u.roles?.includes('ROLE_ADMIN')))
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error)
      toast.error('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleHideForum = async (forumId) => {
    if (!window.confirm('¿Ocultar este foro? El administrador decidirá si eliminarlo permanentemente.')) return
    try {
      await forumService.hideForum(forumId)
      toast.success('Foro ocultado correctamente')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al ocultar el foro')
    }
  }

  const handleShowForum = async (forumId) => {
    try {
      await forumService.showForum(forumId)
      toast.success('Foro visible nuevamente')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al mostrar el foro')
    }
  }

  const handleHideComment = async (commentId) => {
    if (!window.confirm('¿Ocultar este comentario?')) return
    try {
      await commentService.hideComment(commentId)
      toast.success('Comentario ocultado correctamente')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al ocultar el comentario')
    }
  }

  const handleShowComment = async (commentId) => {
    try {
      await commentService.showComment(commentId)
      toast.success('Comentario visible nuevamente')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al mostrar el comentario')
    }
  }

  const handleBlockUser = async (userId) => {
    if (!window.confirm('¿Bloquear este usuario? El administrador podrá desbloquearlo.')) return
    try {
      await userService.blockUser(userId)
      toast.success('Usuario bloqueado correctamente')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al bloquear el usuario')
    }
  }

  const handleUnblockUser = async (userId) => {
    try {
      await userService.unblockUser(userId)
      toast.success('Usuario desbloqueado correctamente')
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al desbloquear el usuario')
    }
  }

  if (loading) return <LoadingSpinner />

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'forums', label: 'Moderar Foros', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: 'comments', label: 'Moderar Comentarios', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
    { id: 'users', label: 'Gestionar Usuarios', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header con estilo atractivo de viajes */}
        <div className="mb-8 bg-gradient-to-r from-amber-600 to-orange-500 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{t('admin.moderatorPanel') || 'Panel de Moderador'}</h1>
              <p className="text-amber-100">
                ¡Bienvenido, <span className="font-semibold">{currentUser?.username}</span>! 🌍 Mantén nuestra comunidad viajera segura
              </p>
            </div>
          </div>
        </div>

        {/* Info Box - Permisos del Moderador */}
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-blue-800">Tus permisos como Moderador</h3>
              <ul className="text-blue-700 text-sm mt-1 list-disc list-inside">
                <li><strong>Ocultar</strong> foros y comentarios inapropiados (el admin decidirá si eliminarlos)</li>
                <li><strong>Bloquear</strong> usuarios que incumplan las normas (el admin puede desbloquearlos)</li>
                <li><strong>No puedes eliminar</strong> contenido ni usuarios permanentemente</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-amber-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white text-amber-700 hover:bg-amber-100 border border-amber-200'
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
            <StatCard title="Total Foros" value={stats.totalForums} icon="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" color="bg-gradient-to-br from-green-400 to-emerald-500" />
            <StatCard title="Total Comentarios" value={stats.totalComments} icon="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" color="bg-gradient-to-br from-blue-400 to-indigo-500" />
            <StatCard title="Usuarios Activos" value={stats.activeUsers} icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" color="bg-gradient-to-br from-purple-400 to-violet-500" />
            <StatCard title="Contenido Oculto" value={stats.hiddenContent} icon="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" color="bg-gradient-to-br from-orange-400 to-red-500" />
          </div>
        )}

        {/* Forums Tab */}
        {activeTab === 'forums' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-500">
              <h2 className="text-xl font-bold text-white">Moderar Foros ({forums.length})</h2>
              <p className="text-amber-100 text-sm">Puedes ocultar foros inapropiados. El administrador decidirá si eliminarlos.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-amber-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-amber-800 font-semibold">Título</th>
                    <th className="text-left py-3 px-4 text-amber-800 font-semibold">Autor</th>
                    <th className="text-left py-3 px-4 text-amber-800 font-semibold">Estado</th>
                    <th className="text-left py-3 px-4 text-amber-800 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {forums.map((forum) => (
                    <tr key={forum.id} className="border-b border-amber-100 hover:bg-amber-50/50">
                      <td className="py-3 px-4">
                        <span className="text-gray-800 font-medium hover:text-amber-600 cursor-pointer" onClick={() => navigate(`/forums/${forum.id}`)}>
                          {forum.title}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{forum.authorUsername || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${forum.status === 'HIDDEN' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {forum.status === 'HIDDEN' ? '🚫 Oculto' : '✅ Activo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {forum.status === 'HIDDEN' ? (
                          <button onClick={() => handleShowForum(forum.id)} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">Mostrar</button>
                        ) : (
                          <button onClick={() => handleHideForum(forum.id)} className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">Ocultar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500">
              <h2 className="text-xl font-bold text-white">Moderar Comentarios ({comments.length})</h2>
              <p className="text-blue-100 text-sm">Puedes ocultar comentarios inapropiados.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-blue-800 font-semibold">Contenido</th>
                    <th className="text-left py-3 px-4 text-blue-800 font-semibold">Autor</th>
                    <th className="text-left py-3 px-4 text-blue-800 font-semibold">Estado</th>
                    <th className="text-left py-3 px-4 text-blue-800 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr key={comment.id} className="border-b border-blue-100 hover:bg-blue-50/50">
                      <td className="py-3 px-4 text-gray-800 max-w-xs truncate">{comment.content?.substring(0, 80)}...</td>
                      <td className="py-3 px-4 text-gray-600">{comment.authorUsername || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${comment.status === 'HIDDEN' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {comment.status === 'HIDDEN' ? '🚫 Oculto' : '✅ Activo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {comment.status === 'HIDDEN' ? (
                          <button onClick={() => handleShowComment(comment.id)} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">Mostrar</button>
                        ) : (
                          <button onClick={() => handleHideComment(comment.id)} className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">Ocultar</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-violet-500">
              <h2 className="text-xl font-bold text-white">Gestionar Usuarios ({users.length})</h2>
              <p className="text-purple-100 text-sm">Puedes bloquear usuarios que incumplan las normas.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-purple-800 font-semibold">Usuario</th>
                    <th className="text-left py-3 px-4 text-purple-800 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-purple-800 font-semibold">Estado</th>
                    <th className="text-left py-3 px-4 text-purple-800 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-purple-100 hover:bg-purple-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-800 font-medium">{user.username}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${user.status === 'BANNED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {user.status === 'BANNED' ? '🚫 Bloqueado' : '✅ Activo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.status === 'BANNED' ? (
                          <button onClick={() => handleUnblockUser(user.id)} className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">Desbloquear</button>
                        ) : (
                          <button onClick={() => handleBlockUser(user.id)} className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors" disabled={user.username === currentUser?.username}>Bloquear</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon, color }) => (
  <div className={`${color} rounded-xl p-6 shadow-lg text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <p className="text-4xl font-bold mt-2">{value}</p>
      </div>
      <div className="bg-white/20 p-3 rounded-full">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
    </div>
  </div>
)

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired
}

export default ModeratorDashboardPage


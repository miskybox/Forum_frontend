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

const StatCard = ({ title, value, icon, color }) => (
  <div className={`rounded-xl p-5 shadow-lg text-white ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-80">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
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
      const commentsList = Array.isArray(commentsData) ? commentsData : []

      const hiddenForums = forumsList.filter(f => f.status === 'HIDDEN').length
      const hiddenComments = commentsList.filter(c => c.status === 'HIDDEN').length
      const bannedUsers = usersList.filter(u => u.status === 'BANNED').length

      setStats({
        totalUsers: usersList.length,
        totalForums: forumsData.totalElements || forumsList.length,
        totalPosts: postsData.totalElements || postsData.content?.length || 0,
        totalComments: commentsList.length,
        totalCategories: categoriesData.length || 0,
        hiddenContent: hiddenForums + hiddenComments,
        bannedUsers
      })

      setUsers(usersList)
      setForums(forumsList)
      setPosts(postsData.content || [])
      setComments(commentsList)
      setRoles(rolesData)
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar el dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: 'M3 12l2-2 7-7 7 7' },
    { id: 'users', label: 'Usuarios', icon: 'M12 4.354a4 4 0 110 5.292' },
    { id: 'forums', label: 'Foros', icon: 'M8 12h.01M12 12h.01M16 12h.01' },
    { id: 'comments', label: 'Comentarios', icon: 'M9 16H5' },
    { id: 'posts', label: 'Posts', icon: 'M9 12h6' }
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold mb-6">{t('admin.adminPanel') || 'Panel de Administrador'} 👑</h1>

        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg ${activeTab === tab.id ? 'bg-purple-600' : 'bg-white/10'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Usuarios" value={stats.totalUsers} icon="M12 4.354a4 4 0 110 5.292" color="bg-blue-600" />
            <StatCard title="Foros" value={stats.totalForums} icon="M8 12h.01" color="bg-green-600" />
            <StatCard title="Posts" value={stats.totalPosts} icon="M9 12h6" color="bg-pink-600" />
            <StatCard title="Comentarios" value={stats.totalComments} icon="M9 16H5" color="bg-purple-600" />
            <StatCard title="Categorías" value={stats.totalCategories} icon="M7 7h.01" color="bg-yellow-600" />
            <StatCard title="Contenido oculto" value={stats.hiddenContent} icon="M13.875 18.825" color="bg-orange-600" />
            <StatCard title="Usuarios bloqueados" value={stats.bannedUsers} icon="M18.364 18.364" color="bg-red-600" />
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminDashboardPage

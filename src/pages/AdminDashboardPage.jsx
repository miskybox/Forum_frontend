import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import userService from '../services/userService'
import forumService from '../services/forumService'
import postService from '../services/postService'
import categoryService from '../services/categoryService'
import roleService from '../services/roleService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { toast } from 'react-hot-toast'

const AdminDashboardPage = () => {
  const { currentUser, hasRole } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalForums: 0,
    totalPosts: 0,
    totalCategories: 0
  })
  const [users, setUsers] = useState([])
  const [recentForums, setRecentForums] = useState([])
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
      
      // Cargar estadísticas
      const [usersData, forumsData, postsData, categoriesData] = await Promise.all([
        userService.getAllUsers().catch(() => []),
        forumService.getAllForums(0, 1).catch(() => ({ totalElements: 0, content: [] })),
        postService.getAllPosts(0, 1).catch(() => ({ totalElements: 0, content: [] })),
        categoryService.getAllCategories().catch(() => [])
      ])

      setStats({
        totalUsers: Array.isArray(usersData) ? usersData.length : (usersData.content?.length || 0),
        totalForums: forumsData.totalElements || 0,
        totalPosts: postsData.totalElements || 0,
        totalCategories: categoriesData.length || 0
      })

      // Cargar usuarios
      if (Array.isArray(usersData)) {
        setUsers(usersData.slice(0, 10))
      } else if (usersData.content) {
        setUsers(usersData.content.slice(0, 10))
      }

      // Cargar foros recientes
      const forums = await forumService.getAllForums(0, 5).catch(() => ({ content: [] }))
      setRecentForums(forums.content || [])

      // Cargar roles disponibles
      const rolesData = await roleService.getAllRoles().catch(() => [])
      setRoles(rolesData)
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error)
      toast.error('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return
    }

    try {
      await userService.deleteUser(userId)
      toast.success('Usuario eliminado correctamente')
      loadDashboardData()
    } catch (error) {
      toast.error('Error al eliminar el usuario')
    }
  }

  const handleEditUserRoles = (user) => {
    setEditingUser(user)
    setShowRoleModal(true)
  }

  const handleUpdateUserRoles = async (userId, newRoles) => {
    try {
      await userService.updateUserRoles(userId, newRoles)
      toast.success('Roles actualizados correctamente')
      setShowRoleModal(false)
      setEditingUser(null)
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar roles del usuario')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido, {currentUser?.username || 'Administrador'}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Usuarios</p>
              <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Foros</p>
              <p className="text-3xl font-bold mt-2">{stats.totalForums}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 rounded-full p-3">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Posts</p>
              <p className="text-3xl font-bold mt-2">{stats.totalPosts}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 rounded-full p-3">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Categorías</p>
              <p className="text-3xl font-bold mt-2">{stats.totalCategories}</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-3">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Usuarios */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Usuarios Recientes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Usuario</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Roles</th>
                  <th className="text-left py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-2">{user.username}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">
                      <div className="flex gap-1">
                        {user.roles?.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUserRoles(user)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          title="Editar roles"
                        >
                          Editar Roles
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                          title="Eliminar usuario"
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

        {/* Foros Recientes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Foros Recientes</h2>
          <div className="space-y-4">
            {recentForums.map((forum) => (
              <div
                key={forum.id}
                className="border-b pb-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                onClick={() => navigate(`/forums/${forum.id}`)}
              >
                <h3 className="font-semibold">{forum.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {forum.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Edición de Roles */}
      {showRoleModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Editar Roles de {editingUser.username}</h3>
            <div className="space-y-2 mb-4">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingUser.roles?.includes(role.name) || false}
                    onChange={(e) => {
                      const newRoles = e.target.checked
                        ? [...(editingUser.roles || []), role.name]
                        : editingUser.roles?.filter(r => r !== role.name) || []
                      setEditingUser({ ...editingUser, roles: newRoles })
                    }}
                    className="rounded"
                  />
                  <span>{role.name}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowRoleModal(false)
                  setEditingUser(null)
                }}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleUpdateUserRoles(editingUser.id, editingUser.roles)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboardPage


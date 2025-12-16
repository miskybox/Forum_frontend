import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import forumService from '../services/forumService'
import postService from '../services/postService'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { toast } from 'react-hot-toast'

const ModeratorDashboardPage = () => {
  const { currentUser, hasRole } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalForums: 0,
    totalPosts: 0,
    totalComments: 0,
    pendingModeration: 0
  })
  const [recentForums, setRecentForums] = useState([])
  const [recentPosts, setRecentPosts] = useState([])

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
      
      // Cargar estadísticas
      const [forumsData, postsData] = await Promise.all([
        forumService.getAllForums(0, 1).catch(() => ({ totalElements: 0, content: [] })),
        postService.getAllPosts(0, 1).catch(() => ({ totalElements: 0, content: [] }))
      ])

      setStats({
        totalForums: forumsData.totalElements || 0,
        totalPosts: postsData.totalElements || 0,
        totalComments: 0, // Se puede implementar después
        pendingModeration: 0 // Se puede implementar después
      })

      // Cargar foros recientes
      const forums = await forumService.getAllForums(0, 5).catch(() => ({ content: [] }))
      setRecentForums(forums.content || [])

      // Cargar posts recientes
      const posts = await postService.getAllPosts(0, 5).catch(() => ({ content: [] }))
      setRecentPosts(posts.content || [])
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error)
      toast.error('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleEditForum = (forumId) => {
    navigate(`/forums/${forumId}/edit`)
  }

  const handleEditPost = (postId) => {
    navigate(`/posts/${postId}/edit`)
  }

  const handleDeleteForum = async (forumId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este foro?')) {
      return
    }

    try {
      await forumService.deleteForum(forumId)
      toast.success('Foro eliminado correctamente')
      loadDashboardData()
    } catch (_error) {
      toast.error('Error al eliminar el foro')
    }
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este post?')) {
      return
    }

    try {
      await postService.deletePost(postId)
      toast.success('Post eliminado correctamente')
      loadDashboardData()
    } catch (_error) {
      toast.error('Error al eliminar el post')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Panel de Moderación</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Bienvenido, {currentUser?.username || 'Moderador'}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <p className="text-gray-600 dark:text-gray-400 text-sm">Comentarios</p>
              <p className="text-3xl font-bold mt-2">{stats.totalComments}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Pendientes</p>
              <p className="text-3xl font-bold mt-2">{stats.pendingModeration}</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-3">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Foros Recientes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Foros Recientes</h2>
          <div className="space-y-4">
            {recentForums.map((forum) => (
              <div
                key={forum.id}
                className="border-b pb-4"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                    onClick={() => navigate(`/forums/${forum.id}`)}
                  >
                    <h3 className="font-semibold">{forum.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {forum.description}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditForum(forum.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteForum(forum.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Recientes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Posts Recientes</h2>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="border-b pb-4"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                    onClick={() => navigate(`/posts/${post.id}`)}
                  >
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {post.content}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditPost(post.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModeratorDashboardPage


import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import followService from '../../services/followService'
import userService from '../../services/userService'
import FollowButton from '../../components/social/FollowButton'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const UsersPage = () => {
  const { isAuthenticated, currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('explore')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [activeTab, isAuthenticated])

  const loadUsers = async () => {
    try {
      setLoading(true)
      let data = []

      if (activeTab === 'suggestions' && isAuthenticated) {
        data = await followService.getSuggestedUsers(0, 20)
      } else if (activeTab === 'mutuals' && isAuthenticated) {
        data = await followService.getMutualFollows()
      } else {
        // Explorar todos los usuarios
        const response = await userService.getAllUsers(0, 20)
        data = response.content || response
      }

      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error loading users:', err)
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      setSearching(true)
      const results = await userService.searchUsers(searchQuery)
      setSearchResults(Array.isArray(results) ? results : results.content || [])
    } catch (err) {
      console.error('Error searching users:', err)
      toast.error('Error en la busqueda')
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  const displayUsers = searchResults.length > 0 ? searchResults : users

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-forest">Usuarios</h1>
        <p className="text-forest/70 mt-1">Encuentra y conecta con otros viajeros</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar usuarios por nombre..."
              className="w-full px-4 py-3 pl-10 border border-beige-dark rounded-lg focus:ring-2 focus:ring-teal focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            type="submit"
            disabled={searching}
            className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 disabled:opacity-50 transition-colors"
          >
            {searching ? 'Buscando...' : 'Buscar'}
          </button>
          {searchResults.length > 0 && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-3 border border-beige-dark rounded-lg hover:bg-beige-dark/20 transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </form>

      {/* Tabs - Solo si autenticado */}
      {isAuthenticated && searchResults.length === 0 && (
        <div className="flex gap-2 mb-6 p-1 bg-beige-dark/50 rounded-lg">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'explore'
                ? 'bg-white text-teal shadow-sm'
                : 'text-forest/70 hover:text-forest'
            }`}
          >
            Explorar
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'suggestions'
                ? 'bg-white text-teal shadow-sm'
                : 'text-forest/70 hover:text-forest'
            }`}
          >
            Sugerencias
          </button>
          <button
            onClick={() => setActiveTab('mutuals')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'mutuals'
                ? 'bg-white text-teal shadow-sm'
                : 'text-forest/70 hover:text-forest'
            }`}
          >
            Mutuos
          </button>
        </div>
      )}

      {/* Users Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : displayUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-beige-dark">
          <div className="text-6xl mb-4">
            {searchQuery ? '🔍' : activeTab === 'mutuals' ? '🤝' : '👥'}
          </div>
          <h3 className="text-lg font-semibold text-forest mb-2">
            {searchQuery
              ? 'No se encontraron usuarios'
              : activeTab === 'mutuals'
                ? 'Sin seguidores mutuos'
                : activeTab === 'suggestions'
                  ? 'Sin sugerencias disponibles'
                  : 'No hay usuarios disponibles'}
          </h3>
          <p className="text-forest/70">
            {searchQuery
              ? 'Intenta con otro termino de busqueda'
              : activeTab === 'mutuals'
                ? 'Sigue a mas usuarios para encontrar mutuos'
                : 'Vuelve mas tarde para ver nuevos usuarios'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayUsers.map((user) => (
            <UserCard
              key={user.id || user.userId}
              user={user}
              currentUserId={currentUser?.id}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}

      {/* Login prompt for non-authenticated users */}
      {!isAuthenticated && (
        <div className="mt-8 p-6 bg-gradient-to-r from-teal/10 to-ocean/10 rounded-xl border border-teal/20 text-center">
          <h3 className="text-lg font-semibold text-forest mb-2">
            Inicia sesion para seguir usuarios
          </h3>
          <p className="text-forest/70 mb-4">
            Conecta con otros viajeros, enviales mensajes y ve su contenido en tu feed
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/login"
              className="px-6 py-2 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors"
            >
              Iniciar sesion
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 border-2 border-teal text-teal rounded-lg hover:bg-teal/10 transition-colors"
            >
              Registrarse
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente de tarjeta de usuario
const UserCard = ({ user, currentUserId, isAuthenticated }) => {
  const userId = user.id || user.userId
  const isOwnProfile = currentUserId === userId

  return (
    <div className="bg-white rounded-xl shadow-md border border-beige-dark overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        {/* Avatar y nombre */}
        <Link to={`/profile/${userId}`} className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal to-ocean flex items-center justify-center text-white text-lg font-bold">
            {user.avatarUrl || user.profileImageUrl ? (
              <img
                src={user.avatarUrl || user.profileImageUrl}
                alt={user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user.username?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-forest truncate hover:text-teal transition-colors">
              {user.username}
            </h3>
            {user.fullName && (
              <p className="text-sm text-forest/60 truncate">{user.fullName}</p>
            )}
          </div>
        </Link>

        {/* Bio */}
        {(user.bio || user.biography) && (
          <p className="text-sm text-forest/70 line-clamp-2 mb-3">
            {user.bio || user.biography}
          </p>
        )}

        {/* Location */}
        {user.location && (
          <p className="text-xs text-forest/50 flex items-center gap-1 mb-3">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {user.location}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/profile/${userId}`}
            className="flex-1 text-center py-2 text-sm border border-teal text-teal rounded-lg hover:bg-teal/10 transition-colors"
          >
            Ver perfil
          </Link>

          {isAuthenticated && !isOwnProfile && (
            <>
              <FollowButton userId={userId} size="sm" />
              <Link
                to={`/messages/${userId}`}
                className="p-2 border border-beige-dark rounded-lg hover:bg-beige-dark/20 transition-colors"
                title="Enviar mensaje"
              >
                <svg className="w-5 h-5 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UsersPage

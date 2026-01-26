import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import feedService from '../../services/feedService'
import FeedCard from '../../components/social/FeedCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import useAuth from '../../hooks/useAuth'

const FeedPage = () => {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState(isAuthenticated ? 'following' : 'explore')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadFeed(true)
  }, [activeTab])

  const loadFeed = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true)
        setPage(0)
      } else {
        setLoadingMore(true)
      }
      setError(null)

      const currentPage = reset ? 0 : page
      const data = activeTab === 'following'
        ? await feedService.getFollowingFeed(currentPage, 10)
        : await feedService.getExploreFeed(currentPage, 10)

      if (reset) {
        setItems(data.content)
      } else {
        setItems(prev => [...prev, ...data.content])
      }

      setHasMore(!data.last)
      setPage(currentPage + 1)
    } catch (err) {
      console.error('Error loading feed:', err)
      setError('Error al cargar el feed')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadFeed(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-forest">Contenido</h1>
        <p className="text-forest/70 mt-1">Descubre las publicaciones de la comunidad</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-beige-dark/50 rounded-lg">
        {isAuthenticated && (
          <button
            onClick={() => setActiveTab('following')}
            className={`group flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 min-h-[44px] border-2 ${
              activeTab === 'following'
                ? 'bg-golden text-midnight border-midnight shadow-md'
                : 'bg-white text-midnight border-midnight hover:bg-teal hover:text-white hover:scale-105'
            }`}
          >
            <span className={activeTab === 'following' ? '[text-shadow:_1px_1px_0_#fff,_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff]' : ''}>Siguiendo</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('explore')}
          className={`group flex-1 py-3 px-4 rounded-lg font-bold transition-all duration-200 min-h-[44px] border-2 ${
            activeTab === 'explore'
              ? 'bg-golden text-midnight border-midnight shadow-md'
              : 'bg-teal text-white border-midnight hover:bg-golden hover:text-midnight hover:scale-105'
          }`}
        >
          <span className={activeTab === 'explore' ? '[text-shadow:_1px_1px_0_#fff,_-1px_-1px_0_#fff,_1px_-1px_0_#fff,_-1px_1px_0_#fff]' : ''}>Explorar</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-terracota mb-4">{error}</p>
          <button
            onClick={() => loadFeed(true)}
            className="group bg-golden text-midnight border-2 border-midnight px-6 py-3 rounded-lg font-bold hover:bg-aqua hover:scale-105 transition-all duration-200 min-h-[44px]"
          >
            <span className="group-hover:text-white group-hover:[text-shadow:_1px_1px_0_#213638,_-1px_-1px_0_#213638,_1px_-1px_0_#213638,_-1px_1px_0_#213638] transition-all duration-200">Reintentar</span>
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md border border-beige-dark">
          <div className="text-6xl mb-4">
            {activeTab === 'following' ? '👥' : '🌍'}
          </div>
          <h3 className="text-lg font-semibold text-forest mb-2">
            {activeTab === 'following'
              ? 'Sin publicaciones de seguidos'
              : 'Sin publicaciones recientes'}
          </h3>
          <p className="text-forest/70 mb-4">
            {activeTab === 'following'
              ? 'Sigue a otros viajeros para ver sus publicaciones aqui'
              : 'Se el primero en publicar algo'}
          </p>
          {activeTab === 'following' && (
            <Link
              to="/forums"
              className="inline-block bg-golden text-midnight border-2 border-midnight px-6 py-3 rounded-lg font-bold hover:bg-teal hover:text-white hover:scale-105 transition-all duration-200 min-h-[44px]"
            >
              Explorar foros
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))}

          {/* Load more */}
          {hasMore && (
            <div className="text-center py-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="group bg-golden text-midnight border-2 border-midnight px-6 py-3 rounded-lg font-bold hover:bg-aqua hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200 min-h-[44px]"
              >
                {loadingMore ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Cargando...
                  </span>
                ) : (
                  <span className="group-hover:text-white group-hover:[text-shadow:_1px_1px_0_#213638,_-1px_-1px_0_#213638,_1px_-1px_0_#213638,_-1px_1px_0_#213638] transition-all duration-200">Cargar más</span>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FeedPage

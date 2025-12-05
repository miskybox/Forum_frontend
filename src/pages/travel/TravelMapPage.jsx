import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import WorldMap from '../../components/travel/WorldMap'
import TravelStats from '../../components/travel/TravelStats'
import PlacesList from '../../components/travel/PlacesList'
import AddPlaceModal from '../../components/travel/AddPlaceModal'
import travelService from '../../services/travelService'
import { Link } from 'react-router-dom'

/**
 * TravelMapPage con tema Jungle
 */
const TravelMapPage = () => {
  const { user, isAuthenticated } = useAuth()
  const [places, setPlaces] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPlace, setEditingPlace] = useState(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const loadData = async () => {
    setLoading(true)
    try {
      const [placesData, statsData] = await Promise.all([
        travelService.getMyPlaces(),
        travelService.getMyStats()
      ])
      setPlaces(placesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCountryClick = (isoCode) => {
    if (!isAuthenticated) return
    const existingPlace = places.find(p => p.country.isoCode === isoCode)
    if (existingPlace) {
      setEditingPlace(existingPlace)
    }
    setIsModalOpen(true)
  }

  const handleEditPlace = (place) => {
    setEditingPlace(place)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingPlace(null)
  }

  const handleSuccess = () => {
    loadData()
  }

  if (loading) {
    return (
      <div className="theme-jungle min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🌴</div>
          <p className="text-jungle-gold font-retro text-sm uppercase tracking-wider">
            CARGANDO MAPA...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="theme-jungle min-h-screen relative overflow-hidden">
      {/* Efectos de fondo jungla */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-3xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {['🌴', '🌿', '🦁', '🐘', '🦜'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-jungle-dark via-jungle-green to-jungle-dark border-b-4 border-jungle-gold py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-display text-jungle-gold neon-text flex items-center gap-3 mb-2">
                🌴 MI MAPA DE VIAJES
              </h1>
              <p className="text-jungle-leaf font-retro text-sm uppercase tracking-wider opacity-80">
                REGISTRA TUS AVENTURAS
              </p>
            </div>
            
            {isAuthenticated ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary text-jungle-dark border-jungle-gold px-6 py-3 self-start"
              >
                <span className="flex items-center space-x-2">
                  <span>➕</span>
                  <span>AGREGAR LUGAR</span>
                </span>
              </button>
            ) : (
              <Link
                to="/login"
                className="btn btn-outline text-jungle-gold border-jungle-gold px-6 py-3"
              >
                <span className="flex items-center space-x-2">
                  <span>🔐</span>
                  <span>INICIAR SESIÓN</span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {isAuthenticated ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Columna principal - Mapa */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mapa */}
              <div className="card border-jungle-gold">
                <WorldMap 
                  visitedPlaces={places}
                  onCountryClick={handleCountryClick}
                />
              </div>

              {/* Lista de lugares */}
              <PlacesList 
                places={places}
                onEdit={handleEditPlace}
                onRefresh={loadData}
              />
            </div>

            {/* Columna lateral - Stats */}
            <div className="space-y-6">
              <TravelStats stats={stats} />
              
              {/* Acciones rápidas */}
              <div className="card border-jungle-gold">
                <div className="p-6">
                  <h3 className="font-display text-jungle-gold neon-text mb-4 uppercase text-sm">
                    ACCIONES RÁPIDAS
                  </h3>
                  <div className="space-y-3">
                    <QuickAction 
                      icon="🌍" 
                      label="Ranking de viajeros"
                      href="/travel/ranking"
                    />
                    <QuickAction 
                      icon="📊" 
                      label="Estadísticas"
                      href="/profile"
                    />
                    <QuickAction 
                      icon="🎮" 
                      label="Jugar Trivia"
                      href="/trivia"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Vista para usuarios no autenticados */
          <div className="max-w-4xl mx-auto">
            <div className="card border-jungle-gold mb-8">
              <WorldMap visitedPlaces={[]} />
            </div>
            
            <div className="card border-jungle-gold text-center p-8">
              <span className="text-6xl mb-4 block animate-pulse-neon">🌎</span>
              <h2 className="text-2xl font-display text-jungle-gold neon-text mb-4 uppercase">
                EMPIEZA TU AVENTURA
              </h2>
              <p className="text-jungle-leaf font-retro text-sm mb-6 max-w-lg mx-auto opacity-80">
                Crea una cuenta para guardar los países que has visitado, 
                ver tu progreso mundial y competir con otros viajeros.
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/register"
                  className="btn btn-primary text-jungle-dark border-jungle-gold px-6 py-3"
                >
                  <span className="flex items-center space-x-2">
                    <span>🚀</span>
                    <span>CREAR CUENTA</span>
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline text-jungle-gold border-jungle-gold px-6 py-3"
                >
                  <span className="flex items-center space-x-2">
                    <span>👽</span>
                    <span>YA TENGO CUENTA</span>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AddPlaceModal 
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        editPlace={editingPlace}
      />
    </div>
  )
}

const QuickAction = ({ icon, label, href }) => (
  <Link
    to={href}
    className="flex items-center gap-3 p-3 border-2 border-jungle-gold/30 hover:border-jungle-gold transition-colors group"
  >
    <span className="text-2xl group-hover:scale-125 transition-transform">{icon}</span>
    <span className="text-jungle-leaf font-retro text-xs uppercase tracking-wider group-hover:text-jungle-gold">
      {label}
    </span>
    <span className="ml-auto text-jungle-gold/50 group-hover:text-jungle-gold">→</span>
  </Link>
)

export default TravelMapPage

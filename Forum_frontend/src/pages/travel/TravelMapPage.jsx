import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import WorldMap from '../../components/travel/WorldMap'
import TravelStats from '../../components/travel/TravelStats'
import PlacesList from '../../components/travel/PlacesList'
import AddPlaceModal from '../../components/travel/AddPlaceModal'
import travelService from '../../services/travelService'
import { Link } from 'react-router-dom'

// Generar partículas decorativas una sola vez
const PARTICLES = Array.from({ length: 15 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 3,
  icon: ['🌴', '🌿', '✈️', '🧭', '🗺️'][Math.floor(Math.random() * 5)],
}))

/**
 * TravelMapPage con tema Adventure
 */
const TravelMapPage = () => {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🧭</div>
          <p className="text-primary-800 dark:text-primary-300">
            {t('common.loading')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Efectos de fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute text-3xl animate-float"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.icon}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="bg-secondary-50 dark:bg-secondary-900 border-b-2 border-secondary-600 py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-700 dark:text-secondary-100 flex items-center gap-3 mb-2">
                🗺️ {t('travel.title')}
              </h1>
              <p className="text-secondary-600 dark:text-secondary-200">
                {t('travel.addNewDestination')}
              </p>
            </div>
            
            {isAuthenticated ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-secondary px-6 py-3 self-start"
              >
                <span className="flex items-center space-x-2">
                  <span>➕</span>
                  <span>{t('travel.addPlace')}</span>
                </span>
              </button>
            ) : (
              <Link
                to="/login"
                className="btn btn-outline px-6 py-3"
              >
                <span className="flex items-center space-x-2">
                  <span>🔐</span>
                  <span>{t('auth.loginButton')}</span>
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
              <div className="card">
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
              <div className="card">
                <div className="p-4">
                  <h3 className="font-bold text-primary-900 dark:text-primary-100 mb-4 text-sm uppercase">
                    {t('common.showMore')}
                  </h3>
                  <div className="space-y-3">
                    <QuickAction 
                      icon="🌍" 
                      label={t('trivia.ranking')}
                      href="/travel/ranking"
                    />
                    <QuickAction 
                      icon="📊" 
                      label={t('travel.statistics')}
                      href="/profile"
                    />
                    <QuickAction 
                      icon="🎮" 
                      label={t('nav.trivia')}
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
            <div className="card mb-8">
              <WorldMap visitedPlaces={[]} />
            </div>
            
            <div className="card text-center p-8">
              <span className="text-6xl mb-4 block">🌎</span>
              <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-4">
                {t('home.adventureAwaits')}
              </h2>
              <p className="text-primary-800 dark:text-primary-200 text-sm mb-6 max-w-lg mx-auto">
                {t('travel.addNewDestination')}
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/register"
                  className="btn btn-primary px-6 py-3"
                >
                  <span className="flex items-center space-x-2">
                    <span>🚀</span>
                    <span>{t('auth.registerButton')}</span>
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline px-6 py-3"
                >
                  <span className="flex items-center space-x-2">
                    <span>🔐</span>
                    <span>{t('auth.loginButton')}</span>
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
    className="flex items-center gap-3 p-3 border-2 border-primary-300 dark:border-primary-600 hover:border-primary-500 transition-colors group rounded-lg bg-primary-50 dark:bg-primary-900"
  >
    <span className="text-2xl group-hover:scale-125 transition-transform">{icon}</span>
    <span className="text-primary-900 dark:text-primary-100 text-sm font-semibold group-hover:text-primary-600">
      {label}
    </span>
    <span className="ml-auto text-primary-700 dark:text-primary-300 group-hover:text-primary-500">→</span>
  </Link>
)

import PropTypes from 'prop-types'

QuickAction.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
}

export default TravelMapPage

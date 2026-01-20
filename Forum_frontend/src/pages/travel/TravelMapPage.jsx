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
  color: ['#E5A13E', '#CFE7E5', '#213638'][Math.floor(Math.random() * 3)],
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
  const [preselectedCountryCode, setPreselectedCountryCode] = useState(null)

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
      setPreselectedCountryCode(null)
    } else {
      setPreselectedCountryCode(isoCode)
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
    setPreselectedCountryCode(null)
  }

  const handleSuccess = () => {
    loadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-golden border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-light">
            {t('common.loading')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-primary">
      {/* Efectos de fondo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute w-3 h-3 rounded-full animate-float"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              backgroundColor: p.color,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="bg-transparent border-b-2 border-secondary py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-text flex items-center gap-3 mb-1 truncate">
                {t('travel.title')}
              </h1>
              <p className="text-text-light text-xs md:text-sm leading-tight max-w-xs md:max-w-md truncate">
                {t('travel.addNewDestination')}
              </p>
            </div>

            <div className="flex flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn bg-golden hover:bg-golden-dark text-midnight px-4 py-2 w-full md:w-auto font-bold"
                >
                  <span className="flex items-center space-x-2">
                    <span>+</span>
                    <span>{t('travel.addPlace')}</span>
                  </span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-outline border-midnight text-midnight hover:bg-aqua px-4 py-2 w-full md:w-auto"
                >
                  <span className="flex items-center space-x-2">
                    <span>{t('auth.loginButton')}</span>
                  </span>
                </Link>
              )}
            </div>
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
              <div className="card border-golden">
                <div className="p-4">
                  <h3 className="font-bold text-text mb-4 text-sm uppercase">
                    {t('common.showMore')}
                  </h3>
                  <div className="space-y-3">
                    <QuickAction
                      label={t('trivia.ranking')}
                      href="/travel/ranking"
                      bgColor="bg-golden/20"
                    />
                    <QuickAction
                      label={t('travel.statistics')}
                      href="/profile"
                      bgColor="bg-aqua/30"
                    />
                    <QuickAction
                      label={t('nav.trivia')}
                      href="/trivia"
                      bgColor="bg-midnight/20"
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

            <div className="card text-center p-8 border-2 border-golden">
              <div className="w-20 h-20 mx-auto mb-4 bg-aqua rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-text mb-4">
                {t('home.adventureAwaits')}
              </h2>
              <p className="text-text-light text-sm mb-6 max-w-lg mx-auto">
                {t('travel.addNewDestination')}
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/register"
                  className="btn bg-golden hover:bg-golden-dark text-midnight px-6 py-3 font-bold"
                >
                  <span>{t('auth.registerButton')}</span>
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline border-midnight text-midnight hover:bg-aqua px-6 py-3"
                >
                  <span>{t('auth.loginButton')}</span>
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
        preselectedCountryCode={preselectedCountryCode}
      />
    </div>
  )
}

const QuickAction = ({ label, href, bgColor = 'bg-primary-light' }) => (
  <Link
    to={href}
    className={`flex items-center gap-3 p-3 border-2 border-golden hover:border-golden-dark transition-colors group rounded-lg ${bgColor}`}
  >
    <span className="text-text text-sm font-semibold group-hover:text-accent flex-1">
      {label}
    </span>
    <span className="text-golden group-hover:text-accent font-bold">→</span>
  </Link>
)

import PropTypes from 'prop-types'

QuickAction.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  bgColor: PropTypes.string
}

export default TravelMapPage

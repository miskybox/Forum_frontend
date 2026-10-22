import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import WorldMap from '../../components/travel/WorldMap'
import TravelStats from '../../components/travel/TravelStats'
import PlacesList from '../../components/travel/PlacesList'
import AddPlaceModal from '../../components/travel/AddPlaceModal'
import travelService from '../../services/travelService'
import { Link } from 'react-router-dom'
import Seo from '../../components/common/SEO'


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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-fixed-dim border-t-transparent rounded-full animate-spin"></div>
          <p className="text-on-surface-variant">
            {t('common.loading')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full">
      <Seo
        title="Mapa de viajes"
        description="Marca los países que has visitado, descubre estadísticas de tus viajes y explora el mapa mundial de la comunidad ForumViajeros."
        url="/travel"
      />

      <header className="relative overflow-hidden bg-gradient-to-b from-surface-container-high/80 via-surface-container-low to-background">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary-fixed/25 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-gutter-sm lg:px-gutter-lg pt-space-xl pb-space-lg flex flex-col md:flex-row md:items-end md:justify-between gap-space-md">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-md mb-space-sm">
              <MdMap className="text-title-md" aria-hidden="true" />
              {t('nav.map')}
            </p>
            <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface">{t('travel.title')}</h1>
            <p className="mt-space-xs text-body-lg text-on-surface-variant">{t('travel.addNewDestination')}</p>
          </div>
          {isAuthenticated ? (
            <button type="button" onClick={() => setIsModalOpen(true)} className="btn btn-primary">
              <MdAddLocationAlt aria-hidden="true" />
              {t('travel.addPlace')}
            </button>
          ) : (
            <Link to="/login" className="btn btn-outline">{t('auth.loginButton')}</Link>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-gutter-sm lg:px-gutter-lg py-margin overflow-x-hidden">
        {isAuthenticated ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <div className="card border-primary-fixed-dim">
                <div className="p-4">
                  <h3 className="font-bold text-on-surface mb-4 text-sm uppercase">
                    {t('common.showMore')}
                  </h3>
                  <div className="space-y-3">
                    <QuickAction
                      label={t('trivia.ranking')}
                      href="/trivia/leaderboard"
                      bgColor="bg-primary-fixed/20"
                    />
                    <QuickAction
                      label={t('travel.statistics')}
                      href="/trivia"
                      bgColor="bg-secondary-container/30"
                    />
                    <QuickAction
                      label={t('nav.trivia')}
                      href="/trivia"
                      bgColor="bg-inverse-surface/20"
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

            <div className="card text-center p-8 border-2 border-primary-fixed-dim">
              <div className="w-20 h-20 mx-auto mb-4 bg-secondary-container rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-4">
                {t('home.adventureAwaits')}
              </h2>
              <p className="text-on-surface-variant text-sm mb-6 max-w-lg mx-auto">
                {t('travel.addNewDestination')}
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/register"
                  className="btn bg-primary-fixed hover:bg-primary-fixed-dim text-on-surface px-6 py-3 font-bold"
                >
                  <span>{t('auth.registerButton')}</span>
                </Link>
                <Link
                  to="/login"
                  className="btn btn-outline border-outline-variant text-on-surface hover:bg-secondary-container px-6 py-3"
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

const QuickAction = ({ label, href, bgColor = 'bg-surface-container-lowest' }) => (
  <Link
    to={href}
    className={`flex items-center gap-3 p-3 border-2 border-primary-fixed-dim hover:border-primary transition-colors group rounded-lg ${bgColor}`}
  >
    <span className="text-on-surface text-sm font-semibold group-hover:text-primary flex-1">
      {label}
    </span>
    <span className="text-primary group-hover:text-primary font-bold">→</span>
  </Link>
)

import PropTypes from 'prop-types'
import { MdAddLocationAlt, MdMap } from 'react-icons/md'

QuickAction.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  bgColor: PropTypes.string
}

export default TravelMapPage

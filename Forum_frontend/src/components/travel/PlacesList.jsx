import { useState } from 'react'
import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import travelService from '../../services/travelService'
import toast from 'react-hot-toast'

/**
 * Lista de lugares visitados del usuario
 */
const PlacesList = ({ places, onEdit, onRefresh }) => {
  const [filter, setFilter] = useState('all')
  const [deletingId, setDeletingId] = useState(null)

  const statusLabels = {
    VISITED: { label: 'Visitado', color: 'bg-success-light text-success-dark', icon: '✅' },
    WISHLIST: { label: 'Quiero ir', color: 'bg-warning-light text-warning-dark', icon: '⭐' },
    LIVED: { label: 'He vivido', color: 'bg-info-light text-info-dark', icon: '🏠' },
    LIVING: { label: 'Vivo aquí', color: 'bg-info-light text-info-dark', icon: '📍' }
  }

  const filteredPlaces = filter === 'all' 
    ? places 
    : places.filter(p => p.status === filter)

  const handleDelete = async (placeId) => {
    if (!confirm('¿Eliminar este lugar de tu mapa?')) return

    setDeletingId(placeId)
    try {
      await travelService.deletePlace(placeId)
      toast.success('Lugar eliminado')
      onRefresh()
    } catch (error) {
      console.error('Error al eliminar lugar:', error)
      toast.error('Error al eliminar')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleFavorite = async (placeId) => {
    try {
      await travelService.toggleFavorite(placeId)
      onRefresh()
    } catch (error) {
      console.error('Error al actualizar favorito:', error)
      toast.error('Error al actualizar')
    }
  }

  return (
    <div className="bg-white dark:bg-dark-lighter rounded-2xl shadow-lg overflow-hidden">
      {/* Header con filtros */}
      <div className="bg-gradient-to-r from-secondary-600 to-secondary-500 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">
            📍 Mis lugares ({filteredPlaces.length})
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <FilterButton 
            active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            Todos
          </FilterButton>
          {Object.entries(statusLabels).map(([status, { label, icon }]) => (
            <FilterButton
              key={status}
              active={filter === status}
              onClick={() => setFilter(status)}
            >
              {icon} {label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="divide-y divide-primary-200 dark:divide-primary-800 max-h-[500px] overflow-y-auto">
        {filteredPlaces.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-6xl mb-4 block">🗺️</span>
            <p className="text-primary-800 dark:text-primary-200">No hay lugares en esta categoría</p>
            <p className="text-primary-800 dark:text-primary-300 text-sm">¡Empieza a agregar tus viajes!</p>
          </div>
        ) : (
          filteredPlaces.map(place => (
            <div 
              key={place.id}
              className="p-4 hover:bg-primary-50 dark:hover:bg-dark-soft transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Bandera */}
                <span className="text-4xl">{place.country.flagEmoji}</span>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-primary-800 dark:text-primary-100 truncate">
                      {place.cityName ? `${place.cityName}, ` : ''}{place.country.name}
                    </h4>
                    {place.favorite && <span title="Favorito">❤️</span>}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusLabels[place.status].color}`}>
                      {statusLabels[place.status].icon} {statusLabels[place.status].label}
                    </span>
                    
                    {place.visitDate && (
                      <span className="text-primary-800 dark:text-primary-200">
                        📅 {format(new Date(place.visitDate), "MMM yyyy", { locale: es })}
                      </span>
                    )}
                    
                    {place.rating > 0 && (
                      <span className="text-warning-dark">
                        {'⭐'.repeat(place.rating)}
                      </span>
                    )}
                  </div>
                  
                  {place.notes && (
                    <p className="text-primary-800 dark:text-primary-200 text-sm mt-2 line-clamp-2">
                      {place.notes}
                    </p>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleFavorite(place.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      place.favorite 
                        ? 'text-error-dark hover:bg-error-light' 
                        : 'text-primary-700 dark:text-primary-200 hover:bg-primary-100 dark:hover:bg-dark-soft hover:text-error-dark'
                    }`}
                    title={place.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    ❤️
                  </button>
                  <button
                    onClick={() => onEdit(place)}
                    className="p-2 rounded-lg text-primary-700 dark:text-primary-200 hover:bg-primary-100 dark:hover:bg-dark-soft hover:text-primary-500 transition-colors"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(place.id)}
                    disabled={deletingId === place.id}
                    className="p-2 rounded-lg text-primary-700 dark:text-primary-200 hover:bg-error-light hover:text-error-dark transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    {deletingId === place.id ? '⏳' : '🗑️'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
      active
        ? 'bg-light text-secondary-800'
        : 'bg-white/20 text-light hover:bg-white/30'
    }`}
  >
    {children}
  </button>
)

FilterButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
}

PlacesList.propTypes = {
  places: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
}

export default PlacesList


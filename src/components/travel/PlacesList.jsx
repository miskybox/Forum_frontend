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
    VISITED: { label: 'Visitado', color: 'bg-success-light text-success-dark' },
    WISHLIST: { label: 'Quiero ir', color: 'bg-warning-light text-warning-dark' },
    LIVED: { label: 'He vivido', color: 'bg-info-light text-info-dark' },
    LIVING: { label: 'Vivo aquí', color: 'bg-info-light text-info-dark' }
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
    <div className="bg-primary-light rounded-2xl shadow-lg overflow-hidden border border-secondary">
      {/* Header con filtros */}
      <div className="bg-gradient-to-r from-midnight to-teal-dark px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-golden">
            Mis lugares ({filteredPlaces.length})
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            Todos
          </FilterButton>
          {Object.entries(statusLabels).map(([status, { label }]) => (
            <FilterButton
              key={status}
              active={filter === status}
              onClick={() => setFilter(status)}
            >
              {label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Lista */}
      <div className="divide-y divide-secondary max-h-[500px] overflow-y-auto">
        {filteredPlaces.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-aqua rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
            </div>
            <p className="text-text-light">No hay lugares en esta categoría</p>
            <p className="text-text-lighter text-sm">Empieza a agregar tus viajes</p>
          </div>
        ) : (
          filteredPlaces.map(place => (
            <div
              key={place.id}
              className="p-4 hover:bg-primary transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Bandera */}
                <span className="text-4xl">{place.country.flagEmoji}</span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-text truncate">
                      {place.cityName ? `${place.cityName}, ` : ''}{place.country.name}
                    </h4>
                    {place.favorite && <span className="w-3 h-3 bg-error rounded-full" title="Favorito"></span>}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusLabels[place.status].color}`}>
                      {statusLabels[place.status].label}
                    </span>

                    {place.visitDate && (
                      <span className="text-text-light">
                        {format(new Date(place.visitDate), "MMM yyyy", { locale: es })}
                      </span>
                    )}

                    {place.rating > 0 && (
                      <span className="text-golden font-bold">
                        {place.rating}/5
                      </span>
                    )}
                  </div>

                  {place.notes && (
                    <p className="text-text-light text-sm mt-2 line-clamp-2">
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
                        : 'text-accent hover:bg-primary hover:text-error-dark'
                    }`}
                    title={place.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <svg className="w-5 h-5" fill={place.favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>
                  <button
                    onClick={() => onEdit(place)}
                    className="p-2 rounded-lg text-accent hover:bg-primary hover:text-accent-dark transition-colors"
                    title="Editar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(place.id)}
                    disabled={deletingId === place.id}
                    className="p-2 rounded-lg text-accent hover:bg-error-light hover:text-error-dark transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    {deletingId === place.id ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    )}
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
        ? 'bg-primary-light text-text'
        : 'bg-earth-50/40 text-text-light hover:bg-earth-50/60'
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

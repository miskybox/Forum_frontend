import { useState } from 'react'
import PropTypes from 'prop-types'
import CountrySelector from './CountrySelector'
import travelService from '../../services/travelService'
import toast from 'react-hot-toast'

/**
 * Modal para agregar/editar un lugar visitado - Tema Jungle (Jumanji)
 */
const AddPlaceModal = ({ isOpen, onClose, onSuccess, editPlace = null }) => {
  const [selectedCountry, setSelectedCountry] = useState(editPlace?.country || null)
  const [formData, setFormData] = useState({
    cityName: editPlace?.cityName || '',
    status: editPlace?.status || 'VISITED',
    visitDate: editPlace?.visitDate || '',
    notes: editPlace?.notes || '',
    rating: editPlace?.rating || 0,
    favorite: editPlace?.favorite || false
  })
  const [loading, setLoading] = useState(false)

  const statusOptions = [
    { value: 'VISITED', label: '✅ VISITADO', icon: '✅' },
    { value: 'WISHLIST', label: '⭐ QUIERO IR', icon: '⭐' },
    { value: 'LIVED', label: '🏠 HE VIVIDO', icon: '🏠' },
    { value: 'LIVING', label: '📍 VIVO AQUÍ', icon: '📍' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedCountry) {
      toast.error('Selecciona un país')
      return
    }

    setLoading(true)

    try {
      const placeData = {
        countryId: selectedCountry.id,
        cityName: formData.cityName || null,
        status: formData.status,
        visitDate: formData.visitDate || null,
        notes: formData.notes || null,
        rating: formData.rating || null,
        favorite: formData.favorite
      }

      if (editPlace) {
        await travelService.updatePlace(editPlace.id, placeData)
        toast.success('Lugar actualizado')
      } else {
        await travelService.addPlace(placeData)
        toast.success(`${selectedCountry.flagEmoji} ${selectedCountry.name} agregado a tu mapa!`)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-jungle-dark/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative card border-jungle-gold w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-jungle-green to-jungle-dark border-b-4 border-jungle-gold px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-display text-jungle-gold neon-text uppercase">
                {editPlace ? '✏️ EDITAR LUGAR' : '🌍 AGREGAR LUGAR'}
              </h2>
              <p className="text-jungle-leaf font-retro text-xs uppercase tracking-wider opacity-80 mt-1">
                {editPlace ? 'Modifica los detalles' : 'Añade un nuevo destino'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-jungle-gold hover:text-jungle-leaf text-2xl transition-colors"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-jungle-dark/50">
          {/* Selector de país */}
          <div>
            <label className="block text-sm font-retro text-jungle-gold uppercase tracking-wider mb-2">
              PAÍS <span className="text-tech-red">*</span>
            </label>
            <CountrySelector 
              onSelect={setSelectedCountry}
              selectedCountry={selectedCountry}
            />
          </div>

          {/* Ciudad (opcional) */}
          <div>
            <label className="block text-sm font-retro text-jungle-gold uppercase tracking-wider mb-2">
              CIUDAD (OPCIONAL)
            </label>
            <input
              type="text"
              value={formData.cityName}
              onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
              placeholder="Ej: Barcelona, Tokio..."
              className="input w-full border-jungle-gold"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-retro text-jungle-gold uppercase tracking-wider mb-2">
              ESTADO
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: option.value })}
                  className={`px-4 py-3 border-2 transition-all font-retro text-xs uppercase tracking-wider ${
                    formData.status === option.value
                      ? 'border-jungle-gold bg-jungle-gold/20 text-jungle-gold'
                      : 'border-jungle-gold/30 text-jungle-leaf hover:border-jungle-gold/50'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-1">
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fecha de visita */}
          <div>
            <label className="block text-sm font-retro text-jungle-gold uppercase tracking-wider mb-2">
              FECHA DE VISITA
            </label>
            <input
              type="date"
              value={formData.visitDate}
              onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
              className="input w-full border-jungle-gold"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-retro text-jungle-gold uppercase tracking-wider mb-2">
              PUNTUACIÓN
            </label>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    star <= formData.rating ? 'grayscale-0' : 'grayscale opacity-30'
                  }`}
                >
                  ⭐
                </button>
              ))}
              {formData.rating > 0 && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: 0 })}
                  className="text-sm font-retro text-jungle-leaf hover:text-jungle-gold ml-2 uppercase text-xs"
                >
                  QUITAR
                </button>
              )}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-retro text-jungle-gold uppercase tracking-wider mb-2">
              NOTAS
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="¿Qué te pareció? ¿Algún lugar especial?"
              rows={3}
              className="input w-full border-jungle-gold resize-none"
            />
          </div>

          {/* Favorito */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.favorite}
              onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
              className="w-5 h-5 rounded border-jungle-gold text-jungle-gold focus:ring-jungle-gold"
            />
            <span className="text-jungle-leaf font-retro text-xs uppercase tracking-wider">
              ❤️ MARCAR COMO FAVORITO
            </span>
          </label>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-outline text-jungle-gold border-jungle-gold"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>✕</span>
                <span>CANCELAR</span>
              </span>
            </button>
            <button
              type="submit"
              disabled={loading || !selectedCountry}
              className="flex-1 btn btn-primary text-jungle-dark border-jungle-gold disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="animate-spin">🌴</span>
                  <span>GUARDANDO...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>{editPlace ? '✏️' : '➕'}</span>
                  <span>{editPlace ? 'ACTUALIZAR' : 'AGREGAR'}</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

AddPlaceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  editPlace: PropTypes.object
}

export default AddPlaceModal

import { useState } from 'react'
import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'
import CountrySelector from './CountrySelector'
import travelService from '../../services/travelService'
import toast from 'react-hot-toast'

/**
 * Modal para agregar/editar un lugar visitado - Tema Jungle (Jumanji)
 */
const AddPlaceModal = ({ isOpen, onClose, onSuccess, editPlace = null }) => {
  const { t } = useLanguage()
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
    { value: 'VISITED', label: `✅ ${t('travel.visited').toUpperCase()}`, icon: '✅' },
    { value: 'WISHLIST', label: `⭐ ${t('travel.wantToGo').toUpperCase()}`, icon: '⭐' },
    { value: 'LIVED', label: `🏠 ${t('travel.lived').toUpperCase()}`, icon: '🏠' },
    { value: 'LIVING', label: `📍 ${t('travel.living').toUpperCase()}`, icon: '📍' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedCountry) {
      toast.error(`⚠️ ${t('travel.selectCountry')}`)
      return
    }

    setLoading(true)

    try {
      const placeData = {
        countryId: selectedCountry.id,
        cityName: formData.cityName.trim() || null,
        status: formData.status,
        visitDate: formData.visitDate || null,
        notes: formData.notes.trim() || null,
        rating: formData.rating > 0 ? formData.rating : null,
        favorite: formData.favorite
      }

      console.log('Enviando datos del lugar:', placeData)

      if (editPlace) {
        const result = await travelService.updatePlace(editPlace.id, placeData)
        console.log('Lugar actualizado:', result)
        toast.success(`✅ ${t('travel.placeUpdated')}`)
      } else {
        const result = await travelService.addPlace(placeData)
        console.log('Lugar agregado:', result)
        toast.success(`✅ ${selectedCountry.flagEmoji} ${selectedCountry.name} ${t('travel.placeAdded')}`)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error al guardar lugar:', error)
      console.error('Detalles del error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })

      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.error ||
                          error.message ||
                          t('travel.errorSaving')

      toast.error(`⚠️ ${errorMessage}`, { duration: 6000 })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-dark-lighter border-b-2 border-secondary-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-secondary-500">
                {editPlace ? `✏️ ${t('travel.editingPlace')}` : `🌍 ${t('travel.addingPlace')}`}
              </h2>
              <p className="text-light-muted text-sm mt-1">
                {editPlace ? t('travel.modifyDetails') : t('travel.addNewDestination')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-light-muted hover:text-primary-500 text-2xl transition-colors"
              aria-label={t('common.close')}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Selector de país */}
          <div>
            <label className="block text-sm font-medium text-primary-400 mb-2">
              {t('travel.country')} <span className="text-error">*</span>
            </label>
            <CountrySelector 
              onSelect={setSelectedCountry}
              selectedCountry={selectedCountry}
            />
          </div>

          {/* Ciudad (opcional) */}
          <div>
            <label className="block text-sm font-medium text-primary-400 mb-2">
              {t('travel.cityOptional')}
            </label>
            <input
              type="text"
              value={formData.cityName}
              onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
              placeholder="Ej: Barcelona, Tokio..."
              className="input w-full"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-primary-400 mb-2">
              {t('travel.status')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: option.value })}
                  className={`px-4 py-3 border-2 transition-all text-sm rounded-lg ${
                    formData.status === option.value
                      ? 'border-primary-500 bg-primary-500/20 text-primary-500'
                      : 'border-accent-600/30 text-light-muted hover:border-accent-500'
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
            <label className="block text-sm font-medium text-primary-400 mb-2">
              {t('travel.visitDateOptional')}
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                className="input w-full"
                placeholder="Selecciona una fecha"
              />
              {formData.visitDate && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, visitDate: '' })}
                  className="btn btn-outline px-4"
                  title={t('travel.remove')}
                >
                  ✕
                </button>
              )}
            </div>
            <p className="text-light-muted/60 text-xs mt-1">
              {t('travel.visitDateHelper')}
            </p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-primary-400 mb-2">
              {t('travel.rating')}
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
                  className="text-sm text-light-muted hover:text-primary-500 ml-2"
                >
                  {t('travel.remove')}
                </button>
              )}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-primary-400 mb-2">
              {t('travel.notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('travel.notesPlaceholder')}
              rows={3}
              className="input w-full resize-none"
            />
          </div>

          {/* Favorito */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.favorite}
              onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
              className="w-5 h-5 rounded border-accent-600 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-light-muted text-sm">
              ❤️ {t('travel.markAsFavorite')}
            </span>
          </label>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-outline"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>✕</span>
                <span>{t('common.cancel')}</span>
              </span>
            </button>
            <button
              type="submit"
              disabled={loading || !selectedCountry}
              className="flex-1 btn btn-primary disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="animate-spin">🧭</span>
                  <span>{t('travel.saving')}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <span>{editPlace ? '✏️' : '➕'}</span>
                  <span>{editPlace ? t('travel.update') : t('travel.add')}</span>
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

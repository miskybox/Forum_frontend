import { useState } from 'react'
import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'
import CountrySelector from './CountrySelector'
import travelService from '../../services/travelService'
import toast from 'react-hot-toast'

/**
 * Modal para agregar/editar un lugar visitado
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

      if (editPlace) {
        await travelService.updatePlace(editPlace.id, placeData)
        toast.success(`✅ ${t('travel.placeUpdated')}`)
      } else {
        await travelService.addPlace(placeData)
        toast.success(`✅ ${selectedCountry.flagEmoji} ${selectedCountry.name} ${t('travel.placeAdded')}`)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error al guardar lugar:', error)

      let errorMessage = t('travel.errorSaving')
      
      if (error.response) {
        const status = error.response.status
        
        if (status === 401) {
          errorMessage = t('auth.errors.sessionExpired') || 'Tu sesión ha expirado. Inicia sesión de nuevo.'
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para realizar esta acción.'
        } else if (status === 400) {
          errorMessage = 'Los datos ingresados no son válidos.'
        } else if (status === 409) {
          errorMessage = 'Ya has agregado este país anteriormente.'
        } else if (status === 500) {
          errorMessage = 'Error del servidor. Intenta más tarde.'
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor.'
      }

      toast.error(errorMessage, { 
        duration: 5000,
        style: { background: '#2D2A26', color: '#F6E6CB', border: '2px solid #d6453d' }
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-text/80 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label={t('common.close')}
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClose()
          }
        }}
        onTouchEnd={onClose}
      />

      {/* Modal */}
      <div className="relative card w-full max-w-lg max-h-[90vh] overflow-y-auto bg-primary-light border-2 border-secondary">
        {/* Header */}
        <div className="sticky top-0 bg-primary-dark border-b-2 border-secondary px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-text tracking-normal uppercase">
                {editPlace ? `✏️ ${t('travel.editingPlace')}` : `🌍 ${t('travel.addingPlace')}`}
              </h2>
              <p className="text-text-light text-sm mt-1">
                {editPlace ? t('travel.modifyDetails') : t('travel.addNewDestination')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-text-lighter hover:text-accent text-2xl transition-colors"
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
            <label className="block text-sm font-medium text-text mb-2">
              {t('travel.country')} <span className="text-error">*</span>
            </label>
            <CountrySelector
              onSelect={setSelectedCountry}
              selectedCountry={selectedCountry}
            />
          </div>

          {/* Ciudad (opcional) */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
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
            <label className="block text-sm font-medium text-text mb-2">
              {t('travel.status')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: option.value })}
                  className={`px-4 py-4 border-2 transition-all text-sm rounded-lg cursor-pointer ${
                    formData.status === option.value
                      ? 'border-[#B6C7AA] bg-[#B6C7AA]/30 text-[#2D2A26] shadow-md transform scale-[1.02]'
                      : 'border-[#A0937D] text-[#5C4A3A] bg-[#FEFDFB] hover:border-[#B6C7AA] hover:bg-[#B6C7AA]/10 hover:shadow-sm hover:scale-[1.01]'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fecha de visita */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
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
            <p className="text-text-lighter text-xs mt-1">
              {t('travel.visitDateHelper')}
            </p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
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
                  className="text-sm text-text-light hover:text-accent ml-2"
                >
                  {t('travel.remove')}
                </button>
              )}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
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
              className="w-5 h-5 rounded border-accent text-accent focus:ring-accent"
            />
            <span className="text-text text-sm">
              ❤️ {t('travel.markAsFavorite')}
            </span>
          </label>

          {/* Botones - Siempre visibles con estilo prominente */}
          <div className="flex gap-3 pt-6 pb-2 sticky bottom-0 bg-primary-light border-t-2 border-secondary mt-6 -mx-6 px-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-[#A0937D] text-[#5C4A3A] rounded-lg font-bold uppercase tracking-wide hover:bg-[#E7D4B5] hover:border-[#8B7E6A] transition-all cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2">
                <span>✕</span>
                <span>{t('common.cancel')}</span>
              </span>
            </button>
            <button
              type="submit"
              disabled={loading || !selectedCountry}
              className={`flex-1 px-6 py-4 rounded-lg font-bold uppercase tracking-wide transition-all cursor-pointer ${
                loading || !selectedCountry
                  ? 'bg-gray-300 text-gray-500 border-2 border-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-[#B6C7AA] text-[#2D2A26] border-2 border-[#A0B596] hover:bg-[#A0B596] hover:shadow-lg hover:scale-[1.02] shadow-md'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin text-xl">🧭</span>
                  <span>{t('travel.saving')}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="text-xl">{editPlace ? '✏️' : '➕'}</span>
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

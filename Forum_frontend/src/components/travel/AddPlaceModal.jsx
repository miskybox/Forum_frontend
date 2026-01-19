import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'
import CountrySelector from './CountrySelector'
import travelService from '../../services/travelService'
import countryService from '../../services/countryService'
import toast from 'react-hot-toast'

/**
 * Modal para agregar/editar un lugar visitado
 */
const AddPlaceModal = ({ isOpen, onClose, onSuccess, editPlace = null, preselectedCountryCode = null }) => {
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
  const [loadingCountry, setLoadingCountry] = useState(false)

  // Cargar país preseleccionado cuando se abre el modal desde el mapa
  useEffect(() => {
    const loadPreselectedCountry = async () => {
      if (isOpen && preselectedCountryCode && !editPlace) {
        setLoadingCountry(true)
        try {
          const country = await countryService.getCountryByIsoCode(preselectedCountryCode)
          if (country) {
            setSelectedCountry(country)
          }
        } catch (error) {
          console.error('Error cargando país preseleccionado:', error)
        } finally {
          setLoadingCountry(false)
        }
      }
    }
    loadPreselectedCountry()
  }, [isOpen, preselectedCountryCode, editPlace])

  // Resetear formulario cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setSelectedCountry(editPlace?.country || null)
      setFormData({
        cityName: editPlace?.cityName || '',
        status: editPlace?.status || 'VISITED',
        visitDate: editPlace?.visitDate || '',
        notes: editPlace?.notes || '',
        rating: editPlace?.rating || 0,
        favorite: editPlace?.favorite || false
      })
    }
  }, [isOpen, editPlace])

  const statusOptions = [
    { value: 'VISITED', label: t('travel.visited').toUpperCase(), color: 'bg-success' },
    { value: 'WISHLIST', label: t('travel.wantToGo').toUpperCase(), color: 'bg-golden' },
    { value: 'LIVED', label: t('travel.lived').toUpperCase(), color: 'bg-info' },
    { value: 'LIVING', label: t('travel.living').toUpperCase(), color: 'bg-midnight' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedCountry) {
      toast.error(t('travel.selectCountry'))
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
        toast.success(t('travel.placeUpdated'))
      } else {
        await travelService.addPlace(placeData)
        toast.success(`${selectedCountry.flagEmoji} ${selectedCountry.name} ${t('travel.placeAdded')}`)
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
        <div className="sticky top-0 bg-midnight border-b-2 border-golden px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-golden tracking-normal uppercase">
                {editPlace ? t('travel.editingPlace') : t('travel.addingPlace')}
              </h2>
              <p className="text-aqua text-sm mt-1">
                {editPlace ? t('travel.modifyDetails') : t('travel.addNewDestination')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-aqua hover:text-golden text-2xl transition-colors w-8 h-8 flex items-center justify-center"
              aria-label={t('common.close')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
            {loadingCountry ? (
              <div className="flex items-center gap-3 p-3 bg-primary-light rounded-lg border border-secondary">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-golden border-t-transparent" />
                <span className="text-text-light text-sm">Cargando país...</span>
              </div>
            ) : (
              <CountrySelector
                onSelect={setSelectedCountry}
                selectedCountry={selectedCountry}
              />
            )}
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

          {/* Estado - Compacto */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              {t('travel.status')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: option.value })}
                  className={`px-3 py-2 border transition-all text-xs rounded-lg cursor-pointer ${
                    formData.status === option.value
                      ? 'border-[#B6C7AA] bg-[#B6C7AA]/30 text-[#2D2A26] shadow-sm'
                      : 'border-[#A0937D] text-[#5C4A3A] bg-[#FEFDFB] hover:border-[#B6C7AA] hover:bg-[#B6C7AA]/10'
                  }`}
                >
                  <span className="font-semibold">{option.label}</span>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
            <p className="text-text-lighter text-xs mt-1">
              {t('travel.visitDateHelper')}
            </p>
          </div>

          {/* Rating - Compacto */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              {t('travel.rating')}
            </label>
            <div className="flex gap-1 items-center">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`transition-transform hover:scale-110 ${
                    star <= formData.rating ? 'text-golden' : 'text-gray-300'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </button>
              ))}
              {formData.rating > 0 && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: 0 })}
                  className="text-xs text-text-light hover:text-accent ml-2"
                >
                  {t('travel.remove')}
                </button>
              )}
            </div>
          </div>

          {/* Notas - Compacto */}
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              {t('travel.notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('travel.notesPlaceholder')}
              rows={2}
              className="input w-full resize-none text-sm"
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
            <span className="text-text text-sm flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
              {t('travel.markAsFavorite')}
            </span>
          </label>

          {/* Botones - Compactos y accesibles */}
          <div className="flex gap-2 pt-4 pb-2 sticky bottom-0 bg-primary-light border-t border-secondary mt-4 -mx-6 px-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2.5 border border-[#A0937D] rounded-lg text-sm font-semibold hover:bg-[#E7D4B5] transition-all"
              style={{
                color: '#5C4A3A',
                textShadow: '0 0 2px rgba(255,255,255,0.8)'
              }}
            >
              <span className="flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                <span>{t('common.cancel')}</span>
              </span>
            </button>
            <button
              type="submit"
              disabled={loading || !selectedCountry}
              className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                loading || !selectedCountry
                  ? 'bg-gray-300 text-gray-500 border border-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-[#B6C7AA] border border-[#A0B596] hover:bg-[#A0B596] shadow-sm'
              }`}
              style={{
                color: loading || !selectedCountry ? undefined : '#2D2A26',
                textShadow: loading || !selectedCountry ? undefined : '0 0 2px rgba(255,255,255,0.8)'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-midnight border-t-transparent" />
                  <span>{t('travel.saving')}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
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
  editPlace: PropTypes.object,
  preselectedCountryCode: PropTypes.string
}

export default AddPlaceModal

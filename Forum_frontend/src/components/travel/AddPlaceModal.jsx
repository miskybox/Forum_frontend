import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'
import CountrySelector from './CountrySelector'
import travelService from '../../services/travelService'
import countryService from '../../services/countryService'
import toast from 'react-hot-toast'

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
          console.error('Error cargando pais:', error)
        } finally {
          setLoadingCountry(false)
        }
      }
    }
    loadPreselectedCountry()
  }, [isOpen, preselectedCountryCode, editPlace])

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
    { value: 'VISITED', label: 'Visitado' },
    { value: 'WISHLIST', label: 'Quiero ir' },
    { value: 'LIVED', label: 'He vivido' },
    { value: 'LIVING', label: 'Vivo aqui' }
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
        toast.success(`${selectedCountry.name} agregado`)
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.message || t('travel.errorSaving'))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <dialog open className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60"
        aria-label="Cerrar"
      >
        <button
          onClick={onClose}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          tabIndex={0}
        />
      </div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl flex flex-col max-h-[95vh]">
        {/* Header - Compacto */}
        <div className="bg-[#213638] px-4 py-3 rounded-t-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#E5A13E] truncate" id="add-place-modal-title">
              <span className="text-[#fffbe6]">
                {editPlace ? 'Editar lugar' : 'Agregar lugar'}
              </span>
            </h2>
            <button
              onClick={onClose}
              className="text-[#CFE7E5] hover:text-white p-1"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden" aria-labelledby="add-place-modal-title">
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">

            {/* Pais */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Pais <span className="text-red-500">*</span>
              </label>
              {loadingCountry ? (
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded border text-sm">
                  <div className="animate-spin h-4 w-4 border-2 border-[#E5A13E] border-t-transparent rounded-full" />
                  <span className="text-gray-600">Cargando...</span>
                </div>
              ) : (
                <CountrySelector onSelect={setSelectedCountry} selectedCountry={selectedCountry} />
              )}
            </div>

            {/* Ciudad */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ciudad (opcional)
              </label>
              <input
                type="text"
                value={formData.cityName}
                onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
                placeholder="Ej: Barcelona"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#E5A13E] focus:border-transparent"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Estado
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {statusOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: opt.value })}
                      className={`px-2 py-1.5 text-xs font-medium rounded border transition-all duration-200 ${
                        formData.status === opt.value
                          ? 'bg-[#213638] text-white border-[#213638] shadow-lg scale-105'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-[#E5A13E] hover:text-[#213638] hover:border-[#E5A13E] hover:scale-105'
                      }`}
                      style={{ boxShadow: formData.status === opt.value ? '0 0 0 2px #fff' : undefined }}
                    >
                      {opt.label}
                    </button>
                ))}
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                <span>Fecha (opcional)</span>
              </label>
              <input
                type="date"
                id="visitDate"
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#E5A13E] focus:border-transparent"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                <span>Valoración</span>
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: formData.rating === star ? 0 : star })}
                    className="p-0.5"
                  >
                    <svg
                      className={`w-5 h-5 ${star <= formData.rating ? 'text-[#E5A13E]' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                <span>Notas (opcional)</span>
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Tus recuerdos de este lugar..."
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded resize-none focus:ring-2 focus:ring-[#E5A13E] focus:border-transparent"
              />
            </div>

            {/* Favorito */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="favorite"
                checked={formData.favorite}
                onChange={(e) => setFormData({ ...formData, favorite: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[#E5A13E] focus:ring-[#E5A13E]"
              />
              <span className="text-sm text-gray-700">Marcar como favorito</span>
            </label>
          </div>

          {/* Botones - Fuera del scroll, siempre visibles y debajo del contenedor */}
          <div className="flex-shrink-0 px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex flex-col gap-2 md:flex-row md:gap-2 w-full">
              <button
                type="button"
                onClick={onClose}
                className="w-full md:w-1/2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || !selectedCountry}
                className={`w-full md:w-1/2 px-4 py-2 text-sm font-medium rounded transition-colors ${
                  loading || !selectedCountry
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#213638] text-white hover:bg-[#2d4a4d]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Guardando...
                  </span>
                ) : null}
                {!loading && (editPlace ? 'Actualizar' : 'Agregar')}
              </button>
            </div>
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

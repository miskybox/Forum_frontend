import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Cropper from 'react-easy-crop'
import { useLanguage } from '../../contexts/LanguageContext'
import categoryService from '../../services/categoryService'
import forumService from '../../services/forumService'
import { sanitizeInput, validateLength, LENGTH_LIMITS } from '../../utils/sanitize'
import { getCroppedImg } from '../../utils/cropImage'
import { ACCEPTED_IMAGE_ACCEPT, isAcceptedImageFile } from '../../utils/imageTypes'

const ForumForm = ({ initialData = null, isEdit = false }) => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    ...initialData
  })

  const [categories, setCategories] = useState([])
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Crop state
  const [rawImageSrc, setRawImageSrc] = useState(null)   // data URL of raw file
  const [showCropper, setShowCropper] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories()
        setCategories(data)

        if (!formData.categoryId && data.length > 0) {
          setFormData(prevData => ({
            ...prevData,
            categoryId: data[0].id
          }))
        }
      } catch (error) {
        console.error('Error al cargar las categorías:', error)
        toast.error(`${t('forums.errorLoadingCategories')}. ${t('forums.tryAgain')}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.categoryId])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }
  
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ ...errors, image: t('forums.imageTooLarge') })
      return
    }

    if (!isAcceptedImageFile(file)) {
      setErrors({ ...errors, image: t('forums.invalidImageFormat') })
      return
    }

    if (errors.image) setErrors({ ...errors, image: '' })

    const reader = new FileReader()
    reader.onload = () => {
      setRawImageSrc(reader.result)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleApplyCrop = async () => {
    try {
      const blob = await getCroppedImg(rawImageSrc, croppedAreaPixels)
      const croppedFile = new File([blob], 'forum-cover.jpg', { type: 'image/jpeg' })
      setImage(croppedFile)
      setImagePreview(URL.createObjectURL(blob))
      setShowCropper(false)
      setRawImageSrc(null)
    } catch {
      toast.error('No se pudo recortar la imagen')
    }
  }

  const handleCancelCrop = () => {
    setShowCropper(false)
    setRawImageSrc(null)
  }
  
  const validateForm = () => {
    const newErrors = {}

    // Validar título
    if (formData.title.trim() === '') {
      newErrors.title = 'El título es obligatorio'
    } else {
      const titleValidation = validateLength(
        formData.title,
        LENGTH_LIMITS.FORUM_TITLE.min,
        LENGTH_LIMITS.FORUM_TITLE.max
      )
      if (!titleValidation.valid) {
        newErrors.title = titleValidation.error
      }
    }

    // Validar descripción
    if (formData.description.trim() === '') {
      newErrors.description = 'La descripción es obligatoria'
    } else {
      const descriptionValidation = validateLength(
        formData.description,
        LENGTH_LIMITS.FORUM_DESCRIPTION.min,
        LENGTH_LIMITS.FORUM_DESCRIPTION.max
      )
      if (!descriptionValidation.valid) {
        newErrors.description = descriptionValidation.error
      }
    }

    // Validar categoría
    if (formData.categoryId === '') {
      newErrors.categoryId = 'Selecciona una categoría'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      let response

      // Sanitizar datos antes de enviar
      const sanitizedData = {
        title: sanitizeInput(formData.title.trim(), 'BASIC'),
        description: sanitizeInput(formData.description.trim(), 'BASIC'),
        categoryId: formData.categoryId
      }

      if (isEdit) {
        response = await forumService.updateForum(initialData.id, sanitizedData)

        if (image) {
          response = await forumService.uploadForumImage(initialData.id, image)
        }

        toast.success('¡Foro actualizado con éxito!')
      } else {
        response = await forumService.createForum(sanitizedData)

        if (image) {
          response = await forumService.uploadForumImage(response.id, image)
        }

        toast.success('¡Foro creado con éxito!')
      }

      navigate(`/forums/${response.id}`)
    } catch (error) {
      console.error('Error al guardar el foro:', error)

      let errorMessage = 'Error al guardar el foro. Inténtalo de nuevo.'
      
      if (error.response) {
        const status = error.response.status
        
        if (status === 401) {
          errorMessage = 'Tu sesión ha expirado. Inicia sesión de nuevo.'
          setTimeout(() => navigate('/login?redirect=/forums/create'), 2000)
        } else if (status === 403) {
          errorMessage = 'No tienes permisos para crear foros.'
        } else if (status === 400) {
          errorMessage = 'Los datos del foro no son válidos. Revisa los campos.'
          
          // Manejar errores de validación del backend
          if (error.response.data?.errors) {
            const backendErrors = error.response.data.errors
            const formattedErrors = {}
            Object.keys(backendErrors).forEach(key => {
              formattedErrors[key] = backendErrors[key]
            })
            setErrors(prev => ({ ...prev, ...formattedErrors }))
          }
        } else if (status === 500) {
          errorMessage = 'Error del servidor. Intenta más tarde.'
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor.'
      }

      toast.error(errorMessage, { 
        duration: 5000,
      })
      
      setErrors(prev => ({ ...prev, submit: errorMessage }))
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-fixed border-t-primary"></div>
      </div>
    )
  }
  
  const getImageLabel = () => {
    if (image) {
      return image.name;
    } else if (imagePreview) {
      return t('forums.imageLoaded');
    } else {
      return t('forums.noImageSelected');
    }
  };

  const getButtonContent = () => {
    const buttonText = isEdit ? t('forums.updateButton') : t('forums.createButton');
    const loadingText = isEdit ? t('forums.updating') : t('forums.creating');

    if (isSubmitting) {
      return (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </span>
      );
    }

    return (
      <span>{buttonText}</span>
    );
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-label-lg text-on-surface mb-space-xs">
            {t('forums.formTitle')} <span className="text-error">{t('forums.required')}</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className={`bg-surface-container-low ${errors.title ? 'border-error' : ''}`}
            value={formData.title}
            onChange={handleChange}
            placeholder={t('forums.formTitlePlaceholder')}
            disabled={isSubmitting}
            maxLength={LENGTH_LIMITS.FORUM_TITLE.max}
          />
          <div className="flex justify-between mt-1">
            {errors.title && (
              <p className="text-caption text-error">{errors.title}</p>
            )}
            <p className="text-caption text-on-surface-variant ml-auto">
              {formData.title.length}/{LENGTH_LIMITS.FORUM_TITLE.max}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-label-lg text-on-surface mb-space-xs">
            {t('forums.formDescription')} <span className="text-error">{t('forums.required')}</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className={`bg-surface-container-low ${errors.description ? 'border-error' : ''}`}
            value={formData.description}
            onChange={handleChange}
            placeholder={t('forums.formDescriptionPlaceholder')}
            disabled={isSubmitting}
            maxLength={LENGTH_LIMITS.FORUM_DESCRIPTION.max}
          />
          <div className="flex justify-between mt-1">
            {errors.description && (
              <p className="text-caption text-error">{errors.description}</p>
            )}
            <p className="text-caption text-on-surface-variant ml-auto">
              {formData.description.length}/{LENGTH_LIMITS.FORUM_DESCRIPTION.max}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-label-lg text-on-surface mb-space-xs">
            {t('forums.formContinent')} <span className="text-error">{t('forums.required')}</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className={`bg-surface-container-low ${errors.categoryId ? 'border-error' : ''}`}
            value={formData.categoryId}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="" disabled>{t('forums.selectContinent')}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-caption text-error">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="block text-label-lg text-on-surface mb-space-xs">
            {t('forums.imageOptional')}
          </label>

          <div className="mt-1 flex items-center">
            <input
              id="image"
              name="image"
              type="file"
              accept={ACCEPTED_IMAGE_ACCEPT}
              className="sr-only"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
            <label
              htmlFor="image"
              className="cursor-pointer btn btn-outline"
            >
              {t('forums.selectImage')}
            </label>

            <span className="ml-3 text-body-sm text-on-surface-variant">
              {getImageLabel()}
            </span>
          </div>

          {errors.image && (
            <p className="mt-1 text-caption text-error">{errors.image}</p>
          )}

          {/* ── Crop editor (shown right after file selection) ── */}
          {showCropper && rawImageSrc && (
            <div className="mt-space-md rounded-lg overflow-hidden border border-outline-variant">
              {/* Cropper area */}
              <div className="relative w-full bg-black" style={{ height: '280px' }}>
                <Cropper
                  image={rawImageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              {/* Zoom slider */}
              <div className="bg-surface-container-low px-4 py-3 flex items-center gap-3">
                <svg className="w-4 h-4 text-on-surface-variant shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.05}
                  value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  className="flex-1 accent-primary"
                  aria-label="Zoom"
                />
                <svg className="w-5 h-5 text-on-surface-variant shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {/* Action buttons */}
              <div className="bg-surface-container-low px-4 pb-3 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCancelCrop}
                  className="btn btn-outline"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleApplyCrop}
                  className="btn btn-secondary"
                >
                  Aplicar encuadre
                </button>
              </div>
            </div>
          )}

          {/* ── Preview of cropped result ── */}
          {!showCropper && imagePreview && (
            <div className="mt-4">
              <div className="relative w-full h-48 bg-surface-container rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-error text-on-error rounded-full p-2 hover:opacity-90 transition-opacity shadow-level-2"
                  onClick={() => {
                    setImage(null)
                    setImagePreview('')
                  }}
                  aria-label={t('forums.deleteImage')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            {t('forums.cancel')}
          </button>

          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={isSubmitting}
          >
            {getButtonContent()}
          </button>
        </div>
      </form>
    </div>
  )
}

import PropTypes from 'prop-types'

ForumForm.propTypes = {
  initialData: PropTypes.object,
  isEdit: PropTypes.bool
}

export default ForumForm
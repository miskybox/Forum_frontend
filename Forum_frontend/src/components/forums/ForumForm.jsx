import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useLanguage } from '../../contexts/LanguageContext'
import categoryService from '../../services/categoryService'
import forumService from '../../services/forumService'
import { sanitizeInput, validateLength, LENGTH_LIMITS } from '../../utils/sanitize'

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
      setErrors({
        ...errors,
        image: t('forums.imageTooLarge')
      })
      return
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        image: t('forums.invalidImageFormat')
      })
      return
    }
    
    setImage(file)
    
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    if (errors.image) {
      setErrors({
        ...errors,
        image: ''
      })
    }
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
      console.error('❌ Error al guardar el foro:', error)
      console.error('📋 Detalles:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })

      let errorMessage = 'Error al guardar el foro. Por favor, inténtalo de nuevo.'
      
      if (error.response) {
        const status = error.response.status
        
        if (status === 401) {
          errorMessage = '🔐 Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
          // Redirigir al login después de mostrar el mensaje
          setTimeout(() => {
            navigate('/login?redirect=/forums/create')
          }, 2000)
        } else if (status === 403) {
          errorMessage = '🚫 No tienes permisos para crear foros.'
        } else if (status === 400) {
          errorMessage = error.response.data?.message || 'Los datos del foro no son válidos.'
          
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
          errorMessage = '⚠️ Error del servidor. Por favor, intenta más tarde.'
        } else {
          errorMessage = error.response.data?.message || errorMessage
        }
      } else if (error.request) {
        errorMessage = '🔌 No se pudo conectar con el servidor. Verifica tu conexión.'
      }

      toast.error(errorMessage, { 
        duration: 6000,
        style: {
          background: '#1a1a2e',
          color: '#ff6b6b',
          border: '2px solid #ff6b6b'
        }
      })
      
      setErrors(prev => ({ ...prev, submit: errorMessage }))
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ocean-600"></div>
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
          <label htmlFor="title" className="block text-sm font-bold text-light mb-2 uppercase tracking-wide">
            {t('forums.formTitle')} <span className="text-error">{t('forums.required')}</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className={`input w-full ${errors.title ? 'border-error focus:ring-error' : ''}`}
            value={formData.title}
            onChange={handleChange}
            placeholder={t('forums.formTitlePlaceholder')}
            disabled={isSubmitting}
            maxLength={LENGTH_LIMITS.FORUM_TITLE.max}
          />
          <div className="flex justify-between mt-2">
            {errors.title && (
              <p className="text-sm text-error font-medium">{errors.title}</p>
            )}
            <p className="text-sm text-light-soft ml-auto">
              {formData.title.length}/{LENGTH_LIMITS.FORUM_TITLE.max}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-bold text-light mb-2 uppercase tracking-wide">
            {t('forums.formDescription')} <span className="text-error">{t('forums.required')}</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className={`input w-full ${errors.description ? 'border-error focus:ring-error' : ''}`}
            value={formData.description}
            onChange={handleChange}
            placeholder={t('forums.formDescriptionPlaceholder')}
            disabled={isSubmitting}
            maxLength={LENGTH_LIMITS.FORUM_DESCRIPTION.max}
          />
          <div className="flex justify-between mt-2">
            {errors.description && (
              <p className="text-sm text-error font-medium">{errors.description}</p>
            )}
            <p className="text-sm text-light-soft ml-auto">
              {formData.description.length}/{LENGTH_LIMITS.FORUM_DESCRIPTION.max}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-bold text-light mb-2 uppercase tracking-wide">
            {t('forums.formContinent')} <span className="text-error">{t('forums.required')}</span>
          </label>
          <select
            id="categoryId"
            name="categoryId"
            required
            className={`input w-full ${errors.categoryId ? 'border-error focus:ring-error' : ''}`}
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
            <p className="mt-2 text-sm text-error font-medium">{errors.categoryId}</p>
          )}
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-bold text-light mb-2 uppercase tracking-wide">
            {t('forums.imageOptional')}
          </label>

          <div className="mt-1 flex items-center">
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
            <label
              htmlFor="image"
              className="cursor-pointer bg-dark-lighter py-2 px-4 border-2 border-ocean-500 rounded-lg shadow-sm text-sm font-bold text-forest-500 hover:bg-ocean-500 hover:text-dark transition-all duration-300"
            >
              {t('forums.selectImage')}
            </label>

            <span className="ml-3 text-sm text-light-soft font-medium">
              {getImageLabel()}
            </span>
          </div>

          {errors.image && (
            <p className="mt-2 text-sm text-error font-medium">{errors.image}</p>
          )}

          {imagePreview && (
            <div className="mt-4">
              <div className="relative w-full h-48 bg-dark-lighter rounded-lg overflow-hidden border-2 border-ocean-500">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-error text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
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
            className="bg-dark border-2 border-ocean-500 text-forest-500 px-6 py-3 rounded-lg font-bold uppercase tracking-normal hover:bg-ocean-500 hover:text-dark transition-all duration-300"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            {t('forums.cancel')}
          </button>

          <button
            type="submit"
            className="btn-primary flex-1 py-3"
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
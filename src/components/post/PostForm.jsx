// Archivo: src/components/posts/PostForm.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import postService from '../../services/postService'
import forumService from '../../services/forumService'

const PostForm = ({ initialData = null, isEdit = false }) => {
  const { forumId: paramForumId } = useParams()
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    forumId: paramForumId || '',
    ...initialData
  })
  
  const [forum, setForum] = useState(null)
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState(initialData?.images || [])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const imageInputRef = useRef(null)
  const navigate = useNavigate()
  
  // Cargar información del foro al montar el componente
  useEffect(() => {
    const fetchForum = async () => {
      if (!formData.forumId) {
        setIsLoading(false)
        return
      }
      
      try {
        const forumData = await forumService.getForumById(formData.forumId)
        setForum(forumData)
      } catch (error) {
        console.error('Error al cargar el foro:', error)
        toast.error('No se pudo cargar la información del foro. Por favor, inténtalo de nuevo.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchForum()
  }, [formData.forumId])
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Limpiar error del campo que se está editando
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }
  
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files)
    
    // Verificar cantidad de archivos
    if (files.length + imagePreviews.length > 10) {
      setErrors({
        ...errors,
        images: 'Máximo 10 imágenes permitidas'
      })
      return
    }
    
    // Verificar tamaño y tipo de cada archivo
    let hasErrors = false
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5 MB
        setErrors({
          ...errors,
          images: 'Cada imagen debe ser menor a 5 MB'
        })
        hasErrors = true
        return
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          images: 'Los formatos de imagen deben ser JPEG, PNG, GIF o WEBP'
        })
        hasErrors = true
        return
      }
    })
    
    if (hasErrors) return
    
    // Agregar nuevas imágenes
    setImages([...images, ...files])
    
    // Crear previews de las imágenes
    const newPreviews = files.map(file => {
      return {
        id: `temp-${Date.now()}-${file.name}`,
        url: URL.createObjectURL(file),
        file
      }
    })
    
    setImagePreviews([...imagePreviews, ...newPreviews])
    
    // Limpiar input de archivo para permitir seleccionar los mismos archivos de nuevo
    if (imageInputRef.current) {
      imageInputRef.current.value = null
    }
    
    // Limpiar error de imágenes
    if (errors.images) {
      setErrors({
        ...errors,
        images: ''
      })
    }
  }
  
  const removeImagePreview = (id) => {
    // Si es una imagen existente (con URL del servidor)
    const existingImageIndex = imagePreviews.findIndex(img => img.id === id)
    
    if (existingImageIndex !== -1) {
      const newImagePreviews = [...imagePreviews]
      const removedImage = newImagePreviews.splice(existingImageIndex, 1)[0]
      
      // Si la imagen tiene un archivo asociado (nueva imagen aún no subida)
      if (removedImage.file) {
        const newImages = images.filter(img => img !== removedImage.file)
        setImages(newImages)
      }
      
      setImagePreviews(newImagePreviews)
    }
  }
  
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio'
    } else if (formData.title.length < 5) {
      newErrors.title = 'El título debe tener al menos 5 caracteres'
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es obligatorio'
    } else if (formData.content.length < 10) {
      newErrors.content = 'El contenido debe tener al menos 10 caracteres'
    }
    
    if (!formData.forumId) {
      newErrors.forumId = 'El foro es obligatorio'
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
      
      if (isEdit) {
        // Actualizar publicación existente
        response = await postService.updatePost(initialData.id, formData)
        
        // Si hay nuevas imágenes, subirlas
        if (images.length > 0) {
          response = await postService.uploadPostImages(initialData.id, images)
        }
        
        toast.success('¡Publicación actualizada con éxito!')
      } else {
        // Crear nueva publicación
        response = await postService.createPost(formData)
        
        // Si hay imágenes, subirlas
        if (images.length > 0) {
          response = await postService.uploadPostImages(response.id, images)
        }
        
        toast.success('¡Publicación creada con éxito!')
      }
      
      // Redirigir al detalle de la publicación
      navigate(`/posts/${response.id}`)
    } catch (error) {
      console.error('Error al guardar la publicación:', error)
      toast.error(error.response?.data?.message || 'Error al guardar la publicación. Por favor, inténtalo de nuevo.')
      
      // Manejar errores específicos del backend
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const backendErrors = error.response.data.errors
        const formattedErrors = {}
        
        Object.keys(backendErrors).forEach(key => {
          formattedErrors[key] = backendErrors[key]
        })
        
        setErrors({
          ...errors,
          ...formattedErrors
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!isEdit && !forum) {
    return (
      <div className="text-center py-10">
        <div className="text-red-600 mb-4">Foro no encontrado</div>
        <button 
          onClick={() => navigate('/forums')}
          className="btn btn-primary"
        >
          Ver foros disponibles
        </button>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      {forum && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-neutral-700">
            Publicando en: <span className="text-primary-700">{forum.title}</span>
          </h3>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className={`input w-full ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            value={formData.title}
            onChange={handleChange}
            placeholder="Título de la publicación"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
        
        {/* Contenido */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-1">
            Contenido <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            rows={8}
            required
            className={`input w-full ${errors.content ? 'border-red-500 focus:ring-red-500' : ''}`}
            value={formData.content}
            onChange={handleChange}
            placeholder="Comparte tu experiencia, pregunta o información..."
            disabled={isSubmitting}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>
        
        {/* Imágenes */}
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-neutral-700 mb-1">
            Imágenes (opcional, máximo 10)
          </label>
          
          <div className="mt-1 flex flex-col">
            <input
              id="images"
              name="images"
              type="file"
              ref={imageInputRef}
              multiple
              accept="image/*"
              className="sr-only"
              onChange={handleImagesChange}
              disabled={isSubmitting || imagePreviews.length >= 10}
            />
            
            <label
              htmlFor="images"
              className={`cursor-pointer bg-white py-2 px-3 border border-neutral-300 rounded-md shadow-sm text-sm leading-4 font-medium text-neutral-700 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${imagePreviews.length >= 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Seleccionar imágenes
            </label>
            
            <span className="mt-1 ml-1 text-sm text-neutral-500">
              {imagePreviews.length} de 10 imágenes
            </span>
          </div>
          
          {errors.images && (
            <p className="mt-1 text-sm text-red-600">{errors.images}</p>
          )}
          
          {/* Vista previa de las imágenes */}
          {imagePreviews.length > 0 && (
            <div className="mt-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {imagePreviews.map((image) => (
                  <div key={image.id} className="relative bg-neutral-200 rounded overflow-hidden aspect-square group">
                    <img 
                      src={image.url} 
                      alt="Vista previa" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImagePreview(image.id)}
                      aria-label="Eliminar imagen"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="flex gap-4 pt-2">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          
          {/*
            Extraer el texto del botón a una variable para evitar ternarios anidados en JSX.
          */}
          {(() => {
            let buttonText;
            if (isSubmitting) {
              buttonText = (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEdit ? 'Actualizando...' : 'Publicando...'}
                </span>
              );
            } else {
              buttonText = isEdit ? 'Actualizar Publicación' : 'Publicar';
            }
            return (
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isSubmitting}
              >
                {buttonText}
              </button>
            );
          })()}
        </div>
      </form>
    </div>
  )
}

import PropTypes from 'prop-types'

PostForm.propTypes = {
  initialData: PropTypes.object,
  isEdit: PropTypes.bool
}

export default PostForm
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import forumService from '../../services/forumService'
import postService from '../../services/postService'
import LoadingSpinner from '../common/LoadingSpinner'
import { sanitizeInput, sanitizeArray, validateTag, validateLength, LENGTH_LIMITS } from '../../utils/sanitize'

const PostForm = ({ postId = null, forumId = null }) => {
  const navigate = useNavigate()
  const [forums, setForums] = useState([])
  const [loading, setLoading] = useState(false)
  const [forumLoading, setForumLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    forumId: forumId || '',
    tags: [],
    status: 'ACTIVE'
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchForums = async () => {
      if (!forumId) {
        try {
          setForumLoading(true)
          const data = await forumService.getAllForums()
          setForums(data.content || data)
        } catch (error) {
          console.error('Error al cargar los foros:', error)
          toast.error('No se pudieron cargar los foros')
        } finally {
          setForumLoading(false)
        }
      }
    }

    fetchForums()
  }, [forumId])

  useEffect(() => {
    const fetchPostData = async () => {
      if (postId) {
        try {
          setLoading(true)
          const postData = await postService.getPostById(postId)
          setFormData({
            title: postData.title || '',
            content: postData.content || '',
            forumId: postData.forumId || '',
            tags: postData.tags || [],
            status: postData.status || 'ACTIVE'
          })
        } catch (error) {
          console.error('Error al cargar datos del post:', error)
          toast.error('No se pudo cargar el post para editar')
          navigate('/forums')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchPostData()
  }, [postId, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleAddTag = () => {
    if (!tagInput.trim()) {
      return
    }

    // Validar el tag
    const tagValidation = validateTag(tagInput)

    if (!tagValidation.valid) {
      toast.error(tagValidation.error)
      return
    }

    // Verificar límite de tags
    if (formData.tags.length >= LENGTH_LIMITS.TAG_MAX_COUNT) {
      toast.error(`No puedes agregar más de ${LENGTH_LIMITS.TAG_MAX_COUNT} etiquetas`)
      return
    }

    // Verificar duplicados
    if (formData.tags.includes(tagValidation.cleaned)) {
      toast.error('Esta etiqueta ya fue agregada')
      return
    }

    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tagValidation.cleaned]
    }))
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    // Validar título
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio'
    } else {
      const titleValidation = validateLength(
        formData.title,
        LENGTH_LIMITS.POST_TITLE.min,
        LENGTH_LIMITS.POST_TITLE.max
      )
      if (!titleValidation.valid) {
        newErrors.title = titleValidation.error
      }
    }

    // Validar contenido
    if (!formData.content.trim()) {
      newErrors.content = 'El contenido es obligatorio'
    } else {
      const contentValidation = validateLength(
        formData.content,
        LENGTH_LIMITS.POST_CONTENT.min,
        LENGTH_LIMITS.POST_CONTENT.max
      )
      if (!contentValidation.valid) {
        newErrors.content = contentValidation.error
      }
    }

    // Validar foro
    if (!formData.forumId) {
      newErrors.forumId = 'Debes seleccionar un foro'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)

      // Sanitizar datos antes de enviar
      const sanitizedData = {
        title: sanitizeInput(formData.title.trim(), 'BASIC'),
        content: sanitizeInput(formData.content.trim(), 'MEDIUM'),
        forumId: formData.forumId,
        tags: sanitizeArray(formData.tags, 'STRICT'),
        status: formData.status
      }

      if (postId) {
        await postService.updatePost(postId, sanitizedData)
        toast.success('Post actualizado con éxito')
        navigate(`/posts/${postId}`)
      } else {
        const newPost = await postService.createPost(sanitizedData)
        toast.success('Post creado con éxito')
        navigate(`/posts/${newPost.id}`)
      }
    } catch (error) {
      console.error('Error al guardar el post:', error)
      toast.error(error.response?.data?.message || 'Error al guardar el post')
    } finally {
      setLoading(false)
    }
  }

  if (loading || forumLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="bg-earth-50 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        {postId ? 'Editar publicación' : 'Crear nueva publicación'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="Título de tu publicación"
            maxLength={LENGTH_LIMITS.POST_TITLE.max}
          />
          <div className="flex justify-between mt-1">
            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            <p className="text-sm text-gray-500 ml-auto">{formData.title.length}/{LENGTH_LIMITS.POST_TITLE.max}</p>
          </div>
        </div>

        {!forumId && (
          <div className="mb-4">
            <label htmlFor="forumId" className="block text-sm font-medium text-gray-700 mb-1">Foro</label>
            <select
              id="forumId"
              name="forumId"
              value={formData.forumId}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.forumId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              <option value="">Selecciona un foro</option>
              {forums.map(forum => (
                <option key={forum.id} value={forum.id}>{forum.title}</option>
              ))}
            </select>
            {errors.forumId && <p className="mt-1 text-sm text-red-600">{errors.forumId}</p>}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="8"
            className={`w-full px-3 py-2 border rounded-md ${errors.content ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="Escribe el contenido de tu publicación aquí..."
            maxLength={LENGTH_LIMITS.POST_CONTENT.max}
          />
          <div className="flex justify-between mt-1">
            {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
            <p className="text-sm text-gray-500 ml-auto">{formData.content.length}/{LENGTH_LIMITS.POST_CONTENT.max}</p>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700 mb-1">
            Etiquetas ({formData.tags.length}/{LENGTH_LIMITS.TAG_MAX_COUNT})
          </label>
          <div className="flex">
            <input
              id="tagInput"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Añadir etiqueta"
              maxLength={LENGTH_LIMITS.TAG.max}
              disabled={formData.tags.length >= LENGTH_LIMITS.TAG_MAX_COUNT}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddTag()
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={formData.tags.length >= LENGTH_LIMITS.TAG_MAX_COUNT}
            >
              Añadir
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span key={tag} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="ACTIVE">Activo</option>
            <option value="DRAFT">Borrador</option>
          </select>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            disabled={loading}
          >
            {postId ? 'Actualizar' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  )
}

import PropTypes from 'prop-types'

PostForm.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  forumId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default PostForm

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CategoryCard from './CategoryCard'
import categoryService from '../../services/categoryService'

/**
 * CategoryList - Adventure Explorer Retro Theme with WCAG AA Accessibility
 */
const CategoryList = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await categoryService.getAllCategories()
        setCategories(data)
        setError(null)
      } catch (err) {
        console.error('Error al cargar las categorías:', err)
        setError('No se pudieron cargar las categorías. Por favor, inténtalo de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCategories()
  }, [])
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🌍</div>
          <p className="text-primary-400 font-bold text-sm uppercase tracking-normal">
            CARGANDO CATEGORÍAS...
          </p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-10 card border-error">
        <div className="text-5xl mb-4">⚠️</div>
        <div className="text-error font-bold text-sm uppercase tracking-normal mb-6">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          <span className="flex items-center space-x-2">
            <span>🔄</span>
            <span>REINTENTAR</span>
          </span>
        </button>
      </div>
    )
  }
  
  if (categories.length === 0) {
    return (
      <div className="text-center py-12 card border-primary-600">
        <div className="text-5xl mb-4">🌍</div>
        <h3 className="text-xl font-bold text-primary-500 drop-shadow-md mb-2 uppercase">
          NO HAY CATEGORÍAS DISPONIBLES
        </h3>
        <p className="text-light-soft font-bold text-sm mb-4">
          Vuelve pronto, estamos trabajando en añadir nuevos destinos.
        </p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}

export default CategoryList

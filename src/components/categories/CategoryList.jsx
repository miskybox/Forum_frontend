import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CategoryCard from './CategoryCard'
import categoryService from '../../services/categoryService'

/**
 * CategoryList con estilo retro Adventure
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
          <p className="text-adventure-gold font-retro text-sm uppercase tracking-wider">
            CARGANDO CATEGORÍAS...
          </p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-10 card border-tech-red">
        <div className="text-5xl mb-4">⚠️</div>
        <div className="text-tech-red font-retro text-sm uppercase tracking-wider mb-6">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary text-adventure-dark border-adventure-gold"
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
      <div className="text-center py-12 card border-adventure-gold">
        <div className="text-5xl mb-4">🌍</div>
        <h3 className="text-xl font-display text-adventure-gold neon-text mb-2 uppercase">
          NO HAY CATEGORÍAS DISPONIBLES
        </h3>
        <p className="text-adventure-light font-retro text-sm mb-4 opacity-80">
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

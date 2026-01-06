import { useState, useEffect } from 'react'
import CategoryCard from './CategoryCard'
import categoryService from '../../services/categoryService'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * CategoryList - Paleta única #A0937D #E7D4B5 #F6E6CB #B6C7AA
 */
const CategoryList = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await categoryService.getAllCategories()
        setCategories(data)
        setError(null)
      } catch (err) {
        console.error('Error al cargar las categorías:', err)
        setError(t('categories.error'))
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [t])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🌍</div>
          <p className="text-accent font-bold text-sm uppercase tracking-normal">
            {t('categories.loading')}
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
          onClick={() => globalThis.location.reload()}
          className="btn btn-primary"
        >
          <span className="flex items-center space-x-2">
            <span>🔄</span>
            <span>{t('categories.retry')}</span>
          </span>
        </button>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 card border-secondary">
        <div className="text-5xl mb-4">🌍</div>
        <h3 className="text-xl font-bold text-accent drop-shadow-md mb-2 uppercase">
          {t('categories.noCategories')}
        </h3>
        <p className="text-text-light font-bold text-sm mb-4">
          {t('categories.suggestion')}
        </p>
      </div>
    )
  }

  return (
    <div className="mb-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}

export default CategoryList

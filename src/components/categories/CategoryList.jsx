import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import CategoryCard from './CategoryCard'
import categoryService from '../../services/categoryService'
import { useLanguage } from '../../contexts/LanguageContext'

/**
 * CategoryList - Paleta única #A0937D #E7D4B5 #F6E6CB #B6C7AA
 */
const CategoryList = ({ typeFilter = null }) => {
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

  const displayCategories = (typeFilter
    ? categories.filter(c => c.type === typeFilter)
    : categories
  ).slice().sort((a, b) => a.name.localeCompare(b.name, 'es'))

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-golden border-t-transparent mx-auto mb-4" />
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
        <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <div className="text-error font-bold text-sm uppercase tracking-normal mb-6">
          {error}
        </div>
        <button
          onClick={() => globalThis.location.reload()}
          className="btn btn-primary flex items-center gap-2 mx-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <span>{t('categories.retry')}</span>
        </button>
      </div>
    )
  }

  if (displayCategories.length === 0) {
    return (
      <div className="text-center py-12 card border-secondary">
        <div className="w-16 h-16 mx-auto mb-4 bg-golden/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
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
      <div className={`grid gap-4 ${displayCategories.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3'}`}>
        {displayCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}

CategoryList.propTypes = {
  typeFilter: PropTypes.string,
}

export default CategoryList

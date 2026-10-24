import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { MdErrorOutline, MdPublic } from 'react-icons/md'
import CategoryCard from './CategoryCard'
import EmptyState from '../ui/EmptyState'
import categoryService from '../../services/categoryService'
import { useLanguage } from '../../contexts/LanguageContext'

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
        setError(err.userMessage || t('categories.error'))
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
      <output className="block text-center py-space-xl" aria-live="polite">
        <span className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-fixed border-t-primary" aria-hidden="true" />
        <span className="block mt-space-sm text-body-sm text-on-surface-variant">{t('categories.loading')}</span>
      </output>
    )
  }

  if (error) {
    return (
      <EmptyState
        icon={MdErrorOutline}
        title={error}
        action={
          <button type="button" onClick={() => globalThis.location.reload()} className="btn btn-primary">
            {t('categories.retry')}
          </button>
        }
      />
    )
  }

  if (displayCategories.length === 0) {
    return <EmptyState icon={MdPublic} title={t('categories.noCategories')} description={t('categories.suggestion')} />
  }

  return (
    <div className="grid gap-space-lg grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {displayCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  )
}

CategoryList.propTypes = {
  typeFilter: PropTypes.string,
}

export default CategoryList

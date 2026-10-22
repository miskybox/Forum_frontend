import { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ForumCard from './ForumCard'
import ForumSearch from './ForumSearch'
import forumService from '../../services/forumService'
import categoryService from '../../services/categoryService'
import useAuth from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import PropTypes from 'prop-types'
import { MdAddCircleOutline, MdErrorOutline, MdForum, MdSearchOff } from 'react-icons/md'
import EmptyState from '../ui/EmptyState'

const ForumList = ({ categoryId: propCategoryId }) => {
  const { categoryId: paramCategoryId } = useParams()
  const categoryId = propCategoryId || paramCategoryId

  const [forums, setForums] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchTerm = searchParams.get('q') || ''

  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchForums = async () => {
      try {
        setLoading(true)

        let forumData = []

        if (categoryId) {
          forumData = await forumService.getForumsByCategory(categoryId)
          const categoryData = await categoryService.getCategoryById(categoryId)
          setCategory(categoryData)
        } else if (searchTerm) {
          forumData = await forumService.searchForums(searchTerm)
        } else {
          const response = await forumService.getAllForums()
          forumData = response.content || response
        }

        setForums(Array.isArray(forumData) ? forumData : forumData?.content || [])
        setError(null)
      } catch (err) {
        console.error('Error al cargar los foros:', err)
        setError(err.userMessage || t('forumList.errorLoading'))
      } finally {
        setLoading(false)
      }
    }

    fetchForums()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, searchTerm])

  // The search term lives in the URL (?q=) so it can be shared and set from the home hero
  const handleSearch = (term) => {
    setSearchParams(term ? { q: term } : {})
  }

  const createAction = isAuthenticated ? (
    <Link to="/forums/create" className="btn btn-primary">
      <MdAddCircleOutline aria-hidden="true" />
      {t('forumList.createFirstForum')}
    </Link>
  ) : (
    <Link to="/login" className="btn btn-outline">
      {t('forumList.login')}
    </Link>
  )

  let heading = t('forumList.allForums')
  if (category) heading = `${t('forumList.forumsOf')} ${category.name}`
  else if (searchTerm) heading = `${t('forumList.searchResults')}: "${searchTerm}"`

  let content
  if (loading) {
    content = (
      <output className="block text-center py-space-xl" aria-live="polite">
        <span className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-primary-fixed border-t-primary" aria-hidden="true" />
        <span className="block mt-space-sm text-body-sm text-on-surface-variant">{t('forumList.loadingForums')}</span>
      </output>
    )
  } else if (error) {
    content = (
      <EmptyState
        icon={MdErrorOutline}
        title={error}
        action={
          <button type="button" onClick={() => globalThis?.window?.location?.reload?.()} className="btn btn-primary">
            {t('forumList.retry')}
          </button>
        }
      />
    )
  } else if (forums.length === 0 && searchTerm) {
    content = (
      <EmptyState
        icon={MdSearchOff}
        title={t('forumList.noResults')}
        description={`${t('forumList.noResultsFor')} "${searchTerm}"`}
        action={
          <button type="button" onClick={() => handleSearch('')} className="btn btn-outline">
            {t('forumList.viewAll')}
          </button>
        }
      />
    )
  } else if (forums.length === 0) {
    content = (
      <EmptyState
        icon={MdForum}
        title={category ? t('forumList.noCategoryForums') : t('forumList.noForums')}
        description={category ? `${t('forumList.beFirstCategory')} ${category.name}` : t('forumList.beFirst')}
        action={createAction}
      />
    )
  } else {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-lg">
        {forums.map((forum) => (
          <ForumCard key={forum.id} forum={forum} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-space-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-space-md">
        <h2 className="font-headline text-headline-md text-on-surface">
          {heading}
          {!loading && !error && forums.length > 0 && (
            <span className="ml-space-sm align-middle px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-label-md font-body">
              {forums.length}
            </span>
          )}
        </h2>
        <ForumSearch onSearch={handleSearch} initialValue={searchTerm} />
      </div>
      {content}
    </div>
  )
}
ForumList.propTypes = {
  categoryId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

export default ForumList

import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ForumCard from './ForumCard'
import ForumSearch from './ForumSearch'
import forumService from '../../services/forumService'
import categoryService from '../../services/categoryService'
import useAuth from '../../hooks/useAuth'
import { useLanguage } from '../../contexts/LanguageContext'
import PropTypes from 'prop-types'

/**
 * ForumList - Nueva paleta del logo
 * Teal (#5A8A7A), Terracota (#A67C52), Dark Green (#3D5F54)
 */
const ForumList = ({ categoryId: propCategoryId }) => {
  const { categoryId: paramCategoryId } = useParams()
  const categoryId = propCategoryId || paramCategoryId

  const [forums, setForums] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

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

        setForums(forumData)
        setError(null)
      } catch (err) {
        console.error('Error al cargar los foros:', err)
        setError(t('forumList.errorLoading'))
      } finally {
        setLoading(false)
      }
    }

    fetchForums()
  }, [categoryId, searchTerm])

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-golden border-t-transparent mx-auto mb-4" />
          <p className="text-secondary font-display text-sm">
            {t('forumList.loadingForums')}
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
        <div className="text-error font-display text-sm uppercase tracking-wide mb-6">
          {error}
        </div>
        <button
          onClick={() => globalThis?.window?.location?.reload?.()}
          className="btn btn-primary"
        >
          {t('forumList.retry')}
        </button>
      </div>
    )
  }

  let heading;
  if (category) {
    heading = (
      <h2 className="text-2xl md:text-3xl font-bold text-text">
        {t('forumList.forumsOf')} {category.name}
      </h2>
    );
  } else if (searchTerm) {
    heading = (
      <h2 className="text-2xl md:text-3xl font-bold text-text">
        {t('forumList.searchResults')}: "{searchTerm}"
      </h2>
    );
  } else {
    heading = (
      <h2 className="text-2xl md:text-3xl font-bold text-text">
        {t('forumList.allForums')}
      </h2>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {heading}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <ForumSearch onSearch={handleSearch} initialValue={searchTerm} />

          {isAuthenticated && (
            <Link to="/forums/create" className="btn btn-primary whitespace-nowrap text-center">
              {t('forumList.createForum')}
            </Link>
          )}
        </div>
      </div>

      {(() => {
        let emptyStateContent;
        if (searchTerm) {
          emptyStateContent = (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-aqua/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-2">
                {t('forumList.noResults')}
              </h3>
              <p className="text-text-light font-display text-sm mb-6">
                {t('forumList.noResultsFor')} "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="btn btn-outline"
              >
                {t('forumList.viewAll')}
              </button>
            </>
          );
        } else if (category) {
          emptyStateContent = (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-golden/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-2">
                {t('forumList.noCategoryForums')}
              </h3>
              <p className="text-text-light font-display text-sm mb-6">
                {t('forumList.beFirstCategory')} {category.name}
              </p>
              {isAuthenticated ? (
                <Link to="/forums/create" className="btn btn-primary">
                  {t('forumList.createFirstForum')}
                </Link>
              ) : (
                <Link to="/login" className="btn btn-outline">
                  {t('forumList.login')}
                </Link>
              )}
            </>
          );
        } else {
          emptyStateContent = (
            <>
              <div className="w-16 h-16 mx-auto mb-4 bg-midnight/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-midnight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="text-xl font-bold text-text mb-2">
                {t('forumList.noForums')}
              </h3>
              <p className="text-text-light font-display text-sm mb-6">
                {t('forumList.beFirst')}
              </p>
              {isAuthenticated ? (
                <Link to="/forums/create" className="btn btn-primary">
                  {t('forumList.createFirstForum')}
                </Link>
              ) : (
                <Link to="/login" className="btn btn-outline">
                  {t('forumList.login')}
                </Link>
              )}
            </>
          );
        }

        return forums.length === 0 ? (
          <div className="text-center py-12 card">
            {emptyStateContent}
          </div>
        ) : (
          <div className="space-y-4">
            {forums.map((forum) => (
              <ForumCard key={forum.id} forum={forum} />
            ))}
          </div>
        );
      })()}
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

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
 * ForumList con estilo retro Adventure
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
          <div className="text-6xl mb-4 animate-spin">🏺</div>
          <p className="text-accent font-display text-sm">
            {t('forumList.loadingForums')}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10 card border-error">
        <div className="text-5xl mb-4">⚠️</div>
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
      <h2 className="text-2xl md:text-3xl font-bold text-accent-dark">
        {t('forumList.forumsOf')} {category.name}
      </h2>
    );
  } else if (searchTerm) {
    heading = (
      <h2 className="text-2xl md:text-3xl font-bold text-accent-dark">
        {t('forumList.searchResults')}: "{searchTerm}"
      </h2>
    );
  } else {
    heading = (
      <h2 className="text-2xl md:text-3xl font-bold text-accent-dark">
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
        
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
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
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-accent-dark mb-2">
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
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-accent-dark mb-2">
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
              <div className="text-5xl mb-4">🏺</div>
              <h3 className="text-xl font-bold text-accent-dark mb-2">
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

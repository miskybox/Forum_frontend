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
          <p className="text-adventure-gold font-retro text-sm uppercase tracking-normal">
            {t('forumList.loadingForums').toUpperCase()}
          </p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-10 card border-tech-red">
        <div className="text-5xl mb-4">⚠️</div>
        <div className="text-tech-red font-retro text-sm uppercase tracking-normal mb-6">
          {error}
        </div>
        <button
          onClick={() => globalThis?.window?.location?.reload?.()}
          className="btn btn-primary text-adventure-dark border-adventure-gold"
        >
          <span className="flex items-center space-x-2">
            <span>🔄</span>
            <span>{t('forumList.retry').toUpperCase()}</span>
          </span>
        </button>
      </div>
    )
  }
  
  let heading;
  if (category) {
    heading = (
      <h2 className="text-2xl md:text-3xl font-bold text-adventure-gold neon-text">
        {t('forumList.forumsOf').toUpperCase()} {category.name.toUpperCase()}
      </h2>
    );
  } else if (searchTerm) {
    heading = (
      <h2 className="text-2xl md:text-3xl font-bold text-adventure-gold neon-text">
        {t('forumList.searchResults').toUpperCase()}: "{searchTerm.toUpperCase()}"
      </h2>
    );
  } else {
    heading = (
      <h2 className="text-2xl md:text-3xl font-bold text-adventure-gold neon-text">
        {t('forumList.allForums').toUpperCase()}
      </h2>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {heading}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <ForumSearch onSearch={handleSearch} initialValue={searchTerm} />
          
          {isAuthenticated && (
            <Link to="/forums/create" className="btn btn-primary text-adventure-dark border-adventure-gold whitespace-nowrap">
              <span className="flex items-center space-x-2">
                <span>➕</span>
                <span>{t('forumList.createForum').toUpperCase()}</span>
              </span>
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
              <h3 className="text-xl font-bold text-adventure-gold neon-text mb-2 uppercase">
                {t('forumList.noResults').toUpperCase()}
              </h3>
              <p className="text-adventure-light font-retro text-sm mb-6 opacity-80">
                {t('forumList.noResultsFor')} "{searchTerm}"
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="btn btn-outline text-adventure-gold border-adventure-gold"
              >
                <span className="flex items-center space-x-2">
                  <span>🏺</span>
                  <span>{t('forumList.viewAll').toUpperCase()}</span>
                </span>
              </button>
            </>
          );
        } else if (category) {
          emptyStateContent = (
            <>
              <div className="text-5xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-adventure-gold neon-text mb-2 uppercase">
                {t('forumList.noCategoryForums').toUpperCase()}
              </h3>
              <p className="text-adventure-light font-retro text-sm mb-6 opacity-80">
                {t('forumList.beFirstCategory')} {category.name}
              </p>
              {isAuthenticated ? (
                <Link to="/forums/create" className="btn btn-primary text-adventure-dark border-adventure-gold">
                  <span className="flex items-center space-x-2">
                    <span>⚱️</span>
                    <span>{t('forumList.createFirstForum').toUpperCase()}</span>
                  </span>
                </Link>
              ) : (
                <Link to="/login" className="btn btn-outline text-adventure-gold border-adventure-gold">
                  <span className="flex items-center space-x-2">
                    <span>🔐</span>
                    <span>{t('forumList.login').toUpperCase()}</span>
                  </span>
                </Link>
              )}
            </>
          );
        } else {
          emptyStateContent = (
            <>
              <div className="text-5xl mb-4">🏺</div>
              <h3 className="text-xl font-bold text-adventure-gold neon-text mb-2 uppercase">
                {t('forumList.noForums').toUpperCase()}
              </h3>
              <p className="text-adventure-light font-retro text-sm mb-6 opacity-80">
                {t('forumList.beFirst')}
              </p>
              {isAuthenticated ? (
                <Link to="/forums/create" className="btn btn-primary text-adventure-dark border-adventure-gold">
                  <span className="flex items-center space-x-2">
                    <span>⚱️</span>
                    <span>{t('forumList.createFirstForum').toUpperCase()}</span>
                  </span>
                </Link>
              ) : (
                <Link to="/login" className="btn btn-outline text-adventure-gold border-adventure-gold">
                  <span className="flex items-center space-x-2">
                    <span>🔐</span>
                    <span>{t('forumList.login').toUpperCase()}</span>
                  </span>
                </Link>
              )}
            </>
          );
        }

        return forums.length === 0 ? (
          <div className="text-center py-12 card border-adventure-gold">
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

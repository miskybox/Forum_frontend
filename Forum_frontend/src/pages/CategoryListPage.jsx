// Archivo: src/pages/CategoryListPage.jsx
import { Link } from 'react-router-dom'
import CategoryList from '../components/categories/CategoryList'
import { useLanguage } from '../contexts/LanguageContext'

const CategoryListPage = () => {
  const { t } = useLanguage()
  
  return (
    <div className="bg-earth-50 py-8 sm:py-12">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-earth-800 mb-4">{t('categories.exploreByContinent')}</h1>
          <p className="text-lg text-earth-600 max-w-2xl mx-auto">
            {t('categories.description')}
          </p>
        </div>
        
        <CategoryList />
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-earth-800 mb-4">{t('categories.notFindingWhat')}</h2>
          <p className="text-earth-600 mb-6">
            {t('categories.suggestion')}
          </p>
          <Link to="/forums" className="btn btn-primary">
            {t('home.viewAllForums')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CategoryListPage
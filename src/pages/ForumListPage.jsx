import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MdAddCircleOutline, MdForum } from 'react-icons/md'
import ForumList from '../components/forums/ForumList'
import CategoryChannels from '../components/home/CategoryChannels'
import SectionCard from '../components/ui/SectionCard'
import categoryService from '../services/categoryService'
import useAuth from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'
import Seo from '../components/common/SEO'

const ForumListPage = () => {
  const { categoryId } = useParams()
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    categoryService
      .getAllCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : data?.content || []))
      .catch(() => setCategories([]))
  }, [])

  return (
    <div className="flex flex-col w-full">
      <Seo
        title="Foros de viaje"
        description="Explora y participa en foros de viaje por destinos, consejos, rutas y experiencias de viajeros de todo el mundo."
        url="/forums"
      />

      <header className="relative overflow-hidden bg-gradient-to-b from-surface-container-high/80 via-surface-container-low to-background">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-secondary-fixed/25 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-gutter-sm lg:px-gutter-lg pt-space-xl pb-space-lg">
          <p className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-md mb-space-sm">
            <MdForum className="text-title-md" aria-hidden="true" />
            {t('forums.eyebrow')}
          </p>
          <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface max-w-3xl">
            {t('forums.title')}
          </h1>
          <p className="mt-space-xs text-body-lg text-on-surface-variant max-w-2xl">{t('forums.intro')}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-gutter-sm lg:px-gutter-lg py-margin">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
          <section className="lg:col-span-8">
            <ForumList categoryId={categoryId} />
          </section>

          <aside className="lg:col-span-4 flex flex-col gap-space-lg">
            <div className="bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-lg p-space-lg shadow-level-2">
              <h2 className="font-headline text-headline-sm text-on-primary">{t('forums.createCtaTitle')}</h2>
              <p className="mt-space-xs text-body-sm text-on-primary/90">{t('forums.createCtaText')}</p>
              <Link
                to={isAuthenticated ? '/forums/create' : '/register'}
                className="mt-space-md w-full inline-flex items-center justify-center gap-space-xs py-3 px-space-lg rounded-full bg-surface-container-lowest hover:bg-surface-bright text-primary hover:text-primary text-label-lg shadow-level-1 transition-colors"
              >
                <MdAddCircleOutline className="text-title-md" aria-hidden="true" />
                {isAuthenticated ? t('forums.createNew') : t('forums.joinToCreate')}
              </Link>
            </div>

            {categories.length > 0 ? (
              <CategoryChannels categories={categories} />
            ) : (
              <SectionCard title={t('forums.categories')}>
                <Link to="/categories" className="text-label-lg">{t('forums.categories')}</Link>
              </SectionCard>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ForumListPage

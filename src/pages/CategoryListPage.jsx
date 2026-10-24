import { Link } from 'react-router-dom'
import { MdArrowForward, MdPublic } from 'react-icons/md'
import CategoryList from '../components/categories/CategoryList'
import { useLanguage } from '../contexts/LanguageContext'

const CategoryListPage = () => {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col w-full">
      <header className="relative overflow-hidden bg-gradient-to-b from-surface-container-high/80 via-surface-container-low to-background">
        <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-primary-fixed/25 blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-gutter-sm lg:px-gutter-lg pt-space-xl pb-space-lg">
          <p className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-md mb-space-sm">
            <MdPublic className="text-title-md" aria-hidden="true" />
            {t('forums.categories')}
          </p>
          <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface">
            {t('categories.exploreByContinent')}
          </h1>
          <p className="mt-space-xs text-body-lg text-on-surface-variant max-w-2xl">{t('categories.description')}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-gutter-sm lg:px-gutter-lg py-margin space-y-margin-lg">
        <section aria-labelledby="continents-title" className="space-y-space-md">
          <h2 id="continents-title" className="font-headline text-headline-md text-on-surface">{t('home.byContinent')}</h2>
          <CategoryList typeFilter="CONTINENT" />
        </section>

        <section aria-labelledby="channels-title" className="space-y-space-md">
          <h2 id="channels-title" className="font-headline text-headline-md text-on-surface">{t('home.channels')}</h2>
          <CategoryList typeFilter="GENERAL" />
        </section>

        <section className="bg-surface-container-low rounded-lg p-space-lg text-center">
          <h2 className="font-headline text-headline-sm text-on-surface">{t('categories.notFindingWhat')}</h2>
          <p className="mt-space-xs text-body-sm text-on-surface-variant max-w-xl mx-auto">{t('categories.suggestion')}</p>
          <Link to="/forums" className="btn btn-primary mt-space-md">
            {t('home.viewAllForums')}
            <MdArrowForward aria-hidden="true" />
          </Link>
        </section>
      </div>
    </div>
  )
}

export default CategoryListPage

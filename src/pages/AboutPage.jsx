import { MdEco, MdPublic } from 'react-icons/md'
import { useLanguage } from '../contexts/LanguageContext'
import ContentPageLayout from '../components/common/ContentPageLayout'
import Seo from '../components/common/SEO'

const AboutPage = () => {
  const { t } = useLanguage()

  return (
    <>
      <Seo
        title="Sobre nosotros"
        description="Conoce ForumViajeros, la comunidad de viajeros donde compartir experiencias, rutas y consejos de viaje de todo el mundo."
        url="/about"
      />
      <ContentPageLayout eyebrow={t('nav.tagline')} icon={MdPublic} title={t('about.title')} lead={t('about.description1')}>
        <section className="bg-surface-container-lowest rounded-lg p-space-lg shadow-level-1">
          <p className="text-body-lg text-on-surface">{t('about.description2')}</p>
        </section>
        <section className="bg-gradient-to-br from-tertiary-container/30 to-surface-container rounded-lg p-space-lg">
          <h2 className="flex items-center gap-space-xs font-body text-label-lg uppercase tracking-wider text-secondary">
            <MdEco className="text-title-md" aria-hidden="true" />
            {t('footer.manifestoTitle')}
          </h2>
          <p className="mt-space-sm font-headline text-headline-sm text-on-surface italic">{t('home.responsibleQuote')}</p>
          <p className="mt-space-sm text-body-md text-on-surface-variant">{t('footer.manifesto')}</p>
        </section>
      </ContentPageLayout>
    </>
  )
}

export default AboutPage

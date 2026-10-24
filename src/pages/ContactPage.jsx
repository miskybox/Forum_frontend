import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { FaXTwitter, FaTiktok } from 'react-icons/fa6'
import { MdMail, MdPeople } from 'react-icons/md'
import { useLanguage } from '../contexts/LanguageContext'
import ContentPageLayout from '../components/common/ContentPageLayout'
import Seo from '../components/common/SEO'

const CONTACT_EMAIL = 'contacto@forumviajeros.com'

const socialClass =
  'w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors'

const ContactPage = () => {
  const { t } = useLanguage()

  return (
    <>
      <Seo
        title="Contacto"
        description="Contacta con el equipo de ForumViajeros. Estamos aquí para ayudarte con cualquier duda sobre nuestra comunidad de viajeros."
        url="/contact"
      />
      <ContentPageLayout eyebrow={t('nav.tagline')} icon={MdMail} title={t('contact.title')} lead={t('contact.subtitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-lg">
          <section className="bg-surface-container-lowest rounded-lg p-space-lg shadow-level-1">
            <h2 className="flex items-center gap-space-xs font-body text-title-md text-on-surface">
              <MdMail className="text-secondary" aria-hidden="true" />
              {t('contact.email')}
            </h2>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-space-sm inline-block text-body-md font-semibold break-all">
              {CONTACT_EMAIL}
            </a>
          </section>
          <section className="bg-surface-container-lowest rounded-lg p-space-lg shadow-level-1">
            <h2 className="flex items-center gap-space-xs font-body text-title-md text-on-surface">
              <MdPeople className="text-secondary" aria-hidden="true" />
              {t('contact.socialNetworks')}
            </h2>
            <p className="mt-space-sm text-body-sm text-on-surface-variant">{t('contact.socialDescription')}</p>
            <div className="mt-space-md flex items-center gap-space-xs">
              <a href="https://www.facebook.com/forumviajeros" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label={t('footer.visitFacebook')}><FaFacebook aria-hidden="true" /></a>
              <a href="https://www.instagram.com/forumviajeros/" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label={t('footer.visitInstagram')}><FaInstagram aria-hidden="true" /></a>
              <a href="https://x.com/forumviajeros" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label={t('footer.visitX')}><FaXTwitter aria-hidden="true" /></a>
              <a href="https://www.tiktok.com/@forumviajeros" target="_blank" rel="noopener noreferrer" className={socialClass} aria-label={t('footer.visitTikTok')}><FaTiktok aria-hidden="true" /></a>
            </div>
          </section>
        </div>
      </ContentPageLayout>
    </>
  )
}

export default ContactPage

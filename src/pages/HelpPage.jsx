import { MdExpandMore, MdHelpOutline } from 'react-icons/md'
import { useLanguage } from '../contexts/LanguageContext'
import ContentPageLayout from '../components/common/ContentPageLayout'

const HelpPage = () => {
  const { t } = useLanguage()

  const faqs = [
    { question: t('help.howCreateForum'), answer: t('help.howCreateForumAnswer') },
    { question: t('help.howPlayTrivia'), answer: t('help.howPlayTriviaAnswer') },
    { question: t('help.howEditProfile'), answer: t('help.howEditProfileAnswer') },
  ]

  return (
    <ContentPageLayout eyebrow={t('help.title')} icon={MdHelpOutline} title={t('help.faqTitle')}>
      <div className="space-y-space-sm">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            className="group bg-surface-container-lowest rounded-lg shadow-level-1 open:shadow-level-2 transition-shadow"
            open={index === 0}
          >
            <summary className="flex items-center justify-between gap-space-sm p-space-md sm:p-space-lg cursor-pointer list-none font-body text-title-md text-on-surface [&::-webkit-details-marker]:hidden">
              <h2 className="font-body text-title-md">{faq.question}</h2>
              <MdExpandMore className="text-headline-sm text-on-surface-variant transition-transform group-open:rotate-180 flex-shrink-0" aria-hidden="true" />
            </summary>
            <p className="px-space-md sm:px-space-lg pb-space-md sm:pb-space-lg text-body-md text-on-surface-variant">{faq.answer}</p>
          </details>
        ))}
      </div>
    </ContentPageLayout>
  )
}

export default HelpPage

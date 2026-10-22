// Archivo: src/pages/ForumCreatePage.jsx
import { useLanguage } from '../contexts/LanguageContext'
import ForumForm from '../components/forums/ForumForm'
import FormPageLayout from '../components/common/FormPageLayout'

const ForumCreatePage = () => {
  const { t } = useLanguage()

  return (
    <FormPageLayout
      title={t('forums.createNew')}
      description={t('forums.createDescription')}
      backTo="/forums"
      backLabel={t('forums.backToForums')}
      tipsTitle={t('forums.tipsTitle')}
      tips={[
        `${t('forums.tipDescriptiveTitle')} ${t('forums.tipDescriptiveTitleText')}`,
        `${t('forums.tipFullDescription')} ${t('forums.tipFullDescriptionText')}`,
        `${t('forums.tipAppropriateCategory')} ${t('forums.tipAppropriateCategoryText')}`,
        `${t('forums.tipBeSpecific')} ${t('forums.tipBeSpecificText')}`,
      ]}
    >
      <ForumForm />
    </FormPageLayout>
  )
}

export default ForumCreatePage
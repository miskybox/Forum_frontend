import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { MdArrowBack, MdCheckCircle } from 'react-icons/md'
import SectionCard from '../ui/SectionCard'

/**
 * Shell for create/edit pages: header with back link, form card and an optional tips rail.
 */
const FormPageLayout = ({ title, description, backTo, backLabel, tipsTitle, tips = [], children }) => (
  <div className="max-w-7xl mx-auto w-full px-gutter-sm lg:px-gutter-lg py-margin">
    <Link to={backTo} className="inline-flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary">
      <MdArrowBack aria-hidden="true" />
      {backLabel}
    </Link>
    <header className="mt-space-sm mb-space-lg max-w-3xl">
      <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface">{title}</h1>
      {description && <p className="mt-space-xs text-body-lg text-on-surface-variant">{description}</p>}
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
      <div className={`${tips.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12 max-w-3xl'} bg-surface-container-lowest rounded-lg p-space-md sm:p-space-lg shadow-level-1`}>
        {children}
      </div>

      {tips.length > 0 && (
        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <SectionCard title={tipsTitle}>
            <ul className="space-y-space-sm">
              {tips.map((tip) => (
                <li key={tip} className="flex items-start gap-space-sm text-body-sm text-on-surface-variant">
                  <MdCheckCircle className="text-title-md text-secondary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </aside>
      )}
    </div>
  </div>
)

FormPageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node,
  backTo: PropTypes.string.isRequired,
  backLabel: PropTypes.string.isRequired,
  tipsTitle: PropTypes.string,
  tips: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node.isRequired,
}

export default FormPageLayout

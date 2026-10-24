import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

/**
 * Label-md trail with `/` separators. The last item is the current page.
 */
const Breadcrumb = ({ items = [], label, className = '' }) => (
  <nav aria-label={label} className={className}>
    <ol className="flex flex-wrap items-center gap-space-xs text-label-md text-on-surface-variant">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const Icon = item.icon
        const content = (
          <>
            {Icon && <Icon className="text-body-md" aria-hidden="true" />}
            <span>{item.label}</span>
          </>
        )

        return (
          <Fragment key={`${item.to ?? ''}-${item.label}-${index}`}>
            {index > 0 && (
              <li aria-hidden="true" className="text-outline">/</li>
            )}
            <li
              aria-current={isLast ? 'page' : undefined}
              className={isLast ? 'text-on-surface font-semibold truncate max-w-xs sm:max-w-md' : undefined}
            >
              {isLast || !item.to ? (
                <span className="inline-flex items-center gap-1">{content}</span>
              ) : (
                <Link
                  to={item.to}
                  className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary"
                >
                  {content}
                </Link>
              )}
            </li>
          </Fragment>
        )
      })}
    </ol>
  </nav>
)

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      to: PropTypes.string,
      icon: PropTypes.elementType,
    })
  ),
  label: PropTypes.string,
  className: PropTypes.string,
}

export default Breadcrumb

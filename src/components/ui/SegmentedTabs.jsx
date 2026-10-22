import { useRef } from 'react'
import PropTypes from 'prop-types'

/**
 * Pill-shaped tab list (WAI-ARIA tabs pattern).
 * Panels must use id `${idPrefix}-panel-${tab.id}` and aria-labelledby `${idPrefix}-tab-${tab.id}`.
 */
const SegmentedTabs = ({ tabs, activeId, onChange, idPrefix, label, className = '' }) => {
  const tabRefs = useRef({})

  const focusTab = (index) => {
    const tab = tabs[(index + tabs.length) % tabs.length]
    onChange(tab.id)
    tabRefs.current[tab.id]?.focus()
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      focusTab(index + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      focusTab(index - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusTab(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusTab(tabs.length - 1)
    }
  }

  return (
    <div className={`bg-surface-container-lowest rounded-full p-1.5 shadow-level-1 overflow-x-auto ${className}`}>
      <div role="tablist" aria-label={label} className="flex items-center gap-1 min-w-max">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeId
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[tab.id] = el }}
              type="button"
              role="tab"
              id={`${idPrefix}-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`${idPrefix}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`px-space-md py-space-xs rounded-full text-label-lg flex items-center gap-space-xs transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-secondary text-on-secondary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {Icon && <Icon className="text-body-md" aria-hidden="true" />}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

SegmentedTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
    })
  ).isRequired,
  activeId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  idPrefix: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default SegmentedTabs

import PropTypes from 'prop-types'

const WIDTH = {
  wide: 'max-w-7xl',
  narrow: 'max-w-3xl',
}

/**
 * Horizontal page shell: max width plus gutters that grow with the breakpoint.
 */
const PageContainer = ({ as = 'div', width = 'wide', className = '', children, ...props }) => {
  const Tag = as
  return (
    <Tag
      className={`w-full mx-auto px-gutter-sm md:px-gutter lg:px-gutter-lg ${WIDTH[width] || WIDTH.wide} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}

PageContainer.propTypes = {
  as: PropTypes.elementType,
  width: PropTypes.oneOf(Object.keys(WIDTH)),
  className: PropTypes.string,
  children: PropTypes.node,
}

export default PageContainer

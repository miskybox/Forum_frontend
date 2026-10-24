import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

/**
 * Surface card: elevation level 1, level 2 on hover. Use `as` to change the
 * element, or `to` / `href` to make the whole card a link.
 */
const Card = ({
  as = 'article',
  to,
  href,
  hover = true,
  padded = true,
  className = '',
  children,
  ...props
}) => {
  const classes = [
    'card',
    hover ? '' : 'card-static',
    padded ? '' : 'p-0',
    to || href ? 'block no-underline text-inherit' : '',
    className,
  ].filter(Boolean).join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  const Tag = as
  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  )
}

Card.propTypes = {
  as: PropTypes.elementType,
  to: PropTypes.string,
  href: PropTypes.string,
  hover: PropTypes.bool,
  padded: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
}

export default Card

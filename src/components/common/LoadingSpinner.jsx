import React from 'react'
import PropTypes from 'prop-types'

/**
 * LoadingSpinner con estilo retro
 */
const LoadingSpinner = ({ size = 'medium', theme = 'adventure' }) => {
  let dimensions
  let icon
  
  switch (size) {
    case 'small':
      dimensions = 'h-6 w-6'
      icon = '🏺'
      break
    case 'large':
      dimensions = 'h-16 w-16'
      icon = '🏺'
      break
    case 'medium':
    default:
      dimensions = 'h-10 w-10'
      icon = '🏺'
      break
  }

  // Iconos por tema
  const themeIcons = {
    adventure: '🏺',
    future: '⚡',
    jungle: '🌴',
    tech: '🤖',
    space: '👽',
    default: '⚡'
  }

  const displayIcon = themeIcons[theme] || icon

  return (
    <div className="flex flex-col justify-center items-center">
      <div className={`${dimensions} text-4xl md:text-6xl animate-spin`}>
        {displayIcon}
      </div>
      <p className="mt-4 text-adventure-gold font-retro text-xs uppercase tracking-wider opacity-70">
        CARGANDO...
      </p>
    </div>
  )
}
LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  theme: PropTypes.oneOf(['adventure', 'future', 'jungle', 'tech', 'space', 'default'])
}

export default LoadingSpinner

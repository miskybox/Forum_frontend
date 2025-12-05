import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';

/**
 * CategoryCard con estilo retro Adventure
 */
const CategoryCard = ({ category }) => {
  return (
    <Link 
      to={`/forums/category/${category.id}`}
      className="group"
    >
      <div className="card border-adventure-gold overflow-hidden transition-all group-hover:border-adventure-gold/80">
        <div className="aspect-video relative bg-adventure-dark overflow-hidden">
          {category.imageUrl ? (
            <img 
              src={category.imageUrl} 
              alt={category.name} 
              className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-adventure-dark text-adventure-gold">
              <div className="text-6xl opacity-50">🌍</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-adventure-dark via-adventure-dark/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-lg md:text-xl font-display neon-text uppercase whitespace-nowrap overflow-hidden text-ellipsis">
              {category.name}
            </h3>
          </div>
        </div>
        <div className="p-4 bg-adventure-dark/50">
          <div className="text-xs text-adventure-gold font-retro uppercase tracking-wider mb-2 truncate">
            {category.forumCount || 0} {category.forumCount === 1 ? 'FORO' : 'FOROS'} DISPONIBLES
          </div>
          <p className="text-adventure-light font-retro text-xs line-clamp-2 opacity-80 break-words">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  )
}
CategoryCard.propTypes = {
  category: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    forumCount: PropTypes.number,
    description: PropTypes.string,
  }).isRequired,
};

export default CategoryCard

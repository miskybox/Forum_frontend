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
            <div className="flex items-center justify-center h-full bg-adventure-dark">
              <div className="w-20 h-20 rounded-full bg-golden/30 flex items-center justify-center">
                <svg className="w-10 h-10 text-golden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-adventure-dark via-adventure-dark/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-lg md:text-xl font-bold neon-text uppercase whitespace-nowrap overflow-hidden text-ellipsis">
              {category.name}
            </h3>
          </div>
        </div>
        <div className="p-4 bg-adventure-dark/50">
          <div className="text-xs text-adventure-gold font-retro uppercase tracking-normal mb-2 truncate">
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

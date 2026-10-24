import { useState } from 'react'
import PropTypes from 'prop-types'
import { useLanguage } from '../../contexts/LanguageContext'
import Lightbox from '../ui/Lightbox'

const toGallery = (post) => {
  if (post.images?.length) {
    return post.images
      .map((image, index) => ({
        url: image.url || image.imageUrl,
        alt: image.alt || `${index + 1}`,
      }))
      .filter((image) => image.url)
  }
  return (post.imageUrls || []).map((url, index) => ({ url, alt: `${index + 1}` }))
}

const PostContent = ({ post }) => {
  const { t } = useLanguage()
  const paragraphs = (post.content || '').split(/\n{2,}/).filter((p) => p.trim())
  const images = toGallery(post)
  const [activeIndex, setActiveIndex] = useState(null)

  return (
    <div className="space-y-space-md text-body-md text-on-surface leading-relaxed break-words">
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.length}`} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}

      {images.length > 0 && (
        <ul className={`grid gap-space-xs ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {images.map((image, index) => (
            <li key={`${image.url}-${index}`}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="block w-full overflow-hidden rounded-base bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                aria-label={`${t('postDetail.openImage')} ${index + 1}`}
              >
                <img
                  src={image.url}
                  alt=""
                  loading="lazy"
                  className="w-full aspect-video object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {activeIndex != null && (
        <Lightbox
          images={images}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onIndexChange={setActiveIndex}
          labels={{
            close: t('common.close'),
            previous: t('common.previous'),
            next: t('common.next'),
            image: t('postDetail.galleryImage'),
          }}
        />
      )}
    </div>
  )
}

PostContent.propTypes = {
  post: PropTypes.shape({
    content: PropTypes.string,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    images: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
}

export default PostContent

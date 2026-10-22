import PropTypes from 'prop-types'

/**
 * Post body. Content is plain text; blank lines separate paragraphs.
 */
const PostContent = ({ post }) => {
  const paragraphs = (post.content || '').split(/\n{2,}/).filter((p) => p.trim())

  return (
    <div className="space-y-space-md text-body-md text-on-surface leading-relaxed break-words">
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.length}`} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  )
}

PostContent.propTypes = {
  post: PropTypes.shape({
    content: PropTypes.string,
  }).isRequired,
}

export default PostContent

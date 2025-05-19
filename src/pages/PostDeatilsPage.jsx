import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchPostById } from '../services/postService.js'; 
import PostContent from '../components/post/PostContent.jsx';
import CommentList from '../components/comments/CommentList';
import CommentForm from '../components/comments/CommetForm.jsx'; 
import LoadingSpinner from '../components/common/LoadingSpinner';

const PostDetailPage = () => {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const getPost = async () => {
      try {
        setLoading(true)
        const postData = await fetchPostById(id)
        setPost(postData)
        setError(null)
      } catch (err) {
        setError('Error al cargar el post. Por favor, intenta de nuevo más tarde.')
        console.error('Error fetching post:', err)
      } finally {
        setLoading(false)
      }
    }

    getPost()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
        <div className="mt-4">
          <Link to="/forums" className="text-primary-600 hover:text-primary-700">
            ← Volver a los foros
          </Link>
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                to={`/forums/${post.forumId}`} 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                ← Volver al foro
              </Link>
            </div>
            {post.isAuthor && (
              <Link 
                to={`/posts/${post.id}/edit`}
                className="text-sm bg-white border border-neutral-300 rounded-md px-4 py-2 text-neutral-700 hover:bg-neutral-50"
              >
                Editar post
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Post Content */}
          <PostContent post={post} />
          
          {/* Comments Section */}
          <div className="px-6 py-5 border-t border-neutral-100">
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              Comentarios ({post.comments?.length || 0})
            </h3>
            
            {/* Comment Form */}
            <div className="mb-6">
              <CommentForm postId={post.id} />
            </div>
            
            {/* Comment List */}
            <CommentList comments={post.comments || []} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetailPage
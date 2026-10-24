import postService from './postService'

/**
 * Diaries are forum posts with photos. These helpers keep leftover blog
 * callers off the removed `/api/blog/*` endpoints.
 */
const asPage = (data) => {
  if (data?.content) return data
  const list = Array.isArray(data) ? data : []
  return { content: list, last: true, totalElements: list.length }
}

const blogService = {
  getAllCategories: async () => [],
  getCategoryById: async () => null,
  getCategoryBySlug: async () => null,
  createCategory: async () => {
    throw new Error('Blog categories are not used; diaries are posts with photos.')
  },
  updateCategory: async () => {
    throw new Error('Blog categories are not used; diaries are posts with photos.')
  },
  deleteCategory: async () => {},

  getAllPosts: async (page = 0, size = 10) => (
    asPage(await postService.getAllPosts(page, size, { hasImages: true }))
  ),
  getPostById: async (id) => postService.getPostById(id),
  getPostBySlug: async (slug) => postService.getPostById(slug),
  getPostsByCategory: async (_slug, page = 0, size = 10) => (
    asPage(await postService.getAllPosts(page, size, { hasImages: true }))
  ),
  searchPosts: async (query, page = 0, size = 10) => (
    asPage(await postService.getAllPosts(page, size, { hasImages: true, q: query }))
  ),
  getFeaturedPosts: async () => {
    const data = await postService.getAllPosts(0, 5, { hasImages: true, sort: 'trending' })
    return data?.content || data || []
  },
  getPopularPosts: async (limit = 5) => {
    const data = await postService.getAllPosts(0, limit, { hasImages: true, sort: 'top' })
    return data?.content || data || []
  },
  getMostLikedPosts: async (limit = 5) => {
    const data = await postService.getAllPosts(0, limit, { hasImages: true, sort: 'top' })
    return data?.content || data || []
  },
  getPostsByAuthor: async (_username, page = 0, size = 10) => (
    asPage(await postService.getAllPosts(page, size, { hasImages: true }))
  ),
  createPost: async (postData) => postService.createPost(postData),
  updatePost: async (id, postData) => postService.updatePost(id, postData),
  deletePost: async (id) => postService.deletePost(id),
  likePost: async () => {},
  unlikePost: async () => {},
}

export default blogService

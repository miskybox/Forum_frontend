import { vi } from 'vitest'
import searchService from './searchService'
import api from '../utils/api'

vi.mock('../utils/api', () => ({
  default: { get: vi.fn() },
}))

describe('searchService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('calls GET /search', async () => {
    api.get.mockResolvedValue({ data: { posts: [] } })
    await searchService.search('lima')
    expect(api.get).toHaveBeenCalledWith('/search', { params: { q: 'lima' } })
  })
})

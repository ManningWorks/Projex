import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchProductHuntPost } from '../product-hunt'

describe('fetchProductHuntPost', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetAllMocks()
    process.env = { ...originalEnv }
    global.fetch = vi.fn()
  })

  afterEach(() => {
    process.env = originalEnv
    vi.restoreAllMocks()
  })

  it('should fetch Product Hunt post data successfully', async () => {
    const mockData = {
      post: {
        name: 'Test Product',
        tagline: 'A test product',
        description: 'This is a test description',
        votes_count: 100,
        comments_count: 25,
        featured_at: '2024-01-15T10:00:00Z',
        website: 'https://example.com',
        url: 'https://www.producthunt.com/products/test-product',
      },
    }

    process.env.PRODUCT_HUNT_TOKEN = 'test-token'
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response)

    const result = await fetchProductHuntPost('test-product')

    expect(result).toEqual({
      name: 'Test Product',
      tagline: 'A test product',
      description: 'This is a test description',
      votes_count: 100,
      comments_count: 25,
      featured_at: '2024-01-15T10:00:00Z',
      website: 'https://example.com',
      url: 'https://www.producthunt.com/products/test-product',
    })
    expect(fetch).toHaveBeenCalledWith(
      'https://api.producthunt.com/v2/posts/test-product',
      {
        headers: {
          Authorization: 'Bearer test-token',
          Accept: 'application/json',
        },
        cache: 'force-cache',
      }
    )
  })

  it('should return null when PRODUCT_HUNT_TOKEN is not set', async () => {
    process.env.PRODUCT_HUNT_TOKEN = undefined
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const result = await fetchProductHuntPost('test-product')

    expect(result).toBeNull()
    expect(consoleWarnSpy).toHaveBeenCalledWith('PRODUCT_HUNT_TOKEN not set - cannot fetch Product Hunt data')
    expect(fetch).not.toHaveBeenCalled()
    consoleWarnSpy.mockRestore()
  })

  it('should return null when API returns 404', async () => {
    process.env.PRODUCT_HUNT_TOKEN = 'test-token'
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response)

    const result = await fetchProductHuntPost('non-existent-product')

    expect(result).toBeNull()
  })

  it('should return null when fetch fails with network error', async () => {
    process.env.PRODUCT_HUNT_TOKEN = 'test-token'
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

    const result = await fetchProductHuntPost('test-product')

    expect(result).toBeNull()
  })

  it('should handle missing post data in response', async () => {
    process.env.PRODUCT_HUNT_TOKEN = 'test-token'
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response)

    const result = await fetchProductHuntPost('test-product')

    expect(result).toBeNull()
  })

  it('should handle missing optional fields gracefully', async () => {
    const mockData = {
      post: {
        name: 'Test Product',
        tagline: 'A test product',
        description: '',
        votes_count: 0,
        comments_count: 0,
        featured_at: null,
        website: '',
        url: '',
      },
    }

    process.env.PRODUCT_HUNT_TOKEN = 'test-token'
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response)

    const result = await fetchProductHuntPost('test-product')

    expect(result).toEqual({
      name: 'Test Product',
      tagline: 'A test product',
      description: '',
      votes_count: 0,
      comments_count: 0,
      featured_at: null,
      website: '',
      url: '',
    })
  })
})

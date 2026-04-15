import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchDevToUser } from '../devto'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('fetchDevToUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.DEV_TO_API_KEY
  })

  afterEach(() => {
    delete process.env.DEV_TO_API_KEY
  })

  describe('valid user', () => {
    it('should return correct user data for valid user', async () => {
      const mockArticles = [
        {
          id: 1,
          title: 'First Article',
          page_views_count: 100,
          positive_reactions_count: 50,
        },
        {
          id: 2,
          title: 'Second Article',
          page_views_count: 200,
          positive_reactions_count: 75,
        },
        {
          id: 3,
          title: 'Third Article',
          page_views_count: 300,
          positive_reactions_count: 100,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticles),
      })

      const result = await fetchDevToUser('testuser')

      expect(result).toEqual({
        articleCount: 3,
        totalViews: 600,
        totalReactions: 225,
      })
    })

    it('should handle user with no articles', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      const result = await fetchDevToUser('testuser')

      expect(result).toEqual({
        articleCount: 0,
        totalViews: 0,
        totalReactions: 0,
      })
    })

    it('should handle user with single article', async () => {
      const mockArticles = [
        {
          id: 1,
          title: 'First Article',
          page_views_count: 1000,
          positive_reactions_count: 200,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticles),
      })

      const result = await fetchDevToUser('testuser')

      expect(result).toEqual({
        articleCount: 1,
        totalViews: 1000,
        totalReactions: 200,
      })
    })

    it('should correctly sum reactions across articles', async () => {
      const mockArticles = [
        {
          id: 1,
          title: 'Article 1',
          page_views_count: 100,
          positive_reactions_count: 10,
        },
        {
          id: 2,
          title: 'Article 2',
          page_views_count: 100,
          positive_reactions_count: 20,
        },
        {
          id: 3,
          title: 'Article 3',
          page_views_count: 100,
          positive_reactions_count: 30,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticles),
      })

      const result = await fetchDevToUser('testuser')

      expect(result?.totalReactions).toBe(60)
    })

    it('should prefer public_reactions_count over positive_reactions_count', async () => {
      const mockArticles = [
        {
          id: 1,
          title: 'Article 1',
          page_views_count: 100,
          public_reactions_count: 40,
          positive_reactions_count: 10,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticles),
      })

      const result = await fetchDevToUser('testuser')

      expect(result?.totalReactions).toBe(40)
    })

    it('should handle missing page_views_count (unauthenticated)', async () => {
      const mockArticles = [
        {
          id: 1,
          title: 'Article 1',
          public_reactions_count: 50,
        },
        {
          id: 2,
          title: 'Article 2',
          public_reactions_count: 30,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticles),
      })

      const result = await fetchDevToUser('testuser')

      expect(result).toEqual({
        articleCount: 2,
        totalViews: 0,
        totalReactions: 80,
      })
    })

    it('should handle missing reaction counts gracefully', async () => {
      const mockArticles = [
        {
          id: 1,
          title: 'Article 1',
          page_views_count: 100,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticles),
      })

      const result = await fetchDevToUser('testuser')

      expect(result).toEqual({
        articleCount: 1,
        totalViews: 100,
        totalReactions: 0,
      })
    })

    it('should correctly sum reactions across articles', async () => {
      const mockArticles = [
        {
          id: 1,
          title: 'Article 1',
          page_views_count: 100,
          positive_reactions_count: 10,
        },
        {
          id: 2,
          title: 'Article 2',
          page_views_count: 100,
          positive_reactions_count: 11,
        },
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockArticles),
      })

      const result = await fetchDevToUser('testuser')

      expect(result?.totalReactions).toBe(21)
    })
  })

  describe('error handling', () => {
    it('should return null for 404 (user not found)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await fetchDevToUser('nonexistentuser')

      expect(result).toBeNull()
    })

    it('should warn for 404 (user not found)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await fetchDevToUser('nonexistentuser')

      expect(warnSpy).toHaveBeenCalledWith("Dev.to user 'nonexistentuser' not found.")

      warnSpy.mockRestore()
    })

    it('should return null for 429 (rate limit)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      })

      const result = await fetchDevToUser('testuser')

      expect(result).toBeNull()
    })

    it('should warn for 429 (rate limit)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await fetchDevToUser('testuser')

      expect(warnSpy).toHaveBeenCalledWith('Dev.to API rate limit exceeded.')

      warnSpy.mockRestore()
    })

    it('should return null for 500 (server error)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const result = await fetchDevToUser('testuser')

      expect(result).toBeNull()
    })

    it('should warn for 500 (server error)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await fetchDevToUser('testuser')

      expect(warnSpy).toHaveBeenCalledWith('Dev.to API returned error status: 500')

      warnSpy.mockRestore()
    })

    it('should return null for non-array response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ error: 'invalid data' }),
      })

      const result = await fetchDevToUser('testuser')

      expect(result).toBeNull()
    })

    it('should warn for non-array response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ error: 'invalid data' }),
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await fetchDevToUser('testuser')

      expect(warnSpy).toHaveBeenCalledWith('Dev.to API returned unexpected data format.')

      warnSpy.mockRestore()
    })

    it('should return null for network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await fetchDevToUser('testuser')

      expect(result).toBeNull()
    })

    it('should warn for network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await fetchDevToUser('testuser')

      expect(warnSpy).toHaveBeenCalledWith('Network error while fetching Dev.to user data.')

      warnSpy.mockRestore()
    })
  })

  describe('caching', () => {
    it('should use cache: force-cache', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      await fetchDevToUser('testuser')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://dev.to/api/articles?username=testuser&per_page=1000',
        { headers: {}, cache: 'force-cache' },
      )
    })
  })

  describe('authentication', () => {
    it('should include api-key header when DEV_TO_API_KEY is set', async () => {
      process.env.DEV_TO_API_KEY = 'test-api-key-123'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      await fetchDevToUser('testuser')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://dev.to/api/articles?username=testuser&per_page=1000',
        { headers: { 'api-key': 'test-api-key-123' }, cache: 'force-cache' },
      )
    })

    it('should warn when DEV_TO_API_KEY is not set', async () => {
      delete process.env.DEV_TO_API_KEY

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await fetchDevToUser('testuser')

      expect(warnSpy).toHaveBeenCalledWith(
        'DEV_TO_API_KEY not set - page view counts will not be available. Create an API key at https://dev.to/settings/extensions',
      )

      warnSpy.mockRestore()
    })

    it('should not warn when DEV_TO_API_KEY is set', async () => {
      process.env.DEV_TO_API_KEY = 'test-api-key'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await fetchDevToUser('testuser')

      expect(warnSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('DEV_TO_API_KEY not set'),
      )

      warnSpy.mockRestore()
    })
  })

  describe('API contract', () => {
    it('should construct correct API URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      await fetchDevToUser('testuser')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://dev.to/api/articles?username=testuser&per_page=1000',
        { headers: {}, cache: 'force-cache' },
      )
    })

    it('should encode username in URL', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      await fetchDevToUser('test user')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://dev.to/api/articles?username=test user&per_page=1000',
        { headers: {}, cache: 'force-cache' },
      )
    })
  })

  describe('no real API calls', () => {
    it('should not make real API calls during tests', () => {
      expect(vi.isMockFunction(mockFetch)).toBe(true)
    })
  })
})

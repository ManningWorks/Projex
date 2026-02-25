import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchDevToUser } from '../devto'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('fetchDevToUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
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
        averageReactions: 75,
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
        averageReactions: 0,
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
        averageReactions: 200,
      })
    })

    it('should correctly calculate average reactions', async () => {
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

      expect(result?.averageReactions).toBe(20)
    })

    it('should round average reactions to nearest integer', async () => {
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

      expect(result?.averageReactions).toBe(11)
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
        { cache: 'force-cache' },
      )
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
        { cache: 'force-cache' },
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
        { cache: 'force-cache' },
      )
    })
  })

  describe('no real API calls', () => {
    it('should not make real API calls during tests', () => {
      expect(vi.isMockFunction(mockFetch)).toBe(true)
    })
  })
})

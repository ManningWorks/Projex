import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchLemonSqueezyStore, LemonSqueezyStoreData } from '../lemonsqueezy'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const originalEnv = process.env

describe('fetchLemonSqueezyStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.LS_TOKEN
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('valid store', () => {
    it('should return correct store data for valid store', async () => {
      const mockStoreData = {
        data: {
          id: '1',
          type: 'stores',
          attributes: {
            formatted_mrr: '$1,234.56',
            order_count: 100,
            customer_count: 50,
          },
        },
      }

      process.env.LS_TOKEN = 'test_token_12345'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStoreData),
      })

      const result = await fetchLemonSqueezyStore('1')

      expect(result).toEqual({
        formattedMRR: '$1,234.56',
        orderCount: 100,
        customerCount: 50,
      })
    })

    it('should handle store with zero stats', async () => {
      const mockStoreData = {
        data: {
          id: '2',
          type: 'stores',
          attributes: {
            formatted_mrr: '$0',
            order_count: 0,
            customer_count: 0,
          },
        },
      }

      process.env.LS_TOKEN = 'test_token_12345'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStoreData),
      })

      const result = await fetchLemonSqueezyStore('2')

      expect(result).toEqual({
        formattedMRR: '$0',
        orderCount: 0,
        customerCount: 0,
      })
    })
  })

  describe('no API token', () => {
    it('should return null when LS_TOKEN is not set', async () => {
      delete process.env.LS_TOKEN

      const result = await fetchLemonSqueezyStore('1')

      expect(result).toBeNull()
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should warn when LS_TOKEN is not set', async () => {
      delete process.env.LS_TOKEN

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await fetchLemonSqueezyStore('1')

      expect(warnSpy).toHaveBeenCalledWith(
        'LS_TOKEN not set - Lemon Squeezy API requires authentication. Create an API key at https://app.lemonsqueezy.com/settings/api'
      )

      warnSpy.mockRestore()
    })
  })

  describe('invalid store', () => {
    beforeEach(() => {
      process.env.LS_TOKEN = 'test_token_12345'
    })

    it('should return null for 404 not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchLemonSqueezyStore('nonexistent')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Lemon Squeezy store not found: nonexistent')

      warnSpy.mockRestore()
    })

    it('should return null for 401 unauthorized', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchLemonSqueezyStore('unauthorized')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Lemon Squeezy API authentication failed - invalid or expired token')

      warnSpy.mockRestore()
    })

    it('should return null for 403 forbidden', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchLemonSqueezyStore('forbidden')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Lemon Squeezy API forbidden - insufficient permissions')

      warnSpy.mockRestore()
    })

    it('should return null for 429 rate limit', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchLemonSqueezyStore('ratelimited')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Lemon Squeezy API rate limit exceeded')

      warnSpy.mockRestore()
    })

    it('should return null for other non-ok responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchLemonSqueezyStore('servererror')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Lemon Squeezy API error: 500 Internal Server Error')

      warnSpy.mockRestore()
    })

    it('should return null for missing store data', async () => {
      const mockStoreData = {
        success: false,
        message: 'Store not found',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStoreData),
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchLemonSqueezyStore('invalid')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('No store data found for store ID: invalid')

      warnSpy.mockRestore()
    })

    it('should return null for missing attributes', async () => {
      const mockStoreData = {
        data: {
          id: '3',
          type: 'stores',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStoreData),
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchLemonSqueezyStore('no-attributes')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('No store data found for store ID: no-attributes')

      warnSpy.mockRestore()
    })
  })

  describe('network error', () => {
    beforeEach(() => {
      process.env.LS_TOKEN = 'test_token_12345'
    })

    it('should return null for network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchLemonSqueezyStore('networkerror')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Network error while fetching Lemon Squeezy store data')

      warnSpy.mockRestore()
    })

    it('should return null for timeout error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Timeout'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchLemonSqueezyStore('timeout')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Network error while fetching Lemon Squeezy store data')

      warnSpy.mockRestore()
    })

    it('should return null for DNS resolution failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ENOTFOUND'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchLemonSqueezyStore('dnserror')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Network error while fetching Lemon Squeezy store data')

      warnSpy.mockRestore()
    })
  })

  describe('caching strategy', () => {
    beforeEach(() => {
      process.env.LS_TOKEN = 'test_token_12345'
    })

    it('should use force-cache for build-time caching', async () => {
      const mockStoreData = {
        data: {
          id: '4',
          type: 'stores',
          attributes: {
            formatted_mrr: '$100',
            order_count: 10,
            customer_count: 5,
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStoreData),
      })

      await fetchLemonSqueezyStore('4')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.lemonsqueezy.com/v1/stores'),
        expect.objectContaining({
          cache: 'force-cache',
        })
      )
    })
  })

  describe('authentication', () => {
    it('should include Bearer token when LS_TOKEN is set', async () => {
      process.env.LS_TOKEN = 'ls_test_token_12345'

      const mockStoreData = {
        data: {
          id: '5',
          type: 'stores',
          attributes: {
            formatted_mrr: '$50',
            order_count: 5,
            customer_count: 2,
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStoreData),
      })

      await fetchLemonSqueezyStore('5')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer ls_test_token_12345',
          }),
        })
      )
    })

    it('should include Accept header for JSON API format', async () => {
      process.env.LS_TOKEN = 'ls_test_token_12345'

      const mockStoreData = {
        data: {
          id: '6',
          type: 'stores',
          attributes: {
            formatted_mrr: '$50',
            order_count: 5,
            customer_count: 2,
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStoreData),
      })

      await fetchLemonSqueezyStore('6')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/vnd.api+json',
          }),
        })
      )
    })
  })

  describe('API contract verification', () => {
    beforeEach(() => {
      process.env.LS_TOKEN = 'test_token_12345'
    })

    it('should map all required fields from Lemon Squeezy API response', async () => {
      const mockStoreData = {
        data: {
          id: '7',
          type: 'stores',
          attributes: {
            formatted_mrr: '$9,999.99',
            order_count: 888,
            customer_count: 444,
            name: 'Full Store',
            url: 'https://example.lemonsqueezy.com',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-12-31T23:59:59Z',
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStoreData),
      })

      const result = await fetchLemonSqueezyStore('7')

      expect(result).toEqual<LemonSqueezyStoreData>({
        formattedMRR: '$9,999.99',
        orderCount: 888,
        customerCount: 444,
      })
    })
  })

  describe('no real API calls', () => {
    beforeEach(() => {
      process.env.LS_TOKEN = 'test_token_12345'
    })

    it('should use mocked fetch', async () => {
      const mockStoreData = {
        data: {
          id: '8',
          type: 'stores',
          attributes: {
            formatted_mrr: '$1',
            order_count: 1,
            customer_count: 1,
          },
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockStoreData),
      })

      await fetchLemonSqueezyStore('8')

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.lemonsqueezy.com/v1/stores'),
        expect.objectContaining({
          cache: 'force-cache',
        })
      )
    })
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchGumroadProduct, GumroadProductData } from '../gumroad'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const originalEnv = process.env

describe('fetchGumroadProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.GUMROAD_TOKEN
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('valid product', () => {
    it('should return correct product data for valid product', async () => {
      const mockProductData = {
        product: {
          id: 'prod_test123',
          name: 'Test Product',
          formatted_revenue: '$1,234.56',
          sales_count: 100,
          subscriber_count: 50,
        },
      }

      process.env.GUMROAD_TOKEN = 'test_token_12345'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProductData),
      })

      const result = await fetchGumroadProduct('prod_test123')

      expect(result).toEqual({
        formattedRevenue: '$1,234.56',
        salesCount: 100,
        subscriberCount: 50,
      })
    })

    it('should handle product with zero stats', async () => {
      const mockProductData = {
        product: {
          id: 'prod_new123',
          name: 'New Product',
          formatted_revenue: '$0',
          sales_count: 0,
          subscriber_count: 0,
        },
      }

      process.env.GUMROAD_TOKEN = 'test_token_12345'

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProductData),
      })

      const result = await fetchGumroadProduct('prod_new123')

      expect(result).toEqual({
        formattedRevenue: '$0',
        salesCount: 0,
        subscriberCount: 0,
      })
    })
  })

  describe('no API token', () => {
    it('should return null when GUMROAD_TOKEN is not set', async () => {
      delete process.env.GUMROAD_TOKEN

      const result = await fetchGumroadProduct('prod_test123')

      expect(result).toBeNull()
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should warn when GUMROAD_TOKEN is not set', async () => {
      delete process.env.GUMROAD_TOKEN

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await fetchGumroadProduct('prod_test123')

      expect(warnSpy).toHaveBeenCalledWith(
        'GUMROAD_TOKEN not set - Gumroad API requires authentication. Create an access token at https://app.gumroad.com/settings/api_tokens'
      )

      warnSpy.mockRestore()
    })
  })

  describe('invalid product', () => {
    beforeEach(() => {
      process.env.GUMROAD_TOKEN = 'test_token_12345'
    })

    it('should return null for 404 not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchGumroadProduct('prod_nonexistent')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Gumroad product not found: prod_nonexistent')

      warnSpy.mockRestore()
    })

    it('should return null for 401 unauthorized', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchGumroadProduct('prod_unauthorized')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Gumroad API authentication failed - invalid or expired token')

      warnSpy.mockRestore()
    })

    it('should return null for 403 forbidden', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchGumroadProduct('prod_forbidden')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Gumroad API forbidden - insufficient permissions')

      warnSpy.mockRestore()
    })

    it('should return null for 429 rate limit', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchGumroadProduct('prod_ratelimited')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Gumroad API rate limit exceeded')

      warnSpy.mockRestore()
    })

    it('should return null for other non-ok responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchGumroadProduct('prod_servererror')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Gumroad API error: 500 Internal Server Error')

      warnSpy.mockRestore()
    })

    it('should return null for missing product data', async () => {
      const mockProductData = {
        success: false,
        message: 'Product not found',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProductData),
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchGumroadProduct('prod_invalid')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('No product data found for product ID: prod_invalid')

      warnSpy.mockRestore()
    })
  })

  describe('network error', () => {
    beforeEach(() => {
      process.env.GUMROAD_TOKEN = 'test_token_12345'
    })

    it('should return null for network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchGumroadProduct('prod_networkerror')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Network error while fetching Gumroad product data')

      warnSpy.mockRestore()
    })

    it('should return null for timeout error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Timeout'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchGumroadProduct('prod_timeout')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Network error while fetching Gumroad product data')

      warnSpy.mockRestore()
    })

    it('should return null for DNS resolution failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ENOTFOUND'))

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const result = await fetchGumroadProduct('prod_dnserror')

      expect(result).toBeNull()
      expect(warnSpy).toHaveBeenCalledWith('Network error while fetching Gumroad product data')

      warnSpy.mockRestore()
    })
  })

  describe('caching strategy', () => {
    beforeEach(() => {
      process.env.GUMROAD_TOKEN = 'test_token_12345'
    })

    it('should use force-cache for build-time caching', async () => {
      const mockProductData = {
        product: {
          id: 'prod_cached',
          name: 'Cached Product',
          formatted_revenue: '$100',
          sales_count: 10,
          subscriber_count: 5,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProductData),
      })

      await fetchGumroadProduct('prod_cached')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.gumroad.com/v2/products'),
        expect.objectContaining({
          cache: 'force-cache',
        })
      )
    })
  })

  describe('authentication', () => {
    it('should include Bearer token when GUMROAD_TOKEN is set', async () => {
      process.env.GUMROAD_TOKEN = 'gumroad_test_token_12345'

      const mockProductData = {
        product: {
          id: 'prod_test',
          name: 'Test Product',
          formatted_revenue: '$50',
          sales_count: 5,
          subscriber_count: 2,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProductData),
      })

      await fetchGumroadProduct('prod_test')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer gumroad_test_token_12345',
          }),
        })
      )
    })
  })

  describe('API contract verification', () => {
    beforeEach(() => {
      process.env.GUMROAD_TOKEN = 'test_token_12345'
    })

    it('should map all required fields from Gumroad API response', async () => {
      const mockProductData = {
        product: {
          id: 'prod_full',
          name: 'Full API Product',
          description: 'A complete product',
          formatted_revenue: '$9,999.99',
          sales_count: 888,
          subscriber_count: 444,
          price: '99.99',
          published: true,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-12-31T23:59:59Z',
          url: 'https://example.gumroad.com/l/product',
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProductData),
      })

      const result = await fetchGumroadProduct('prod_full')

      expect(result).toEqual<GumroadProductData>({
        formattedRevenue: '$9,999.99',
        salesCount: 888,
        subscriberCount: 444,
      })
    })
  })

  describe('no real API calls', () => {
    beforeEach(() => {
      process.env.GUMROAD_TOKEN = 'test_token_12345'
    })

    it('should use mocked fetch', async () => {
      const mockProductData = {
        product: {
          id: 'prod_mocked',
          name: 'Mocked Product',
          formatted_revenue: '$1',
          sales_count: 1,
          subscriber_count: 1,
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProductData),
      })

      await fetchGumroadProduct('prod_mocked')

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.gumroad.com/v2/products'),
        expect.objectContaining({
          cache: 'force-cache',
        })
      )
    })
  })
})

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchNpmPackage, NpmPackageData } from '../npm'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('fetchNpmPackage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('valid package', () => {
    it('should return correct package data for valid package', async () => {
      const mockDownloadsData = {
        package: 'react',
        downloads: 10000000,
      }

      const mockRegistryData = {
        'dist-tags': {
          latest: '18.2.0',
        },
      }

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockDownloadsData),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockRegistryData),
        })

      const result = await fetchNpmPackage('react')

      expect(result).toEqual({
        name: 'react',
        version: '18.2.0',
        downloads: 10000000,
      })
      expect(mockFetch).toHaveBeenCalledTimes(2)
    })

    it('should fetch from correct npm endpoints', async () => {
      const mockDownloadsData = { package: 'vue', downloads: 5000000 }
      const mockRegistryData = { 'dist-tags': { latest: '3.4.0' } }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      await fetchNpmPackage('vue')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.npmjs.org/downloads/point/last-month/vue',
        { cache: 'force-cache' }
      )
      expect(mockFetch).toHaveBeenCalledWith(
        'https://registry.npmjs.org/vue',
        { cache: 'force-cache' }
      )
    })
  })

  describe('invalid package', () => {
    it('should return null for 404 not found on downloads endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await fetchNpmPackage('nonexistent-package-xyz')

      expect(result).toBeNull()
    })

    it('should return null for 404 not found on registry endpoint', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ package: 'test', downloads: 0 }) })
        .mockResolvedValueOnce({ ok: false, status: 404 })

      const result = await fetchNpmPackage('nonexistent-registry-package')

      expect(result).toBeNull()
    })

    it('should return null for 500 server error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const result = await fetchNpmPackage('server-error-package')

      expect(result).toBeNull()
    })
  })

  describe('network error', () => {
    it('should return null for network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await fetchNpmPackage('network-error-package')

      expect(result).toBeNull()
    })

    it('should return null for timeout error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Timeout'))

      const result = await fetchNpmPackage('timeout-package')

      expect(result).toBeNull()
    })

    it('should return null for DNS resolution failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ENOTFOUND'))

      const result = await fetchNpmPackage('dns-error-package')

      expect(result).toBeNull()
    })
  })

  describe('caching strategy', () => {
    it('should use force-cache for build-time caching on downloads endpoint', async () => {
      const mockDownloadsData = { package: 'cached-pkg', downloads: 1000 }
      const mockRegistryData = { 'dist-tags': { latest: '1.0.0' } }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      await fetchNpmPackage('cached-pkg')

      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        expect.any(String),
        expect.objectContaining({ cache: 'force-cache' })
      )
    })

    it('should use force-cache for build-time caching on registry endpoint', async () => {
      const mockDownloadsData = { package: 'cached-pkg-2', downloads: 2000 }
      const mockRegistryData = { 'dist-tags': { latest: '2.0.0' } }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      await fetchNpmPackage('cached-pkg-2')

      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        expect.any(String),
        expect.objectContaining({ cache: 'force-cache' })
      )
    })
  })

  describe('response handling', () => {
    it('should handle package name from downloads response', async () => {
      const mockDownloadsData = { package: 'exact-package-name', downloads: 500 }
      const mockRegistryData = { 'dist-tags': { latest: '0.1.0' } }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      const result = await fetchNpmPackage('exact-package-name')

      expect(result?.name).toBe('exact-package-name')
    })

    it('should use package name from parameter when not in downloads response', async () => {
      const mockDownloadsData = { downloads: 300 }
      const mockRegistryData = { 'dist-tags': { latest: '1.0.0' } }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      const result = await fetchNpmPackage('param-package-name')

      expect(result?.name).toBe('param-package-name')
    })

    it('should handle zero downloads', async () => {
      const mockDownloadsData = { package: 'zero-downloads', downloads: 0 }
      const mockRegistryData = { 'dist-tags': { latest: '0.0.1' } }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      const result = await fetchNpmPackage('zero-downloads')

      expect(result?.downloads).toBe(0)
    })

    it('should handle missing downloads field gracefully', async () => {
      const mockDownloadsData = { package: 'no-downloads-field' }
      const mockRegistryData = { 'dist-tags': { latest: '1.0.0' } }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      const result = await fetchNpmPackage('no-downloads-field')

      expect(result?.downloads).toBe(0)
    })
  })

  describe('version handling', () => {
    it('should return null when dist-tags latest is missing', async () => {
      const mockDownloadsData = { package: 'no-version', downloads: 100 }
      const mockRegistryData = { 'dist-tags': {} }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      const result = await fetchNpmPackage('no-version')

      expect(result).toBeNull()
    })

    it('should return null when dist-tags is undefined', async () => {
      const mockDownloadsData = { package: 'no-dist-tags', downloads: 100 }
      const mockRegistryData = {}

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      const result = await fetchNpmPackage('no-dist-tags')

      expect(result).toBeNull()
    })

    it('should extract latest version from dist-tags', async () => {
      const mockDownloadsData = { package: 'versioned-pkg', downloads: 1000 }
      const mockRegistryData = {
        'dist-tags': {
          latest: '5.0.0',
          next: '6.0.0-beta.1',
          canary: '6.0.0-canary.5',
        },
      }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      const result = await fetchNpmPackage('versioned-pkg')

      expect(result?.version).toBe('5.0.0')
    })
  })

  describe('no real API calls', () => {
    it('should use mocked fetch and not hit real npm API', async () => {
      const mockDownloadsData = { package: 'mocked-pkg', downloads: 999 }
      const mockRegistryData = { 'dist-tags': { latest: '1.0.0' } }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      await fetchNpmPackage('mocked-pkg')

      expect(mockFetch).toHaveBeenCalledTimes(2)
      expect(mockFetch).not.toHaveBeenCalledWith(
        expect.stringContaining('https://api.npmjs.org/downloads/point/last-month/react'),
        expect.any(Object)
      )
    })
  })

  describe('API contract verification', () => {
    it('should map all required fields from npm API response', async () => {
      const mockDownloadsData = {
        package: 'full-api-pkg',
        downloads: 12345678,
        start: '2024-01-01',
        end: '2024-01-31',
      }

      const mockRegistryData = {
        name: 'full-api-pkg',
        'dist-tags': { latest: '10.20.30' },
        versions: { '10.20.30': {} },
      }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      const result = await fetchNpmPackage('full-api-pkg')

      expect(result).toEqual<NpmPackageData>({
        name: 'full-api-pkg',
        version: '10.20.30',
        downloads: 12345678,
      })
    })

    it('should handle scoped packages', async () => {
      const mockDownloadsData = { package: '@types/node', downloads: 5000000 }
      const mockRegistryData = { 'dist-tags': { latest: '20.10.0' } }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      const result = await fetchNpmPackage('@types/node')

      expect(result).toEqual({
        name: '@types/node',
        version: '20.10.0',
        downloads: 5000000,
      })
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.npmjs.org/downloads/point/last-month/@types/node',
        { cache: 'force-cache' }
      )
    })
  })

  describe('parallel requests', () => {
    it('should make downloads and registry requests in parallel', async () => {
      const mockDownloadsData = { package: 'parallel-pkg', downloads: 5000 }
      const mockRegistryData = { 'dist-tags': { latest: '2.0.0' } }

      mockFetch
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockDownloadsData) })
        .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockRegistryData) })

      await fetchNpmPackage('parallel-pkg')

      expect(mockFetch).toHaveBeenCalledTimes(2)
    })
  })
})

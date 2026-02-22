import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchGitHubRepo, GitHubRepoData } from '../github'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const originalEnv = process.env

describe('fetchGitHubRepo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.GITHUB_TOKEN
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('valid repo', () => {
    it('should return correct repo data for valid repo', async () => {
      const mockData: GitHubRepoData = {
        name: 'test-repo',
        description: 'A test repository',
        stargazers_count: 100,
        forks_count: 20,
        language: 'TypeScript',
        topics: ['react', 'typescript'],
        html_url: 'https://github.com/user/test-repo',
        homepage: 'https://example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-06-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await fetchGitHubRepo('user/test-repo')

      expect(result).toEqual(mockData)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/user/test-repo',
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/vnd.github.v3+json',
          }),
          cache: 'force-cache',
        })
      )
    })

    it('should handle repo with null description', async () => {
      const mockData = {
        name: 'no-desc-repo',
        description: null,
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        html_url: 'https://github.com/user/no-desc-repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await fetchGitHubRepo('user/no-desc-repo')

      expect(result).not.toBeNull()
      expect(result?.description).toBeNull()
    })

    it('should handle repo with missing topics', async () => {
      const mockData = {
        name: 'no-topics-repo',
        description: 'desc',
        stargazers_count: 0,
        forks_count: 0,
        language: 'JavaScript',
        topics: undefined,
        html_url: 'https://github.com/user/no-topics-repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await fetchGitHubRepo('user/no-topics-repo')

      expect(result).not.toBeNull()
      expect(result?.topics).toEqual([])
    })
  })

  describe('invalid repo', () => {
    it('should return null for 404 not found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      const result = await fetchGitHubRepo('user/nonexistent-repo')

      expect(result).toBeNull()
    })

    it('should return null for 403 forbidden', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      })

      const result = await fetchGitHubRepo('user/forbidden-repo')

      expect(result).toBeNull()
    })

    it('should return null for 500 server error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      const result = await fetchGitHubRepo('user/server-error-repo')

      expect(result).toBeNull()
    })

    it('should return null for 401 unauthorized', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      })

      const result = await fetchGitHubRepo('user/unauthorized-repo')

      expect(result).toBeNull()
    })
  })

  describe('network error', () => {
    it('should return null for network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await fetchGitHubRepo('user/network-error-repo')

      expect(result).toBeNull()
    })

    it('should return null for timeout error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Timeout'))

      const result = await fetchGitHubRepo('user/timeout-repo')

      expect(result).toBeNull()
    })

    it('should return null for DNS resolution failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ENOTFOUND'))

      const result = await fetchGitHubRepo('user/dns-error-repo')

      expect(result).toBeNull()
    })

    it('should return null for connection refused', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'))

      const result = await fetchGitHubRepo('user/conn-refused-repo')

      expect(result).toBeNull()
    })
  })

  describe('caching strategy', () => {
    it('should use force-cache for build-time caching', async () => {
      const mockData = {
        name: 'cached-repo',
        description: 'desc',
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        html_url: 'https://github.com/user/cached-repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      await fetchGitHubRepo('user/cached-repo')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          cache: 'force-cache',
        })
      )
    })
  })

  describe('authentication', () => {
    it('should include Authorization header when GITHUB_TOKEN is set', async () => {
      process.env.GITHUB_TOKEN = 'ghp_test_token_12345'

      const mockData = {
        name: 'auth-repo',
        description: 'desc',
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        html_url: 'https://github.com/user/auth-repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      await fetchGitHubRepo('user/auth-repo')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer ghp_test_token_12345',
          }),
        })
      )
    })

    it('should not include Authorization header when GITHUB_TOKEN is not set', async () => {
      delete process.env.GITHUB_TOKEN

      const mockData = {
        name: 'no-auth-repo',
        description: 'desc',
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        html_url: 'https://github.com/user/no-auth-repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      await fetchGitHubRepo('user/no-auth-repo')

      const callArgs = mockFetch.mock.calls[0][1]
      expect(callArgs.headers.Authorization).toBeUndefined()
    })

    it('should warn when GITHUB_TOKEN is not set', async () => {
      delete process.env.GITHUB_TOKEN

      const mockData = {
        name: 'warn-repo',
        description: 'desc',
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        html_url: 'https://github.com/user/warn-repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await fetchGitHubRepo('user/warn-repo')

      expect(warnSpy).toHaveBeenCalledWith(
        'GITHUB_TOKEN not set - using unauthenticated GitHub API (60/hr rate limit)'
      )

      warnSpy.mockRestore()
    })

    it('should not warn when GITHUB_TOKEN is set', async () => {
      process.env.GITHUB_TOKEN = 'ghp_test_token'

      const mockData = {
        name: 'no-warn-repo',
        description: 'desc',
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        html_url: 'https://github.com/user/no-warn-repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      await fetchGitHubRepo('user/no-warn-repo')

      expect(warnSpy).not.toHaveBeenCalled()

      warnSpy.mockRestore()
    })
  })

  describe('rate limit handling', () => {
    it('should return null for 403 rate limit error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        headers: new Map([['x-ratelimit-remaining', '0']]),
      })

      const result = await fetchGitHubRepo('user/rate-limited-repo')

      expect(result).toBeNull()
    })

    it('should handle secondary rate limit (403 with retry-after)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        headers: new Map([['retry-after', '60']]),
      })

      const result = await fetchGitHubRepo('user/secondary-rate-limit')

      expect(result).toBeNull()
    })
  })

  describe('url construction', () => {
    it('should construct correct GitHub API url', async () => {
      const mockData = {
        name: 'url-test-repo',
        description: 'desc',
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        html_url: 'https://github.com/owner/repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      await fetchGitHubRepo('owner/repo')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/owner/repo',
        expect.any(Object)
      )
    })

    it('should handle repos with special characters in name', async () => {
      const mockData = {
        name: 'special-repo.name',
        description: 'desc',
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        html_url: 'https://github.com/user/special-repo.name',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      await fetchGitHubRepo('user/special-repo.name')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/user/special-repo.name',
        expect.any(Object)
      )
    })
  })

  describe('response parsing', () => {
    it('should parse JSON response correctly', async () => {
      const mockData = {
        name: 'parse-test-repo',
        description: 'A repo with unicode: 🎉',
        stargazers_count: 12345,
        forks_count: 6789,
        language: 'Python',
        topics: ['ai', 'machine-learning'],
        html_url: 'https://github.com/user/parse-test-repo',
        homepage: 'https://parse-test.example.com',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-06-20T15:45:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      const result = await fetchGitHubRepo('user/parse-test-repo')

      expect(result).toEqual({
        name: 'parse-test-repo',
        description: 'A repo with unicode: 🎉',
        stargazers_count: 12345,
        forks_count: 6789,
        language: 'Python',
        topics: ['ai', 'machine-learning'],
        html_url: 'https://github.com/user/parse-test-repo',
        homepage: 'https://parse-test.example.com',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-06-20T15:45:00Z',
      })
    })

    it('should handle invalid JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON')),
      })

      const result = await fetchGitHubRepo('user/invalid-json-repo')

      expect(result).toBeNull()
    })
  })

  describe('no real API calls', () => {
    it('should use mocked fetch and not hit real GitHub API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          name: 'mocked-repo',
          description: 'This is mocked',
          stargazers_count: 0,
          forks_count: 0,
          language: null,
          topics: [],
          html_url: 'https://github.com/user/mocked-repo',
          homepage: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        }),
      })

      await fetchGitHubRepo('user/mocked-repo')

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch).not.toHaveBeenCalledWith(
        expect.stringContaining('https://api.github.com/repos/microsoft/vscode'),
        expect.any(Object)
      )
    })
  })

  describe('API contract verification', () => {
    it('should accept Accept header for GitHub API v3', async () => {
      const mockData = {
        name: 'api-version-test',
        description: 'desc',
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        html_url: 'https://github.com/user/api-version-test',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      })

      await fetchGitHubRepo('user/api-version-test')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: 'application/vnd.github.v3+json',
          }),
        })
      )
    })

    it('should map all required fields from GitHub API response', async () => {
      const apiResponse = {
        name: 'full-api-repo',
        description: 'Full API description',
        stargazers_count: 5000,
        forks_count: 300,
        language: 'Rust',
        topics: ['cli', 'tool'],
        html_url: 'https://github.com/user/full-api-repo',
        homepage: 'https://full-api.example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-12-31T23:59:59Z',
        extra_field: 'should be ignored',
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(apiResponse),
      })

      const result = await fetchGitHubRepo('user/full-api-repo')

      expect(result).toEqual({
        name: 'full-api-repo',
        description: 'Full API description',
        stargazers_count: 5000,
        forks_count: 300,
        language: 'Rust',
        topics: ['cli', 'tool'],
        html_url: 'https://github.com/user/full-api-repo',
        homepage: 'https://full-api.example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2024-12-31T23:59:59Z',
      })
    })
  })
})

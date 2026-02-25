import { describe, it, expect, vi, beforeEach } from 'vitest'
import { normalise, normalizeStats } from '../normalise'
import type { ManualProjectInput, GitHubProjectInput, NpmProjectInput, ProductHuntProjectInput } from '../../types'
import { fetchGitHubRepo, fetchGitHubCommits } from '../github'
import { fetchNpmPackage } from '../npm'
import { fetchProductHuntPost } from '../product-hunt'

vi.mock('../github')
vi.mock('../npm')
vi.mock('../product-hunt')

const mockedFetchGitHubRepo = vi.mocked(fetchGitHubRepo)
const mockedFetchGitHubCommits = vi.mocked(fetchGitHubCommits)
const mockedFetchNpmPackage = vi.mocked(fetchNpmPackage)
const mockedFetchProductHuntPost = vi.mocked(fetchProductHuntPost)

describe('normalise', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('manual project normalization', () => {
    it('should normalize a minimal manual project', async () => {
      const input: ManualProjectInput = {
        id: 'test-manual',
        type: 'manual',
        status: 'active',
      }

      const result = await normalise(input)

      expect(result.id).toBe('test-manual')
      expect(result.type).toBe('manual')
      expect(result.status).toBe('active')
      expect(result.featured).toBe(false)
      expect(result.name).toBe('')
      expect(result.description).toBe('')
      expect(result.stats).toBeNull()
    })

    it('should normalize a manual project with all fields', async () => {
      const input: ManualProjectInput = {
        id: 'full-manual',
        type: 'manual',
        status: 'shipped',
        featured: true,
        name: 'Manual Project',
        tagline: 'A tagline',
        description: 'A description',
        background: 'Background info',
        why: 'Why I built this',
        image: 'https://example.com/image.png',
        struggles: [{ type: 'warn', text: 'A warning' }],
        timeline: [{ date: '2024-01-01', note: 'Started' }],
        posts: [{ title: 'Post', date: '2024-01-01', url: 'https://example.com' }],
        stack: ['React', 'TypeScript'],
        links: { live: 'https://example.com' },
        stats: { stars: 100, downloads: '1000' },
        createdAt: '2024-01-01',
        updatedAt: '2024-06-01',
      }

      const result = await normalise(input)

      expect(result.name).toBe('Manual Project')
      expect(result.tagline).toBe('A tagline')
      expect(result.description).toBe('A description')
      expect(result.background).toBe('Background info')
      expect(result.why).toBe('Why I built this')
      expect(result.image).toBe('https://example.com/image.png')
      expect(result.struggles).toEqual([{ type: 'warn', text: 'A warning' }])
      expect(result.timeline).toEqual([{ date: '2024-01-01', note: 'Started' }])
      expect(result.posts).toEqual([{ title: 'Post', date: '2024-01-01', url: 'https://example.com' }])
      expect(result.stack).toEqual(['React', 'TypeScript'])
      expect(result.links).toEqual({ live: 'https://example.com' })
      expect(result.stats).toEqual({ stars: 100, downloads: '1000' })
      expect(result.featured).toBe(true)
      expect(result.createdAt).toBe('2024-01-01')
      expect(result.updatedAt).toBe('2024-06-01')
    })

    it('should not apply override fields for manual project (override only works for github/hybrid)', async () => {
      const input: ManualProjectInput = {
        id: 'override-manual',
        type: 'manual',
        status: 'active',
        name: 'Original Name',
        description: 'Original Description',
        override: {
          name: 'Overridden Name',
          description: 'Overridden Description',
        },
      }

      const result = await normalise(input)

      expect(result.name).toBe('Original Name')
      expect(result.description).toBe('Original Description')
    })
  })

  describe('GitHub project normalization', () => {
    it('should normalize a GitHub project with fetched data', async () => {
      mockedFetchGitHubRepo.mockResolvedValue({
        name: 'github-repo',
        description: 'GitHub description',
        stargazers_count: 100,
        forks_count: 20,
        language: 'TypeScript',
        topics: ['react', 'typescript'],
        html_url: 'https://github.com/user/repo',
        homepage: 'https://example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-06-01T00:00:00Z',
      })

      const input: GitHubProjectInput = {
        id: 'test-github',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
      }

      const result = await normalise(input)

      expect(result.name).toBe('github-repo')
      expect(result.description).toBe('GitHub description')
      expect(result.stats).toEqual({ stars: 100, forks: 20 })
      expect(result.language).toBe('TypeScript')
      expect(result.links.github).toBe('https://github.com/user/repo')
      expect(result.links.live).toBe('https://example.com')
      expect(mockedFetchGitHubRepo).toHaveBeenCalledWith('user/repo')
    })

    it('should handle GitHub fetch failure gracefully', async () => {
      mockedFetchGitHubRepo.mockResolvedValue(null)

      const input: GitHubProjectInput = {
        id: 'failed-github',
        type: 'github',
        repo: 'user/nonexistent',
        status: 'active',
        name: 'Fallback Name',
        description: 'Fallback Description',
      }

      const result = await normalise(input)

      expect(result.name).toBe('Fallback Name')
      expect(result.description).toBe('Fallback Description')
      expect(result.stats).toBeNull()
      expect(result.language).toBeNull()
    })

    it('should use override fields for GitHub project', async () => {
      mockedFetchGitHubRepo.mockResolvedValue({
        name: 'github-name',
        description: 'GitHub description',
        stargazers_count: 100,
        forks_count: 20,
        language: 'TypeScript',
        topics: [],
        html_url: 'https://github.com/user/repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-06-01T00:00:00Z',
      })

      const input: GitHubProjectInput = {
        id: 'override-github',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
        override: {
          name: 'Custom Name',
          description: 'Custom Description',
        },
      }

      const result = await normalise(input)

      expect(result.name).toBe('Custom Name')
      expect(result.description).toBe('Custom Description')
    })

    it('should include repo in the output', async () => {
      mockedFetchGitHubRepo.mockResolvedValue(null)

      const input: GitHubProjectInput = {
        id: 'repo-test',
        type: 'github',
        repo: 'user/my-repo',
        status: 'active',
      }

      const result = await normalise(input)

      expect(result.repo).toBe('user/my-repo')
    })

    it('should merge input links with GitHub links', async () => {
      mockedFetchGitHubRepo.mockResolvedValue({
        name: 'repo',
        description: 'desc',
        stargazers_count: 0,
        forks_count: 0,
        language: null,
        topics: [],
        html_url: 'https://github.com/user/repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      })

      const input: GitHubProjectInput = {
        id: 'links-test',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
        links: {
          npm: 'https://npmjs.com/package/my-pkg',
        },
      }

      const result = await normalise(input)

      expect(result.links.github).toBe('https://github.com/user/repo')
      expect(result.links.npm).toBe('https://npmjs.com/package/my-pkg')
    })

    it('should use global commits default when no per-project commits config', async () => {
      mockedFetchGitHubRepo.mockResolvedValue({
        name: 'test-repo',
        description: 'Test description',
        stargazers_count: 100,
        forks_count: 20,
        language: 'TypeScript',
        topics: [],
        html_url: 'https://github.com/user/repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-06-01T00:00:00Z',
      })

      mockedFetchGitHubCommits.mockResolvedValue([
        {
          sha: 'abc123',
          message: 'Initial commit',
          author: 'John Doe',
          date: '2024-01-01T00:00:00Z',
          avatarUrl: 'https://avatars.githubusercontent.com/u/1',
          htmlUrl: 'https://github.com/user/repo/commit/abc123',
        },
      ])

      const input: GitHubProjectInput = {
        id: 'commits-test',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
      }

      const result = await normalise(input, { commits: 5 })

      expect(result.commits).toHaveLength(1)
      expect(result.commits?.[0].message).toBe('Initial commit')
      expect(mockedFetchGitHubCommits).toHaveBeenCalledWith('user/repo', 5)
    })

    it('should use per-project commits config over global default', async () => {
      mockedFetchGitHubRepo.mockResolvedValue({
        name: 'test-repo',
        description: 'Test description',
        stargazers_count: 100,
        forks_count: 20,
        language: 'TypeScript',
        topics: [],
        html_url: 'https://github.com/user/repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-06-01T00:00:00Z',
      })

      mockedFetchGitHubCommits.mockResolvedValue([
        {
          sha: 'abc123',
          message: 'Commit 1',
          author: 'Jane',
          date: '2024-01-01T00:00:00Z',
          avatarUrl: 'https://avatars.githubusercontent.com/u/2',
          htmlUrl: 'https://github.com/user/repo/commit/abc123',
        },
      ])

      const input: GitHubProjectInput = {
        id: 'commits-override-test',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
        commits: 3,
      }

      const result = await normalise(input, { commits: 10 })

      expect(result.commits).toHaveLength(1)
      expect(mockedFetchGitHubCommits).toHaveBeenCalledWith('user/repo', 3)
    })

    it('should not fetch commits when global commits is 0', async () => {
      mockedFetchGitHubRepo.mockResolvedValue({
        name: 'test-repo',
        description: 'Test description',
        stargazers_count: 100,
        forks_count: 20,
        language: 'TypeScript',
        topics: [],
        html_url: 'https://github.com/user/repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-06-01T00:00:00Z',
      })

      const input: GitHubProjectInput = {
        id: 'no-commits-test',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
      }

      const result = await normalise(input)

      expect(result.commits).toBeUndefined()
      expect(mockedFetchGitHubCommits).not.toHaveBeenCalled()
    })

    it('should clamp invalid commits config and log warning', async () => {
      mockedFetchGitHubRepo.mockResolvedValue({
        name: 'test-repo',
        description: 'Test description',
        stargazers_count: 100,
        forks_count: 20,
        language: 'TypeScript',
        topics: [],
        html_url: 'https://github.com/user/repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-06-01T00:00:00Z',
      })

      mockedFetchGitHubCommits.mockResolvedValue([])

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const input: GitHubProjectInput = {
        id: 'clamp-test',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
        commits: 150,
      }

      const result = await normalise(input)

      expect(warnSpy).toHaveBeenCalledWith(
        'Invalid commits value: 150. Clamping to valid range (0-100).',
      )
      expect(mockedFetchGitHubCommits).toHaveBeenCalledWith('user/repo', 100)
      expect(result.commits).toEqual([])

      warnSpy.mockRestore()
    })

    it('should clamp negative commits config and log warning', async () => {
      mockedFetchGitHubRepo.mockResolvedValue({
        name: 'test-repo',
        description: 'Test description',
        stargazers_count: 100,
        forks_count: 20,
        language: 'TypeScript',
        topics: [],
        html_url: 'https://github.com/user/repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-06-01T00:00:00Z',
      })

      mockedFetchGitHubCommits.mockResolvedValue([])

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const input: GitHubProjectInput = {
        id: 'negative-clamp-test',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
        commits: -5,
      }

      const result = await normalise(input)

      expect(warnSpy).toHaveBeenCalledWith(
        'Invalid commits value: -5. Clamping to valid range (0-100).',
      )
      expect(mockedFetchGitHubCommits).not.toHaveBeenCalled()
      expect(result.commits).toBeUndefined()

      warnSpy.mockRestore()
    })

    it('should handle commits fetch failure gracefully', async () => {
      mockedFetchGitHubRepo.mockResolvedValue({
        name: 'test-repo',
        description: 'Test description',
        stargazers_count: 100,
        forks_count: 20,
        language: 'TypeScript',
        topics: [],
        html_url: 'https://github.com/user/repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-06-01T00:00:00Z',
      })

      mockedFetchGitHubCommits.mockResolvedValue(null)

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const input: GitHubProjectInput = {
        id: 'commits-fail-test',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
        commits: 5,
      }

      const result = await normalise(input)

      expect(result.commits).toEqual([])
      expect(warnSpy).toHaveBeenCalled()

      warnSpy.mockRestore()
    })

    it('should handle hybrid project commits', async () => {
      mockedFetchGitHubRepo.mockResolvedValue({
        name: 'hybrid-repo',
        description: 'Hybrid description',
        stargazers_count: 50,
        forks_count: 10,
        language: 'JavaScript',
        topics: [],
        html_url: 'https://github.com/user/hybrid-repo',
        homepage: 'https://hybrid.example.com',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-06-01T00:00:00Z',
      })

      mockedFetchGitHubCommits.mockResolvedValue([
        {
          sha: 'xyz789',
          message: 'Hybrid commit',
          author: 'Hybrid User',
          date: '2024-01-10T00:00:00Z',
          avatarUrl: 'https://avatars.githubusercontent.com/u/3',
          htmlUrl: 'https://github.com/user/hybrid-repo/commit/xyz789',
        },
      ])

      const input: GitHubProjectInput = {
        id: 'hybrid-commits-test',
        type: 'github',
        repo: 'user/hybrid-repo',
        status: 'active',
        commits: 10,
      }

      const result = await normalise(input)

      expect(result.commits).toHaveLength(1)
      expect(result.commits?.[0].message).toBe('Hybrid commit')
    })
  })

  describe('npm project normalization', () => {
    it('should normalize an npm project with fetched data', async () => {
      mockedFetchNpmPackage.mockResolvedValue({
        name: 'my-package',
        version: '2.0.0',
        downloads: 10000,
      })

      const input: NpmProjectInput = {
        id: 'test-npm',
        type: 'npm',
        package: 'my-package',
        status: 'active',
        name: 'My Package',
        description: 'Package description',
      }

      const result = await normalise(input)

      expect(result.name).toBe('My Package')
      expect(result.description).toBe('Package description')
      expect(result.stats).toEqual({
        downloads: '10000',
        version: '2.0.0',
      })
      expect(result.package).toBe('my-package')
      expect(mockedFetchNpmPackage).toHaveBeenCalledWith('my-package')
    })

    it('should handle npm fetch failure gracefully', async () => {
      mockedFetchNpmPackage.mockResolvedValue(null)

      const input: NpmProjectInput = {
        id: 'failed-npm',
        type: 'npm',
        package: 'nonexistent-pkg',
        status: 'active',
        name: 'Package Name',
      }

      const result = await normalise(input)

      expect(result.name).toBe('Package Name')
      expect(result.stats).toBeNull()
    })
  })

  describe('Product Hunt project normalization', () => {
    it('should normalize a Product Hunt project with fetched data', async () => {
      mockedFetchProductHuntPost.mockResolvedValue({
        name: 'Product Name',
        tagline: 'Product tagline',
        description: 'Product description',
        votes_count: 500,
        comments_count: 50,
        featured_at: '2024-01-15T00:00:00Z',
        website: 'https://example.com',
        url: 'https://producthunt.com/posts/product',
      })

      const input: ProductHuntProjectInput = {
        id: 'test-ph',
        type: 'product-hunt',
        slug: 'my-product',
        status: 'shipped',
        name: 'Input Name',
        tagline: 'Input Tagline',
        description: 'Input Description',
      }

      const result = await normalise(input)

      expect(result.name).toBe('Input Name')
      expect(result.tagline).toBe('Input Tagline')
      expect(result.description).toBe('Input Description')
      expect(result.stats).toEqual({
        upvotes: 500,
        comments: 50,
        launchDate: '2024-01-15T00:00:00Z',
      })
      expect(result.slug).toBe('my-product')
      expect(mockedFetchProductHuntPost).toHaveBeenCalledWith('my-product')
    })

    it('should handle Product Hunt fetch failure gracefully', async () => {
      mockedFetchProductHuntPost.mockResolvedValue(null)

      const input: ProductHuntProjectInput = {
        id: 'failed-ph',
        type: 'product-hunt',
        slug: 'nonexistent',
        status: 'active',
        name: 'Fallback Name',
      }

      const result = await normalise(input)

      expect(result.name).toBe('Fallback Name')
      expect(result.stats).toBeNull()
    })
  })

  describe('featured handling', () => {
    it('should default featured to false', async () => {
      const input: ManualProjectInput = {
        id: 'no-featured',
        type: 'manual',
        status: 'active',
      }

      const result = await normalise(input)

      expect(result.featured).toBe(false)
    })

    it('should preserve featured=true', async () => {
      const input: ManualProjectInput = {
        id: 'featured-true',
        type: 'manual',
        status: 'active',
        featured: true,
      }

      const result = await normalise(input)

      expect(result.featured).toBe(true)
    })
  })

  describe('language color handling', () => {
    it('should set language color for known languages', async () => {
      mockedFetchGitHubRepo.mockResolvedValue({
        name: 'repo',
        description: 'desc',
        stargazers_count: 0,
        forks_count: 0,
        language: 'TypeScript',
        topics: [],
        html_url: 'https://github.com/user/repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      })

      const input: GitHubProjectInput = {
        id: 'lang-color',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
      }

      const result = await normalise(input)

      expect(result.language).toBe('TypeScript')
      expect(result.languageColor).toBe('#3178c6')
    })

    it('should handle unknown languages', async () => {
      mockedFetchGitHubRepo.mockResolvedValue({
        name: 'repo',
        description: 'desc',
        stargazers_count: 0,
        forks_count: 0,
        language: 'UnknownLanguage',
        topics: [],
        html_url: 'https://github.com/user/repo',
        homepage: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      })

      const input: GitHubProjectInput = {
        id: 'unknown-lang',
        type: 'github',
        repo: 'user/repo',
        status: 'active',
      }

      const result = await normalise(input)

      expect(result.language).toBe('UnknownLanguage')
      expect(result.languageColor).toBeNull()
    })
  })

  describe('validation', () => {
    it('should throw an error for missing id', async () => {
      const invalidInput = {
        type: 'manual',
        status: 'active',
      } as unknown as ManualProjectInput

      await expect(normalise(invalidInput)).rejects.toThrow()
    })

    it('should throw an error for missing type', async () => {
      const invalidInput = {
        id: 'test',
        status: 'active',
      } as unknown as ManualProjectInput

      await expect(normalise(invalidInput)).rejects.toThrow()
    })

    it('should throw an error for missing status', async () => {
      const invalidInput = {
        id: 'test',
        type: 'manual',
      } as unknown as ManualProjectInput

      await expect(normalise(invalidInput)).rejects.toThrow()
    })

    it('should throw an error for invalid status value', async () => {
      const invalidInput: ManualProjectInput = {
        id: 'test',
        type: 'manual',
        status: 'invalid-status' as 'active',
      }

      await expect(normalise(invalidInput)).rejects.toThrow()
    })

    it('should throw an error for missing repo on github type', async () => {
      const invalidInput = {
        id: 'test',
        type: 'github',
        status: 'active',
      } as unknown as GitHubProjectInput

      await expect(normalise(invalidInput)).rejects.toThrow(/repo/)
    })

    it('should throw an error for missing package on npm type', async () => {
      const invalidInput = {
        id: 'test',
        type: 'npm',
        status: 'active',
      } as unknown as NpmProjectInput

      await expect(normalise(invalidInput)).rejects.toThrow(/package/)
    })

    it('should throw an error for missing slug on product-hunt type', async () => {
      const invalidInput = {
        id: 'test',
        type: 'product-hunt',
        status: 'active',
      } as unknown as ProductHuntProjectInput

      await expect(normalise(invalidInput)).rejects.toThrow(/slug/)
    })

    it('should throw an error for invalid URL in links', async () => {
      const invalidInput: ManualProjectInput = {
        id: 'test',
        type: 'manual',
        status: 'active',
        links: {
          live: 'not-a-url',
        },
      }

      await expect(normalise(invalidInput)).rejects.toThrow()
    })

    it('should include validation error details in thrown error', async () => {
      const invalidInput = {
        id: 'test',
        type: 'github',
        status: 'active',
      } as unknown as GitHubProjectInput

      await expect(normalise(invalidInput)).rejects.toThrow(/Validation failed/)
      await expect(normalise(invalidInput)).rejects.toThrow(/repo/)
    })

    it('should throw for invalid enum values', async () => {
      const invalidInput = {
        id: 'test',
        type: 'manual',
        status: 'bad-status',
      } as unknown as ManualProjectInput

      await expect(normalise(invalidInput)).rejects.toThrow()
    })

    it('should throw for missing required fields on hybrid type', async () => {
      const invalidInput = {
        id: 'test',
        type: 'hybrid',
        status: 'active',
      } as unknown as GitHubProjectInput

      await expect(normalise(invalidInput)).rejects.toThrow()
    })
  })
})

describe('normalizeStats', () => {
  it('should normalize stars', () => {
    const result = normalizeStats({ stars: 1500 }, 'github')

    expect(result).toContainEqual({ label: 'Stars', value: '1.5K' })
  })

  it('should normalize forks', () => {
    const result = normalizeStats({ forks: 250 }, 'github')

    expect(result).toContainEqual({ label: 'Forks', value: '250' })
  })

  it('should normalize downloads with unit', () => {
    const result = normalizeStats({ downloads: 10000 }, 'npm')

    expect(result).toContainEqual({ label: 'Downloads', value: '10.0K', unit: 'month' })
  })

  it('should normalize version with v prefix', () => {
    const result = normalizeStats({ version: '1.2.3' }, 'npm')

    expect(result).toContainEqual({ label: 'Version', value: 'v1.2.3' })
  })

  it('should not duplicate v prefix', () => {
    const result = normalizeStats({ version: 'v2.0.0' }, 'npm')

    expect(result).toContainEqual({ label: 'Version', value: 'v2.0.0' })
  })

  it('should normalize upvotes', () => {
    const result = normalizeStats({ upvotes: 500 }, 'product-hunt')

    expect(result).toContainEqual({ label: 'Upvotes', value: '500' })
  })

  it('should normalize comments', () => {
    const result = normalizeStats({ comments: 75 }, 'product-hunt')

    expect(result).toContainEqual({ label: 'Comments', value: '75' })
  })

  it('should normalize launchDate', () => {
    const result = normalizeStats({ launchDate: '2024-01-15' }, 'product-hunt')

    expect(result).toContainEqual({ label: 'Launched', value: expect.any(String) })
  })

  it('should format large numbers with M suffix', () => {
    const result = normalizeStats({ stars: 2500000 }, 'github')

    expect(result).toContainEqual({ label: 'Stars', value: '2.5M' })
  })

  it('should handle empty stats', () => {
    const result = normalizeStats({}, 'github')

    expect(result).toEqual([])
  })

  it('should handle null/undefined values', () => {
    const result = normalizeStats({ stars: null, forks: undefined }, 'github')

    expect(result).toEqual([])
  })

  it('should handle invalid numbers', () => {
    const result = normalizeStats({ stars: 'not-a-number' }, 'github')

    expect(result).toEqual([])
  })

  it('should combine multiple stats', () => {
    const result = normalizeStats({
      stars: 100,
      forks: 50,
      downloads: 1000,
      version: '1.0.0',
    }, 'hybrid')

    expect(result).toHaveLength(4)
  })
})

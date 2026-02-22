import { describe, it, expect, vi, beforeEach } from 'vitest'
import { normalise } from '../normalise'
import type { HybridProjectInput } from '../../types'
import { fetchGitHubRepo } from '../github'
import { fetchNpmPackage } from '../npm'

vi.mock('../github')
vi.mock('../npm')

const mockedFetchGitHubRepo = vi.mocked(fetchGitHubRepo)
const mockedFetchNpmPackage = vi.mocked(fetchNpmPackage)

describe('hybrid config recognition', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should recognize a hybrid project when type is "hybrid"', async () => {
    const input: HybridProjectInput = {
      id: 'test-hybrid',
      type: 'hybrid',
      repo: 'user/repo',
      package: 'test-package',
      status: 'active',
    }

    const result = await normalise(input)

    expect(result.type).toBe('hybrid')
    expect(result.id).toBe('test-hybrid')
    expect(result.repo).toBe('user/repo')
    expect(result.package).toBe('test-package')
  })

  it('should fetch from both GitHub and npm APIs for hybrid projects', async () => {
    mockedFetchGitHubRepo.mockResolvedValue({
      name: 'test-package',
      description: 'A test package',
      stargazers_count: 100,
      forks_count: 20,
      language: 'TypeScript',
      topics: [],
      html_url: 'https://github.com/user/repo',
      homepage: 'https://example.com',
    })

    mockedFetchNpmPackage.mockResolvedValue({
      name: 'test-package',
      version: '1.0.0',
      downloads: 5000,
    })

    const input: HybridProjectInput = {
      id: 'test-hybrid',
      type: 'hybrid',
      repo: 'user/repo',
      package: 'test-package',
      status: 'active',
    }

    await normalise(input)

    expect(mockedFetchGitHubRepo).toHaveBeenCalledWith('user/repo')
    expect(mockedFetchNpmPackage).toHaveBeenCalledWith('test-package')
  })

  it('should merge stats from both GitHub and npm', async () => {
    mockedFetchGitHubRepo.mockResolvedValue({
      name: 'test-package',
      description: 'A test package',
      stargazers_count: 100,
      forks_count: 20,
      language: 'TypeScript',
      topics: [],
      html_url: 'https://github.com/user/repo',
      homepage: 'https://example.com',
    })

    mockedFetchNpmPackage.mockResolvedValue({
      name: 'test-package',
      version: '1.0.0',
      downloads: 5000,
    })

    const input: HybridProjectInput = {
      id: 'test-hybrid',
      type: 'hybrid',
      repo: 'user/repo',
      package: 'test-package',
      status: 'active',
    }

    const result = await normalise(input)

    expect(result.stats).toEqual({
      stars: 100,
      forks: 20,
      downloads: '5000',
      version: '1.0.0',
    })
  })

  it('should merge successful source stats when one API fails', async () => {
    mockedFetchGitHubRepo.mockResolvedValue({
      name: 'test-package',
      description: 'A test package',
      stargazers_count: 100,
      forks_count: 20,
      language: 'TypeScript',
      topics: [],
      html_url: 'https://github.com/user/repo',
      homepage: 'https://example.com',
    })

    mockedFetchNpmPackage.mockResolvedValue(null)

    const input: HybridProjectInput = {
      id: 'test-hybrid',
      type: 'hybrid',
      repo: 'user/repo',
      package: 'test-package',
      status: 'active',
    }

    const result = await normalise(input)

    expect(result.stats).toEqual({
      stars: 100,
      forks: 20,
    })
  })

  it('should merge successful source stats when npm API succeeds but GitHub fails', async () => {
    mockedFetchGitHubRepo.mockResolvedValue(null)

    mockedFetchNpmPackage.mockResolvedValue({
      name: 'test-package',
      version: '1.0.0',
      downloads: 5000,
    })

    const input: HybridProjectInput = {
      id: 'test-hybrid',
      type: 'hybrid',
      repo: 'user/repo',
      package: 'test-package',
      status: 'active',
    }

    const result = await normalise(input)

    expect(result.stats).toEqual({
      downloads: '5000',
      version: '1.0.0',
    })
  })

  it('should auto-generate npm link from package name', async () => {
    mockedFetchGitHubRepo.mockResolvedValue({
      name: 'test-package',
      description: 'A test package',
      stargazers_count: 100,
      forks_count: 20,
      language: 'TypeScript',
      topics: [],
      html_url: 'https://github.com/user/repo',
      homepage: null,
    })

    mockedFetchNpmPackage.mockResolvedValue({
      name: 'test-package',
      version: '1.0.0',
      downloads: 5000,
    })

    const input: HybridProjectInput = {
      id: 'test-hybrid',
      type: 'hybrid',
      repo: 'user/repo',
      package: 'test-package',
      status: 'active',
    }

    const result = await normalise(input)

    expect(result.links.github).toBe('https://github.com/user/repo')
    expect(result.links.npm).toBe('https://npmjs.com/package/test-package')
  })

  it('should allow manual override of auto-generated links', async () => {
    mockedFetchGitHubRepo.mockResolvedValue({
      name: 'test-package',
      description: 'A test package',
      stargazers_count: 100,
      forks_count: 20,
      language: 'TypeScript',
      topics: [],
      html_url: 'https://github.com/user/repo',
      homepage: null,
    })

    mockedFetchNpmPackage.mockResolvedValue({
      name: 'test-package',
      version: '1.0.0',
      downloads: 5000,
    })

    const input: HybridProjectInput = {
      id: 'test-hybrid',
      type: 'hybrid',
      repo: 'user/repo',
      package: 'test-package',
      status: 'active',
      links: {
        github: 'https://custom-github.com',
        npm: 'https://custom-npm.com/package/test-package',
      },
    }

    const result = await normalise(input)

    expect(result.links.github).toBe('https://custom-github.com')
    expect(result.links.npm).toBe('https://custom-npm.com/package/test-package')
  })

  it('should use GitHub data for name, description, and language when available', async () => {
    mockedFetchGitHubRepo.mockResolvedValue({
      name: 'github-name',
      description: 'GitHub description',
      stargazers_count: 100,
      forks_count: 20,
      language: 'TypeScript',
      topics: [],
      html_url: 'https://github.com/user/repo',
      homepage: null,
    })

    mockedFetchNpmPackage.mockResolvedValue({
      name: 'npm-name',
      version: '1.0.0',
      downloads: 5000,
    })

    const input: HybridProjectInput = {
      id: 'test-hybrid',
      type: 'hybrid',
      repo: 'user/repo',
      package: 'test-package',
      status: 'active',
    }

    const result = await normalise(input)

    expect(result.name).toBe('github-name')
    expect(result.description).toBe('GitHub description')
    expect(result.language).toBe('TypeScript')
  })

  it('should allow override fields to take precedence over fetched data', async () => {
    mockedFetchGitHubRepo.mockResolvedValue({
      name: 'github-name',
      description: 'GitHub description',
      stargazers_count: 100,
      forks_count: 20,
      language: 'TypeScript',
      topics: [],
      html_url: 'https://github.com/user/repo',
      homepage: null,
    })

    mockedFetchNpmPackage.mockResolvedValue({
      name: 'npm-name',
      version: '1.0.0',
      downloads: 5000,
    })

    const input: HybridProjectInput = {
      id: 'test-hybrid',
      type: 'hybrid',
      repo: 'user/repo',
      package: 'test-package',
      status: 'active',
      override: {
        name: 'Custom Name',
        tagline: 'Custom Tagline',
        description: 'Custom Description',
        stack: ['React', 'Next.js'],
      },
    }

    const result = await normalise(input)

    expect(result.name).toBe('Custom Name')
    expect(result.tagline).toBe('Custom Tagline')
    expect(result.description).toBe('Custom Description')
    expect(result.stack).toEqual(['React', 'Next.js'])
  })

  it('should handle hybrid project with all optional fields', async () => {
    mockedFetchGitHubRepo.mockResolvedValue({
      name: 'test-package',
      description: 'GitHub description',
      stargazers_count: 100,
      forks_count: 20,
      language: 'TypeScript',
      topics: ['react', 'nextjs'],
      html_url: 'https://github.com/user/repo',
      homepage: 'https://example.com',
    })

    mockedFetchNpmPackage.mockResolvedValue({
      name: 'test-package',
      version: '1.0.0',
      downloads: 5000,
    })

    const input: HybridProjectInput = {
      id: 'full-hybrid',
      type: 'hybrid',
      repo: 'user/repo',
      package: 'test-package',
      status: 'shipped',
      featured: true,
      name: 'Full Hybrid',
      tagline: 'A complete hybrid project',
      description: 'Description of the project',
      background: 'Background info',
      why: 'Why I built it',
      struggles: [{ type: 'warn', text: 'A warning' }],
      timeline: [{ date: '2024-01-01', note: 'Started' }],
      posts: [{ title: 'First Post', date: '2024-01-01' }],
      stack: ['TypeScript', 'React'],
      links: {
        live: 'https://custom-live.com',
      },
    }

    const result = await normalise(input)

    expect(result.type).toBe('hybrid')
    expect(result.repo).toBe('user/repo')
    expect(result.package).toBe('test-package')
    expect(result.name).toBe('Full Hybrid')
    expect(result.tagline).toBe('A complete hybrid project')
    expect(result.description).toBe('Description of the project')
    expect(result.background).toBe('Background info')
    expect(result.why).toBe('Why I built it')
    expect(result.struggles).toEqual([{ type: 'warn', text: 'A warning' }])
    expect(result.timeline).toEqual([{ date: '2024-01-01', note: 'Started' }])
    expect(result.posts).toEqual([{ title: 'First Post', date: '2024-01-01' }])
    expect(result.stack).toEqual(['TypeScript', 'React'])
    expect(result.links.github).toBe('https://github.com/user/repo')
    expect(result.links.live).toBe('https://custom-live.com')
    expect(result.links.npm).toBe('https://npmjs.com/package/test-package')
    expect(result.stats).toEqual({
      stars: 100,
      forks: 20,
      downloads: '5000',
      version: '1.0.0',
    })
  })

  it('should allow manual stats to override fetched stats', async () => {
    mockedFetchGitHubRepo.mockResolvedValue({
      name: 'test-package',
      description: 'A test package',
      stargazers_count: 100,
      forks_count: 20,
      language: 'TypeScript',
      topics: [],
      html_url: 'https://github.com/user/repo',
      homepage: null,
    })

    mockedFetchNpmPackage.mockResolvedValue({
      name: 'test-package',
      version: '1.0.0',
      downloads: 5000,
    })

    const input: HybridProjectInput = {
      id: 'test-hybrid',
      type: 'hybrid',
      repo: 'user/repo',
      package: 'test-package',
      status: 'active',
      stats: {
        stars: 999,
        downloads: '9999',
      },
    }

    const result = await normalise(input)

    expect(result.stats).toEqual({
      stars: 999,
      forks: 20,
      downloads: '9999',
      version: '1.0.0',
    })
  })
})

import { bench, describe, beforeAll, vi } from 'vitest'

const mockGitHubResponse = {
  name: 'folio',
  description: 'A component library for project showcases',
  stargazers_count: 1234,
  forks_count: 56,
  language: 'TypeScript',
  topics: ['react', 'typescript', 'portfolio', 'components'],
  html_url: 'https://github.com/test/folio',
  homepage: 'https://folio.dev',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
}

describe('fetchGitHubRepo performance', () => {
  beforeAll(() => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => mockGitHubResponse,
    })))
  })

  bench('fetchGitHubRepo with cache (build strategy simulation)', async () => {
    const response = await fetch('https://api.github.com/repos/test/folio', {
      cache: 'force-cache',
    })
    await response.json()
  })

  bench('fetchGitHubRepo without cache (runtime strategy simulation)', async () => {
    const response = await fetch('https://api.github.com/repos/test/folio', {
      cache: 'no-store',
    })
    await response.json()
  })

  bench('parse GitHub API response', () => {
    const data = mockGitHubResponse
    void {
      name: data.name,
      description: data.description,
      stargazers_count: data.stargazers_count,
      forks_count: data.forks_count,
      language: data.language,
      topics: data.topics || [],
      html_url: data.html_url,
      homepage: data.homepage,
      created_at: data.created_at,
      updated_at: data.updated_at,
    }
  })
})

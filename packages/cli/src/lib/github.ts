export interface GitHubRepoData {
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  html_url: string
  homepage: string | null
  fork: boolean
  archived: boolean
}

export type FetchReposError = 'rate_limit' | 'network' | 'not_found' | 'other'

export interface FetchReposResult {
  data: GitHubRepoData[] | null
  error: FetchReposError | null
  rateLimitRemaining: number | null
}

export async function fetchGitHubRepos(username: string): Promise<FetchReposResult> {
  try {
    const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }

    const token = process.env.GITHUB_TOKEN
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      headers,
    })

    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
      ? parseInt(response.headers.get('X-RateLimit-Remaining')!)
      : null

    if (response.status === 403) {
      return { data: null, error: 'rate_limit', rateLimitRemaining }
    }

    if (response.status === 404) {
      return { data: null, error: 'not_found', rateLimitRemaining }
    }

    if (!response.ok) {
      return { data: null, error: 'other', rateLimitRemaining }
    }

    const data = await response.json()

    const repos = data.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      language: repo.language,
      topics: repo.topics || [],
      html_url: repo.html_url,
      homepage: repo.homepage,
      fork: repo.fork,
      archived: repo.archived,
    }))

    return { data: repos, error: null, rateLimitRemaining }
  } catch {
    return { data: null, error: 'network', rateLimitRemaining: null }
  }
}

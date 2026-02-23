export interface GitHubRepoData {
  name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  html_url: string
  homepage: string | null
  created_at: string
  updated_at: string
  fork?: boolean
  archived?: boolean
}

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#239120',
  PHP: '#4F5D95',
  Ruby: '#701516',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Haskell: '#5e5086',
  Lua: '#000080',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
}

export interface GitHubCommitData {
  sha: string
  message: string
  author: string | null
  date: string
  avatarUrl: string | null
  htmlUrl: string
}

export async function fetchGitHubCommits(
  repo: string,
  limit: number,
): Promise<GitHubCommitData[] | null> {
  try {
    const url = `https://api.github.com/repos/${repo}/commits?per_page=${limit}`

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }

    const token = process.env.GITHUB_TOKEN
    if (token) {
      headers.Authorization = `Bearer ${token}`
    } else {
      console.warn(
        'GITHUB_TOKEN not set - using unauthenticated GitHub API (60/hr rate limit). Create a fine-grained token at https://github.com/settings/personal-access-token/new',
      )
    }

    const response = await fetch(url, {
      headers,
      cache: 'force-cache',
    })

    if (response.status === 404) {
      return null
    }

    if (response.status === 403) {
      console.warn('GitHub API rate limit exceeded. Consider adding a GITHUB_TOKEN.')
      return null
    }

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    const commits = data.map((commit: any) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: commit.author?.login ?? commit.commit.author?.name ?? null,
      date: commit.commit.author?.date ?? '',
      avatarUrl: commit.author?.avatar_url ?? null,
      htmlUrl: commit.html_url,
    }))

    return commits
  } catch {
    console.warn('Network error while fetching GitHub commits.')
    return null
  }
}

export async function fetchGitHubRepo(repo: string): Promise<GitHubRepoData | null> {
  try {
    const url = `https://api.github.com/repos/${repo}`

    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }

    const token = process.env.GITHUB_TOKEN
    if (token) {
      headers.Authorization = `Bearer ${token}`
    } else {
      console.warn('GITHUB_TOKEN not set - using unauthenticated GitHub API (60/hr rate limit). Create a fine-grained token at https://github.com/settings/personal-access-token/new')
    }

    const response = await fetch(url, {
      headers,
      cache: 'force-cache',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()

    return {
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
  } catch {
    return null
  }
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
      created_at: repo.created_at,
      updated_at: repo.updated_at,
    }))

    return { data: repos, error: null, rateLimitRemaining }
  } catch {
    return { data: null, error: 'network', rateLimitRemaining: null }
  }
}

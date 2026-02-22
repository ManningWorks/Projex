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
      console.warn('GITHUB_TOKEN not set - using unauthenticated GitHub API (60/hr rate limit)')
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

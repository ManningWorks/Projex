# FetchReposResult & FetchReposError

Return types for `fetchGitHubRepos` function when fetching all repositories for a GitHub user.

## FetchReposResult

Result object containing either repository data or an error.

### Definition

```tsx
interface FetchReposResult {
  data: GitHubRepoData[] | null
  error: FetchReposError | null
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| data | `GitHubRepoData[] \| null` | Array of repository data, or `null` if error occurred |
| error | `FetchReposError \| null` | Error type, or `null` if successful |

## FetchReposError

Error type for repository fetch failures.

### Definition

```tsx
type FetchReposError = 'rate_limit' | 'network' | 'not_found' | 'unknown'
```

### Values

| Value | Description |
|-------|-------------|
| `rate_limit` | GitHub API rate limit exceeded |
| `network` | Network error or request failed |
| `not_found` | GitHub user not found (404) |
| `unknown` | Unknown error occurred |

## Usage

```tsx
import { fetchGitHubRepos } from '@manningworks/projex'

const result = await fetchGitHubRepos('facebook')

if (result.data) {
  console.log(`Found ${result.data.length} repositories`)
  result.data.forEach(repo => {
    console.log(`- ${repo.name}: ${repo.stargazers_count} stars`)
  })
} else if (result.error) {
  console.error('Failed to fetch repositories:', result.error)
}
```

## Error Handling

Each error type has a specific handling strategy:

```tsx
import { fetchGitHubRepos, type FetchReposError } from '@manningworks/projex'

const result = await fetchGitHubRepos('username')

if (result.error) {
  switch (result.error) {
    case 'rate_limit':
      console.error('GitHub API rate limit exceeded')
      console.error('Set GITHUB_TOKEN environment variable for 5000 req/hr')
      break
    case 'network':
      console.error('Network error, check connection')
      break
    case 'not_found':
      console.error('GitHub user not found')
      break
    case 'unknown':
      console.error('Unknown error occurred')
      break
  }
}
```

## Related

- `fetchGitHubRepo` - Fetch single repository data
- `GitHubRepoData` - Repository data structure
- Fetch GitHub API docs: https://docs.github.com/en/rest/repos/repos

# fetchGitHubRepo

Fetch repository data from the GitHub API.

## Signature

```tsx
function fetchGitHubRepo(repo: string): Promise<GitHubRepoData | null>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| repo | `string` | Repository in format `owner/repo` |

## Returns

`Promise<GitHubRepoData | null>` - Repository data or `null` on error

## Types

```tsx
interface GitHubRepoData {
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
```

## Behavior

- Uses `force-cache` for build-time caching
- Returns `null` on any error (network, auth, not found)
- Logs warning if `GITHUB_TOKEN` is not set

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | No | GitHub personal access token |

### Rate Limits

| Auth | Rate Limit |
|------|------------|
| Unauthenticated | 60 requests/hour |
| Authenticated | 5000 requests/hour |

## Example

```tsx
import { fetchGitHubRepo } from '@reallukemanning/folio'

const data = await fetchGitHubRepo('facebook/react')

if (data) {
  console.log(data.stargazers_count) // 220000+
  console.log(data.language)         // 'JavaScript'
}
```

## Error Handling

The function never throws - it returns `null` for any failure:

```tsx
const data = await fetchGitHubRepo('invalid/repo')
// data is null

const data = await fetchGitHubRepo('nonexistent/repository')
// data is null (404)
```

## Usage in normalise

This function is called internally by `normalise` for `github` and `hybrid` project types:

```tsx
// normalise calls fetchGitHubRepo internally
const project = await normalise({
  id: 'my-project',
  type: 'github',
  repo: 'user/repo',
  status: 'active'
})
```

## fetchGitHubRepos

Fetch all repositories for a GitHub user. Useful for CLI initialization or batch project setup.

### Signature

```tsx
function fetchGitHubRepos(username: string): Promise<FetchReposResult>
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| username | `string` | GitHub username |

### Returns

`Promise<FetchReposResult>` - Result object with data or error

### Types

```tsx
interface FetchReposResult {
  data: GitHubRepoData[] | null
  error: FetchReposError | null
}

type FetchReposError = 'rate_limit' | 'network' | 'not_found' | 'unknown'
```

### Behavior

- Fetches all public repositories for the user
- Excludes archived repositories
- Excludes repositories ending with `.template` or `.github.io`
- Excludes repositories without descriptions
- Returns `null` data with error code on failure

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | No | GitHub personal access token |

### Rate Limits

| Auth | Rate Limit |
|------|------------|
| Unauthenticated | 60 requests/hour |
| Authenticated | 5000 requests/hour |

### Example

```tsx
import { fetchGitHubRepos } from '@reallukemanning/folio'

const result = await fetchGitHubRepos('facebook')

if (result.data) {
  console.log(`Found ${result.data.length} repositories`)
  result.data.forEach(repo => {
    console.log(`- ${repo.name}: ${repo.stargazers_count} stars`)
  })
} else if (result.error === 'rate_limit') {
  console.error('Rate limit exceeded. Set GITHUB_TOKEN.')
}
```

### Error Codes

| Error | Description |
|-------|-------------|
| `rate_limit` | GitHub API rate limit exceeded |
| `network` | Network error or request failed |
| `not_found` | GitHub user not found |
| `unknown` | Unknown error occurred |

### Usage in CLI

This function is used internally by `npx folio init --github`:

```bash
# Interactive CLI uses fetchGitHubRepos
npx folio init --github

# Prompts for username, fetches all repos, generates config
```

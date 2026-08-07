# fetchGitHubRepo

Fetch repository data from the GitHub API.

## Signature

```tsx
function fetchGitHubRepo(repo: string): Promise<FetchRepoResult>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| repo | `string` | Repository in format `owner/repo` |

## Returns

`Promise<FetchRepoResult>` - Result object with data or error

## Types

```tsx
interface FetchRepoResult {
  data: GitHubRepoData | null
  error: FetchRepoError | null
}

interface FetchRepoError {
  type: FetchRepoErrorType
  message: string
}

type FetchRepoErrorType = 'not_found' | 'rate_limited' | 'network' | 'auth' | 'other'

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

> **Note:** When fetched via `fetchGitHubRepos`, the response also includes `fork?: boolean` and `archived?: boolean` fields for filtering purposes.

## Behavior

- Uses `force-cache` for build-time caching
- Returns `{ data: null, error: ... }` on any error (network, auth, not found)
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
import { fetchGitHubRepo } from '@manningworks/projex'

const { data, error } = await fetchGitHubRepo('facebook/react')

if (data) {
  console.log(data.stargazers_count) // 220000+
  console.log(data.language)         // 'JavaScript'
} else if (error) {
  console.error(error.message)
}
```

## Error Handling

The function never throws - it returns `{ data: null, error }` for any failure:

```tsx
const { data, error } = await fetchGitHubRepo('invalid/repo')
// data is null, error.type is 'not_found'

const { data, error } = await fetchGitHubRepo('nonexistent/repository')
// data is null, error.type is 'not_found'
```

### Error Codes

| Error Type | Description |
|-----------|-------------|
| `not_found` | Repository not found (404) |
| `rate_limited` | GitHub API rate limit exceeded (403) |
| `auth` | Authentication failed (401) |
| `network` | Network error or request failed |
| `other` | Unknown error occurred |

## Usage in normalise

This function is called internally by `normalise` and `fetchProjectData` for `github` and `hybrid` project types:

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
  rateLimitRemaining: number | null
}

type FetchReposError = 'rate_limit' | 'network' | 'not_found' | 'other'
```

### Behavior

- Fetches up to 100 public repositories for the user, sorted by last updated
- Maps all returned repositories without filtering
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
import { fetchGitHubRepos } from '@manningworks/projex'

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
| `other` | Unknown error occurred |

### Usage in CLI

This function is used internally by `npx @manningworks/projex init --github`:

```bash
# Interactive CLI uses fetchGitHubRepos
npx @manningworks/projex init --github

# Prompts for username, fetches all repos, generates config
```

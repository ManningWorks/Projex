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

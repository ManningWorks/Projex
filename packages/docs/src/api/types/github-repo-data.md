# GitHubRepoData

Interface for GitHub API response data.

## Definition

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

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Repository name |
| `description` | `string \| null` | Repository description |
| `stargazers_count` | `number` | Star count |
| `forks_count` | `number` | Fork count |
| `language` | `string \| null` | Primary language |
| `topics` | `string[]` | Repository topics |
| `html_url` | `string` | GitHub URL |
| `homepage` | `string \| null` | Homepage URL |
| `created_at` | `string` | Creation timestamp |
| `updated_at` | `string` | Last update timestamp |

## Usage

```tsx
import { fetchGitHubRepo } from '@folio/core'
import type { GitHubRepoData } from '@folio/core'

const data: GitHubRepoData | null = await fetchGitHubRepo('facebook/react')

if (data) {
  console.log(data.stargazers_count)
  console.log(data.language)
}
```

## Export

```tsx
import type { GitHubRepoData } from '@folio/core'
```

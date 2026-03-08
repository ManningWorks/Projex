# ProjectStats

Combined statistics interface for project metrics.

## Definition

```tsx
interface GitHubStats {
  stars?: number
  forks?: number
}

interface NpmStats {
  downloads?: string
  version?: string
}

interface ProductHuntStats {
  upvotes?: number
  comments?: number
  launchDate?: string
}

type ProjectStats = GitHubStats & NpmStats & ProductHuntStats
```

## Properties

| Property | Type | Source | Description |
|----------|------|--------|-------------|
| `stars` | `number` | GitHub | Star count |
| `forks` | `number` | GitHub | Fork count |
| `downloads` | `string` | npm | Monthly downloads |
| `version` | `string` | npm | Latest version |
| `upvotes` | `number` | Product Hunt | Vote count |
| `comments` | `number` | Product Hunt | Comment count |
| `launchDate` | `string` | Product Hunt | Launch date |

## Usage

```tsx
import type { ProjexProject } from '@manningworks/projex'

function formatStats(project: ProjexProject): string[] {
  const stats: string[] = []
  
  if (project.stats?.stars) {
    stats.push(`${project.stats.stars} stars`)
  }
  if (project.stats?.downloads) {
    stats.push(`${project.stats.downloads} downloads`)
  }
  
  return stats
}
```

## Null Safety

The `stats` property on `ProjexProject` can be `null`:

```tsx
if (project.stats) {
  // Safe to access stats properties
  console.log(project.stats.stars)
}
```

## Normalization

Use `normalizeStats` to format stats for display:

```tsx
import { normalizeStats } from '@manningworks/projex'

const formattedStats = normalizeStats(project.stats || {}, project.type)
// [{ label: 'Stars', value: '1.2K' }, ...]
```

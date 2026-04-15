# ProjectStats

Combined statistics interface for project metrics. This is an intersection type that merges stats from all supported platforms.

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

interface YouTubeStats {
  subscribers?: number
  views?: number
  latestVideoTitle?: string | null
  latestVideoUrl?: string | null
  latestVideoPublishedAt?: string | null
}

interface GumroadStats {
  formattedRevenue?: string
  salesCount?: number
  subscriberCount?: number
}

interface LemonSqueezyStats {
  formattedMRR?: string
  orderCount?: number
  customerCount?: number
}

interface DevToStats {
  articleCount?: number
  totalViews?: number
  totalReactions?: number
}

type ProjectStats = GitHubStats & NpmStats & ProductHuntStats & YouTubeStats & GumroadStats & LemonSqueezyStats & DevToStats
```

## All Properties

### GitHub Stats

| Property | Type | Source | Description |
|----------|------|--------|-------------|
| `stars` | `number` | GitHub API | Repository star count |
| `forks` | `number` | GitHub API | Repository fork count |

**Available for:** `github`, `hybrid`

### NPM Stats

| Property | Type | Source | Description |
|----------|------|--------|-------------|
| `downloads` | `string` | npm Downloads API | Monthly download count (as string) |
| `version` | `string` | npm Registry | Latest published version |

**Available for:** `npm`, `hybrid`

### Product Hunt Stats

| Property | Type | Source | Description |
|----------|------|--------|-------------|
| `upvotes` | `number` | Product Hunt API | Total upvotes |
| `comments` | `number` | Product Hunt API | Total comments |
| `launchDate` | `string` | Product Hunt API | Date featured (ISO 8601) |

**Available for:** `product-hunt`

### YouTube Stats

| Property | Type | Source | Description |
|----------|------|--------|-------------|
| `subscribers` | `number` | YouTube Data API v3 | Channel subscriber count |
| `views` | `number` | YouTube Data API v3 | Total channel view count |
| `latestVideoTitle` | `string \| null` | YouTube Data API v3 | Title of the most recent upload |
| `latestVideoUrl` | `string \| null` | YouTube Data API v3 | URL of the most recent upload |
| `latestVideoPublishedAt` | `string \| null` | YouTube Data API v3 | Publish date of the most recent upload |

**Available for:** `youtube`
**Requires:** `YOUTUBE_TOKEN` environment variable

### Gumroad Stats

| Property | Type | Source | Description |
|----------|------|--------|-------------|
| `formattedRevenue` | `string` | Gumroad API | Formatted revenue string (e.g., `"$1,234.56"`) |
| `salesCount` | `number` | Gumroad API | Total number of sales |
| `subscriberCount` | `number` | Gumroad API | Total number of subscribers |

**Available for:** `gumroad`
**Requires:** `GUMROAD_TOKEN` environment variable

### Lemon Squeezy Stats

| Property | Type | Source | Description |
|----------|------|--------|-------------|
| `formattedMRR` | `string` | Lemon Squeezy API | Formatted Monthly Recurring Revenue (e.g., `"$1,234.56"`) |
| `orderCount` | `number` | Lemon Squeezy API | Total number of orders |
| `customerCount` | `number` | Lemon Squeezy API | Total number of customers |

**Available for:** `lemonsqueezy`
**Requires:** `LS_TOKEN` environment variable

### Dev.to Stats

| Property | Type | Source | Description |
|----------|------|--------|-------------|
| `articleCount` | `number` | Dev.to API | Total number of articles published |
| `totalViews` | `number` | Dev.to API | Sum of page views across all articles |
| `totalReactions` | `number` | Dev.to API | Total reactions across all articles |

**Available for:** `devto`
**Requires:** No authentication (public API). Optional: `DEV_TO_API_KEY` env var enables `page_views_count` for accurate `totalViews`.

## Stats by Project Type

| Type | GitHub Stats | NPM Stats | PH Stats | YouTube Stats | Gumroad Stats | LS Stats | DevTo Stats |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `github` | ✅ | — | — | — | — | — | — |
| `npm` | — | ✅ | — | — | — | — | — |
| `hybrid` | ✅ | ✅ | — | — | — | — | — |
| `product-hunt` | — | — | ✅ | — | — | — | — |
| `youtube` | — | — | — | ✅ | — | — | — |
| `gumroad` | — | — | — | — | ✅ | — | — |
| `lemonsqueezy` | — | — | — | — | — | ✅ | — |
| `devto` | — | — | — | — | — | — | ✅ |
| `manual` | — | — | — | — | — | — | — |

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
  if (project.stats?.subscribers) {
    stats.push(`${project.stats.subscribers} subscribers`)
  }
  if (project.stats?.formattedRevenue) {
    stats.push(`${project.stats.formattedRevenue} revenue`)
  }
  if (project.stats?.articleCount) {
    stats.push(`${project.stats.articleCount} articles`)
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

Manual projects that don't provide explicit stats will have `stats: null`.

## Normalization

Use `normalizeStats` to format all stats for display:

```tsx
import { normalizeStats } from '@manningworks/projex'

const formattedStats = normalizeStats(project.stats || {}, project.type)
// [{ label: 'Stars', value: '1.2K' }, { label: 'Revenue', value: '$1,234.56' }, ...]
```

See [normalizeStats](../utilities/normalize-stats) for all output labels.

## Manual Stats Override

For `manual` project types, you can provide any stats values directly:

```tsx
{
  id: 'client-project',
  type: 'manual',
  status: 'shipped',
  name: 'Client Website',
  stats: {
    // You can use any stat field as a manual override
    downloads: '5000',
    version: '2.1.0',
  }
}
```

For fetched types, input `stats` override values are merged with fetched data (input values take precedence).

## Related

- [normalizeStats](../utilities/normalize-stats) — Format stats for display
- [ProjexProject](./projex-project) — Full project type with stats field
- [GitHubRepoData](./github-repo-data) — Raw GitHub data source
- [NpmPackageData](./npm-package-data) — Raw npm data source
- [ProductHuntPostData](./product-hunt-post-data) — Raw Product Hunt data source

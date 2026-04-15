# DevToArticleData

Article data structure returned by Dev.to API. Used internally by `fetchDevToUser` to aggregate article statistics.

## Definition

```tsx
interface DevToArticleData {
  id: number
  title: string
  page_views_count?: number
  positive_reactions_count?: number
  public_reactions_count?: number
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | `number` | Unique article identifier |
| `title` | `string` | Article title |
| `page_views_count` | `number?` | Total page views (only available with authenticated requests) |
| `positive_reactions_count` | `number?` | Deprecated — use `public_reactions_count` |
| `public_reactions_count` | `number?` | Total public reactions (likes, unicorns, reading list additions) |

## Usage

Individual article data is fetched internally and aggregated into `DevToUserData` stats. You typically work with the aggregated data rather than individual articles:

```tsx
import { fetchDevToUser } from '@manningworks/projex'
import type { DevToUserData } from '@manningworks/projex'

const data: DevToUserData | null = await fetchDevToUser('username')

if (data) {
  console.log(`User has ${data.articleCount} articles`)
  console.log(`Total views: ${data.totalViews}`)
  console.log(`Total reactions: ${data.totalReactions}`)
}
```

## Aggregation

The `fetchDevToUser` function fetches up to 1000 articles and aggregates them into:

```tsx
interface DevToUserData {
  articleCount: number      // Count of articles returned
  totalViews: number         // Sum of all page_views_count (0 if unavailable)
  totalReactions: number  // Sum of public_reactions_count
}
```

### Calculation Details

- **articleCount**: `data.length` — Number of articles returned by the API
- **totalViews**: `sum of page_views_count` across all articles (falls back to `0` when unavailable for unauthenticated requests)
- **totalReactions**: Sum of `public_reactions_count` across all articles (falls back to `positive_reactions_count`, then `0`)

## API Source

Data is fetched from:
- `https://dev.to/api/articles?username={username}&per_page=1000`

The API is public and does not require authentication. However, `page_views_count` is only available with an `api-key` header (set via `DEV_TO_API_KEY` env var). Rate limits apply but are generous.

## Related

- `DevToUserData` — Aggregated user data type
- [fetchDevToUser](../utilities/fetch-devto-user) — Fetch Dev.to user data
- [ProjectStats](./project-stats) — Stats type when embedded in a project
- Dev.to API docs: https://developers.forem.dev/api

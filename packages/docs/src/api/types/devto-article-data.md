# DevToArticleData

Article data structure returned by Dev.to API. Used within DevToUserData for individual article information.

## Definition

```tsx
interface DevToArticleData {
  id: number
  title: string
  description: string
  published_at: string
  url: string
  page_views_count: number
  positive_reactions_count: number
}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| id | `number` | Unique article identifier |
| title | `string` | Article title |
| description | `string` | Article description/summary |
| published_at | `string` | ISO 8601 publication date |
| url | `string` | Article URL |
| page_views_count | `number` | Total page views |
| positive_reactions_count | `number` | Total positive reactions (likes, etc.) |

## Usage

Article data is returned as an array within `DevToUserData`:

```tsx
import { fetchDevToUser } from '@reallukemanning/folio'
import type { DevToUserData } from '@reallukemanning/folio'

const data: DevToUserData | null = await fetchDevToUser('username')

if (data) {
  console.log(`User has ${data.articleCount} articles`)

  // Access individual article statistics
  // Articles are aggregated in stats, not exposed individually
  console.log(`Total views: ${data.totalViews}`)
  console.log(`Average reactions: ${data.averageReactions}`)
}
```

## Aggregated Stats

The `fetchDevToUser` function aggregates article data into stats:

```tsx
interface DevToUserData {
  articleCount: number      // Count of articles
  totalViews: number         // Sum of page_views_count
  averageReactions: number  // Average of positive_reactions_count
}
```

## Related

- `DevToUserData` - Complete user data with aggregated stats
- `fetchDevToUser` - Fetch Dev.to user data
- Dev.to API docs: https://developers.forem.dev/api

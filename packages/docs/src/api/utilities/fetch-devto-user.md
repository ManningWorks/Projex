# fetchDevToUser

Fetch article data from Dev.to API for a user.

## Signature

```tsx
function fetchDevToUser(username: string): Promise<DevToUserData | null>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| username | `string` | Dev.to username |

## Returns

`Promise<DevToUserData | null>` - User data or `null` on error

## Types

```tsx
interface DevToUserData {
  articleCount: number
  totalViews: number
  totalReactions: number
}
```

## Behavior

- Uses `force-cache` for build-time caching
- Returns `null` on any error (network, not found)
- Fetches up to 1000 articles per user
- Calculates aggregate statistics from all articles
- Supports optional authentication via `DEV_TO_API_KEY` env var (needed for page view counts)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DEV_TO_API_KEY` | No | Dev.to API key. Without it, `page_views_count` is unavailable and `totalViews` will be `0`. Create one at https://dev.to/settings/extensions |

### Rate Limits

- Dev.to rate limits apply
- Returns `null` on rate limit errors

## Example

```tsx
import { fetchDevToUser } from '@manningworks/projex'

const data = await fetchDevToUser('ben')

if (data) {
  console.log(data.articleCount)      // 150+
  console.log(data.totalViews)         // 500000+
  console.log(data.totalReactions)   // 675
}
```

## Error Handling

The function never throws - it returns `null` for any failure:

```tsx
const data = await fetchDevToUser('nonexistentuser')
// data is null (404)

const data = await fetchDevToUser('user_without_articles')
// data is { articleCount: 0, totalViews: 0, totalReactions: 0 }
```

## Calculation Details

- `articleCount`: Number of articles returned by API
- `totalViews`: Sum of `page_views_count` for all articles (falls back to `0` when unavailable for unauthenticated requests)
- `totalReactions`: Sum of `public_reactions_count` across all articles (falls back to `positive_reactions_count`, then `0`)

## Usage in normalise

This function is called internally by `normalise` for `devto` project types:

```tsx
const project = await normalise({
  id: 'my-blog',
  type: 'devto',
  username: 'ben',
  status: 'active'
})
```

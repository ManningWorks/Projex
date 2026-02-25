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
  averageReactions: number
}
```

## Behavior

- Uses `force-cache` for build-time caching
- Returns `null` on any error (network, not found)
- Fetches up to 1000 articles per user
- Calculates aggregate statistics from all articles
- Does not require authentication (public data only)

## Environment Variables

No environment variables required. Dev.to public API does not require authentication.

### Rate Limits

- Dev.to rate limits apply
- Returns `null` on rate limit errors

## Example

```tsx
import { fetchDevToUser } from '@reallukemanning/folio'

const data = await fetchDevToUser('ben')

if (data) {
  console.log(data.articleCount)      // 150+
  console.log(data.totalViews)         // 500000+
  console.log(data.averageReactions)   // 45
}
```

## Error Handling

The function never throws - it returns `null` for any failure:

```tsx
const data = await fetchDevToUser('nonexistentuser')
// data is null (404)

const data = await fetchDevToUser('user_without_articles')
// data is { articleCount: 0, totalViews: 0, averageReactions: 0 }
```

## Calculation Details

- `articleCount`: Number of articles returned by API
- `totalViews`: Sum of `page_views_count` for all articles
- `averageReactions`: Average of `positive_reactions_count` across all articles (rounded to nearest integer)

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

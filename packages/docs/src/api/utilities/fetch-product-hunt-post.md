# fetchProductHuntPost

Fetch post data from the Product Hunt API.

## Signature

```tsx
function fetchProductHuntPost(slug: string): Promise<ProductHuntPostData | null>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| slug | `string` | Product Hunt post slug |

## Returns

`Promise<ProductHuntPostData | null>` - Post data or `null` on error

## Types

```tsx
interface ProductHuntPostData {
  name: string
  tagline: string
  description: string
  votes_count: number
  comments_count: number
  featured_at: string | null
  website: string
  url: string
}
```

## Behavior

- Uses `force-cache` for build-time caching
- Returns `null` on any error
- Logs warning if `PRODUCT_HUNT_TOKEN` is not set

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PRODUCT_HUNT_TOKEN` | Yes | Product Hunt API token |

## Example

```tsx
import { fetchProductHuntPost } from '@folio/core'

const data = await fetchProductHuntPost('my-product')

if (data) {
  console.log(data.votes_count)    // Upvotes
  console.log(data.comments_count) // Comments
  console.log(data.featured_at)    // Featured date
}
```

## Error Handling

The function never throws - it returns `null` for any failure:

```tsx
const data = await fetchProductHuntPost('nonexistent-product')
// data is null
```

## Usage in normalise

This function is called internally by `normalise` for `product-hunt` project types:

```tsx
// normalise calls fetchProductHuntPost internally
const project = await normalise({
  id: 'my-product',
  type: 'product-hunt',
  slug: 'my-product',
  status: 'shipped'
})
```

## Note

Unlike GitHub and npm, the Product Hunt API requires authentication. Without `PRODUCT_HUNT_TOKEN`, the function returns `null` immediately.

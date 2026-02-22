# ProductHuntPostData

Interface for Product Hunt API response data.

## Definition

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

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Product name |
| `tagline` | `string` | Product tagline |
| `description` | `string` | Full description |
| `votes_count` | `number` | Upvote count |
| `comments_count` | `number` | Comment count |
| `featured_at` | `string \| null` | Featured date |
| `website` | `string` | Product website URL |
| `url` | `string` | Product Hunt URL |

## Usage

```tsx
import { fetchProductHuntPost } from '@reallukemanning/folio'
import type { ProductHuntPostData } from '@reallukemanning/folio'

const data: ProductHuntPostData | null = await fetchProductHuntPost('my-product')

if (data) {
  console.log(data.votes_count)
  console.log(data.comments_count)
}
```

## Export

```tsx
import type { ProductHuntPostData } from '@reallukemanning/folio'
```

## Authentication

Requires `PRODUCT_HUNT_TOKEN` environment variable.

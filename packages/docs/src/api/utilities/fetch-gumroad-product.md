# fetchGumroadProduct

Fetch product data from Gumroad API.

## Signature

```tsx
function fetchGumroadProduct(productId: string): Promise<GumroadProductData | null>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| productId | `string` | Gumroad product ID |

## Returns

`Promise<GumroadProductData | null>` - Product data or `null` on error

## Types

```tsx
interface GumroadProductData {
  formattedRevenue: string
  salesCount: number
  subscriberCount: number
}
```

## Behavior

- Uses `force-cache` for build-time caching
- Returns `null` on any error (network, auth, not found)
- Logs warning if `GUMROAD_TOKEN` is not set
- Uses Bearer token authentication

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GUMROAD_TOKEN` | Yes | Gumroad access token |

### Getting an Access Token

1. Go to [Gumroad Settings](https://app.gumroad.com/settings/api_tokens)
2. Create a new access token
3. Set `GUMROAD_TOKEN` environment variable

### Rate Limits

- Rate limited by Gumroad
- Returns `null` on rate limit errors

## Example

```tsx
import { fetchGumroadProduct } from '@reallukemanning/folio'

const data = await fetchGumroadProduct('prod_test123')

if (data) {
  console.log(data.formattedRevenue)  // '$1,234.56'
  console.log(data.salesCount)        // 100
  console.log(data.subscriberCount)   // 50
}
```

## Error Handling

The function never throws - it returns `null` for any failure:

```tsx
const data = await fetchGumroadProduct('invalid_id')
// data is null

const data = await fetchGumroadProduct('prod_nonexistent')
// data is null (404)
```

## Usage in normalise

This function is called internally by `normalise` for `gumroad` project types:

```tsx
const project = await normalise({
  id: 'my-product',
  type: 'gumroad',
  productId: 'prod_test123',
  status: 'active'
})
```

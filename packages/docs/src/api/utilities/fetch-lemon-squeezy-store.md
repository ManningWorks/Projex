# fetchLemonSqueezyStore

Fetch store metrics from Lemon Squeezy API.

## Signature

```tsx
function fetchLemonSqueezyStore(storeId: string): Promise<LemonSqueezyStoreData | null>
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| storeId | `string` | Lemon Squeezy store ID |

## Returns

`Promise<LemonSqueezyStoreData | null>` - Store data or `null` on error

## Types

```tsx
interface LemonSqueezyStoreData {
  formattedMRR: string
  orderCount: number
  customerCount: number
}
```

## Behavior

- Uses `force-cache` for build-time caching
- Returns `null` on any error (network, auth, not found)
- Logs warning if `LS_TOKEN` is not set
- Uses Bearer token authentication
- Includes `Accept: application/vnd.api+json` header

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LS_TOKEN` | Yes | Lemon Squeezy API key |

### Getting an API Key

1. Go to [Lemon Squeezy Settings](https://app.lemonsqueezy.com/settings/api)
2. Create a new API key
3. Set `LS_TOKEN` environment variable

### Rate Limits

- Rate limited by Lemon Squeezy
- Returns `null` on rate limit errors

## Example

```tsx
import { fetchLemonSqueezyStore } from '@manningworks/projex'

const data = await fetchLemonSqueezyStore('1')

if (data) {
  console.log(data.formattedMRR)      // '$1,234.56'
  console.log(data.orderCount)         // 100
  console.log(data.customerCount)      // 50
}
```

## Error Handling

The function never throws - it returns `null` for any failure:

```tsx
const data = await fetchLemonSqueezyStore('invalid_id')
// data is null

const data = await fetchLemonSqueezyStore('99999')
// data is null (404)
```

## Usage in normalise

This function is called internally by `normalise` for `lemonsqueezy` project types:

```tsx
const project = await normalise({
  id: 'my-saas',
  type: 'lemonsqueezy',
  storeId: '1',
  status: 'active'
})
```
